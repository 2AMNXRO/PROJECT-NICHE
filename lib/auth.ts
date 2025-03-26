"use client"

// This is a simplified auth implementation for demonstration purposes
// In a real application, you would use a proper auth provider like NextAuth.js or Clerk

import { useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null
  failedAttempts: number
  isLocked: boolean
}

// Mock user data
const mockUser: User = {
  id: "user-1",
  name: "Demo User",
  email: "demo@example.com",
  image: "/placeholder.svg?height=100&width=100",
}

// Maximum allowed login attempts before locking
const MAX_LOGIN_ATTEMPTS = 3

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    failedAttempts: 0,
    isLocked: false,
  })

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("user")
    const failedAttempts = Number.parseInt(localStorage.getItem("failedAttempts") || "0")
    const isLocked = localStorage.getItem("isLocked") === "true"

    setAuthState((prev) => ({
      ...prev,
      user: storedUser ? JSON.parse(storedUser) : null,
      isLoading: false,
      failedAttempts,
      isLocked,
    }))
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if account is locked
      if (authState.isLocked) {
        throw new Error("Account is locked due to too many failed attempts. Please reset your password.")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // In a real app, you would validate credentials against your backend
      // For demo, we'll simulate a successful login only for specific credentials
      // and track failed attempts for any other combination

      if (email === "demo@example.com" && password === "password123") {
        // Reset failed attempts on successful login
        localStorage.setItem("failedAttempts", "0")
        localStorage.setItem("isLocked", "false")
        localStorage.setItem("user", JSON.stringify(mockUser))

        setAuthState((prev) => ({
          ...prev,
          user: mockUser,
          isLoading: false,
          error: null,
          failedAttempts: 0,
          isLocked: false,
        }))

        return true
      } else {
        // Increment failed attempts
        const newFailedAttempts = authState.failedAttempts + 1
        const newIsLocked = newFailedAttempts >= MAX_LOGIN_ATTEMPTS

        localStorage.setItem("failedAttempts", newFailedAttempts.toString())
        localStorage.setItem("isLocked", newIsLocked.toString())

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: newIsLocked
            ? "Account locked due to too many failed attempts. Please reset your password."
            : `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newFailedAttempts} attempts remaining.`,
          failedAttempts: newFailedAttempts,
          isLocked: newIsLocked,
        }))

        return false
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }))
      return false
    }
  }

  const signInWithGoogle = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if account is locked
      if (authState.isLocked) {
        throw new Error("Account is locked due to too many failed attempts. Please reset your password.")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would use the Google OAuth flow
      // For demo, we'll just simulate a successful login

      // Reset failed attempts on successful login
      localStorage.setItem("failedAttempts", "0")
      localStorage.setItem("isLocked", "false")
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...mockUser,
          name: "Google User",
          email: "google.user@gmail.com",
        }),
      )

      setAuthState({
        user: {
          ...mockUser,
          name: "Google User",
          email: "google.user@gmail.com",
        },
        isLoading: false,
        error: null,
        failedAttempts: 0,
        isLocked: false,
      })

      return true
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }))
      return false
    }
  }

  const resetPassword = async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send a password reset email
      // For demo, we'll just simulate a successful password reset

      // Reset failed attempts and unlock account
      localStorage.setItem("failedAttempts", "0")
      localStorage.setItem("isLocked", "false")

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        failedAttempts: 0,
        isLocked: false,
      }))

      return true
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }))
      return false
    }
  }

  const signOut = () => {
    localStorage.removeItem("user")
    // Note: We don't reset failedAttempts or isLocked on signOut
    // This ensures the account remains locked even after signing out

    setAuthState((prev) => ({
      ...prev,
      user: null,
      isLoading: false,
      error: null,
    }))
  }

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    failedAttempts: authState.failedAttempts,
    isLocked: authState.isLocked,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut,
  }
}

