"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "@/lib/database-types"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "customer" | "admin"
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user.id)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // First check if the customer exists
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Customer doesn't exist yet, let's create it
          const { data: authUser } = await supabase.auth.getUser()
          
          if (authUser?.user) {
            const metadata = authUser.user.user_metadata
            const { error: insertError } = await supabase
              .from('customers')
              .insert({
                id: userId,
                email: authUser.user.email!,
                first_name: metadata?.first_name || '',
                last_name: metadata?.last_name || '',
                is_admin: false
              })

            if (insertError) {
              console.error("Error creating customer profile:", insertError)
              throw insertError
            }

            // Fetch the newly created profile
            const { data: newProfile, error: refetchError } = await supabase
              .from('customers')
              .select('*')
              .eq('id', userId)
              .single()

            if (refetchError) throw refetchError
            if (newProfile) {
              setUser({
                id: newProfile.id,
                email: newProfile.email,
                firstName: newProfile.first_name || "",
                lastName: newProfile.last_name || "",
                role: newProfile.is_admin ? "admin" : "customer",
              })
              return
            }
          }
        }
        throw error
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          role: data.is_admin ? "admin" : "customer",
        })
      }
    } catch (error) {
      console.error("Error handling user profile:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
        },
      })

      if (error) throw error

      if (data.user) {
        setSupabaseUser(data.user)
        await fetchUserProfile(data.user.id)
        setIsLoading(false)
        return true
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Proceed with registration in auth.users first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      })

      if (error) throw error

      if (data.user) {
        setIsLoading(false)
        
        // If there's no session, it means email confirmation is required
        if (data.session === null) {
          // Create a function that will be triggered after email confirmation
          const { error: functionError } = await supabase.functions.invoke('create-customer-profile', {
            body: {
              userId: data.user.id,
              email: data.user.email!,
              firstName: firstName,
              lastName: lastName
            }
          })

          if (functionError) {
            console.error("Failed to setup post-confirmation handler:", functionError)
          }

          return { 
            success: true, 
            message: "Registration successful! Please check your email to verify your account before signing in." 
          }
        }

        // If we have a session, user is already confirmed, create profile immediately
        const { error: profileError } = await supabase
          .from("customers")
          .insert<Database["public"]["Tables"]["customers"]["Insert"]>({
            id: data.user.id,
            email: data.user.email!,
            first_name: firstName,
            last_name: lastName,
            is_admin: false,
          })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // If profile creation fails, clean up the auth user
          await supabase.auth.admin.deleteUser(data.user.id)
          throw new Error("Failed to create user profile")
        }

        return { success: true, message: "Registration successful! You can now sign in." }
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setIsLoading(false)
      if (error.message?.includes("already registered")) {
        return { success: false, message: "This email is already registered. Please sign in instead." }
      }
      return { success: false, message: "Registration failed. Please try again." }
    }

    setIsLoading(false)
    return { success: false, message: "Registration failed. Please try again." }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
