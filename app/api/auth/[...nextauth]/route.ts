import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock user data
const mockUser = {
  id: "user-1",
  name: "Demo User",
  email: "demo@example.com",
  image: "/placeholder.svg?height=100&width=100",
}

// Track failed login attempts
let failedAttempts = 0
let isAccountLocked = false
const MAX_LOGIN_ATTEMPTS = 3

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if account is locked
        if (isAccountLocked) {
          throw new Error("Account is locked due to too many failed attempts. Please reset your password.")
        }

        // Check credentials
        if (credentials?.email === "demo@example.com" && credentials?.password === "password123") {
          // Reset failed attempts on successful login
          failedAttempts = 0
          isAccountLocked = false

          return mockUser
        } else {
          // Increment failed attempts
          failedAttempts += 1

          // Lock account if max attempts reached
          if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
            isAccountLocked = true
            throw new Error("Account locked due to too many failed attempts. Please reset your password.")
          }

          throw new Error(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - failedAttempts} attempts remaining.`)
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

