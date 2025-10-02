"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { User, Settings, ShoppingBag, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database-types'

type OrderWithItems = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    books: Pick<Database['public']['Tables']['books']['Row'], 'title'>
  })[]
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Database['public']['Tables']['customers']['Row'] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    const loadData = async () => {
      await Promise.all([fetchProfile(), fetchOrders()])
      setLoading(false)
    }
    
    loadData()
  }, [user])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      })
    }
  }

  const fetchOrders = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          order_items (
            id,
            quantity,
            price,
            books (title)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Map to the expected type with flattened items
      const mappedOrders: OrderWithItems[] = (data || []).map(order => ({
        ...order,
        order_items: order.order_items || []
      }))
      
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email
        })
        .eq('id', user.id)

      if (error) throw error
      
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20">
                    <Image
                      src={profile.avatar_url || '/placeholder-user.jpg'}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'No name set'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev!, first_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev!, last_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev!, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No orders yet</h3>
                  <p className="text-sm text-muted-foreground">
                    When you make your first purchase, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              Total: ${(order.total_amount || 0).toFixed(2)}
                            </p>
                            <span className={`text-sm px-2 py-1 rounded-full text-xs ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="divide-y">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="py-2 flex justify-between">
                              <div>
                                <p className="font-medium">{item.books.title}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}