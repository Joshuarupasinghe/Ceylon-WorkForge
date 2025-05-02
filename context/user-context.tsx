"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Define user types
type UserType = "seeker" | "poster"
type UserRole = "user" | "admin"

// Define user interface
interface User {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  userType?: UserType
  isPaid: boolean
  avatarUrl?: string | null
}

// Define context interface
interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  updateUserType: (userType: UserType) => Promise<void>
  updatePaymentStatus: (isPaid: boolean) => Promise<void>
  updateProfile: (profile: Partial<User>) => Promise<void>
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock user database for demo purposes
const mockUsers = [
  {
    id: "user-1",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    role: "user" as UserRole,
    userType: "seeker" as UserType,
    isPaid: true,
    avatarUrl: null,
  },
  {
    id: "admin-1",
    email: "admin@ceylonworkforce.lk",
    password: "admin123",
    name: "Administrator",
    role: "admin" as UserRole,
    isPaid: true,
    avatarUrl: null,
  },
]

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  // Login function
  const login = async (email: string, password: string) => {
    console.log("Login attempt:", { email, password: password.length + " chars" })

    // Find user in mock database
    const foundUser = mockUsers.find((u) => {
      const emailMatch = u.email.toLowerCase() === email.toLowerCase()
      const passwordMatch = u.password === password
      console.log("Checking user:", u.email, "Email match:", emailMatch, "Password match:", passwordMatch)
      return emailMatch && passwordMatch
    })

    if (!foundUser) {
      console.error("No matching user found in database")
      throw new Error("Invalid email or password")
    }

    console.log("User found:", foundUser.email, foundUser.role)

    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
  }

  // Register function
  const register = async (email: string, password: string, name: string) => {
    // Check if user already exists
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: "user" as UserRole,
      isPaid: false,
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Set user without password
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
  }

  // Logout function
  const logout = async () => {
    setUser(null)
  }

  // Update user type
  const updateUserType = async (userType: UserType) => {
    if (!user) throw new Error("No user logged in")

    // Update user in context
    setUser({ ...user, userType })

    // Update user in mock database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], userType }
    }
  }

  // Update payment status
  const updatePaymentStatus = async (isPaid: boolean) => {
    if (!user) throw new Error("No user logged in")

    // Update user in context
    setUser({ ...user, isPaid })

    // Update user in mock database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], isPaid }
    }
  }

  // Update profile
  const updateProfile = async (profile: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    // Update user in context
    setUser({ ...user, ...profile })

    // Update user in mock database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...profile }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        setUser,
        updateUserType,
        updatePaymentStatus,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
