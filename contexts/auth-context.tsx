"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  loginWithGoogle: () => Promise<void>
  loginWithCredentials: (email: string, password: string) => Promise<boolean>
  logout: () => void
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUser: User = {
  id: "user-1",
  name: "Demo User",
  email: "demo@example.com",
  image: "/placeholder.svg?height=100&width=100",
}

// Google user data
const googleUser: User = {
  id: "google-user-1",
  name: "Google User",
  email: "google.user@gmail.com",
  image: "/placeholder.svg?height=100&width=100&text=G",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  const MAX_LOGIN_ATTEMPTS = 3

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    const storedFailedAttempts = localStorage.getItem("failedAttempts")
    const storedIsLocked = localStorage.getItem("isLocked")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("user")
      }
    }

    if (storedFailedAttempts) {
      setFailedAttempts(Number.parseInt(storedFailedAttempts))
    }

    if (storedIsLocked) {
      setIsLocked(storedIsLocked === "true")
    }

    setIsLoading(false)
  }, [])

  const loginWithGoogle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate Google login
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(googleUser))
      localStorage.setItem("failedAttempts", "0")
      localStorage.setItem("isLocked", "false")

      setUser(googleUser)
      setFailedAttempts(0)
      setIsLocked(false)
    } catch (err) {
      setError("Failed to login with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithCredentials = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if account is locked
      if (isLocked) {
        throw new Error("Account is locked due to too many failed attempts. Please reset your password.")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials
      if (email === "demo@example.com" && password === "password123") {
        // Reset failed attempts on successful login
        localStorage.setItem("failedAttempts", "0")
        localStorage.setItem("isLocked", "false")
        localStorage.setItem("user", JSON.stringify(mockUser))

        setUser(mockUser)
        setFailedAttempts(0)
        setIsLocked(false)

        return true
      } else {
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1
        const newIsLocked = newFailedAttempts >= MAX_LOGIN_ATTEMPTS

        localStorage.setItem("failedAttempts", newFailedAttempts.toString())
        localStorage.setItem("isLocked", newIsLocked.toString())

        setFailedAttempts(newFailedAttempts)
        setIsLocked(newIsLocked)

        if (newIsLocked) {
          throw new Error("Account locked due to too many failed attempts. Please reset your password.")
        } else {
          throw new Error(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newFailedAttempts} attempts remaining.`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset failed attempts and unlock account
      localStorage.setItem("failedAttempts", "0")
      localStorage.setItem("isLocked", "false")

      setFailedAttempts(0)
      setIsLocked(false)

      return true
    } catch (err) {
      setError("Failed to reset password. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    error,
    loginWithGoogle,
    loginWithCredentials,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

