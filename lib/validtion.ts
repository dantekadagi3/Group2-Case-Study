// utils/validation.ts

// Email validation using standard regex
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.trim()) return "Email is required"
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return null
}

// Password validation — you can adjust complexity rules as needed
export const validatePassword = (password: string): string | null => {
  if (!password.trim()) return "Password is required"
  if (password.length < 6) return "Password must be at least 6 characters long"
  
  // Optional: enforce stronger rules
  const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/
  if (!strongPassword.test(password)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number"
  }
  
  return null
}
