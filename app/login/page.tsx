"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { GoogleLoginPopup } from "@/components/google-login-popup"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, error, loginWithCredentials, loginWithGoogle } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showGooglePopup, setShowGooglePopup] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const success = await loginWithCredentials(email, password)
    if (success) {
      router.push("/dashboard")
    }
  }

  const handleGoogleSignIn = () => {
    setShowGooglePopup(true)
  }

  const handleGoogleSuccess = async () => {
    await loginWithGoogle()
    router.push("/dashboard")
  }

  // Check if the error indicates account is locked
  const isAccountLocked = error?.includes("locked")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/placeholder.svg?height=30&width=30"
              alt="faceless niches logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="text-lg font-semibold">faceless niches</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#" className="text-sm hover:text-primary">
              Pricing
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              For Business
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Affiliate
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {isAccountLocked && (
              <Alert className="mb-6 bg-amber-900/20 border-amber-800 text-amber-300">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Your account has been locked due to too many failed login attempts.
                  <Link href="/reset-password" className="block mt-2 text-primary hover:underline">
                    Reset your password
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {error && !isAccountLocked && (
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-gray-800 border-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/reset-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-gray-800 border-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={isLoading || isAccountLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : isAccountLocked ? (
                  "Account Locked"
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="#" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isAccountLocked}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image
                    src="/placeholder.svg?height=16&width=16&text=G"
                    alt="Google"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                )}
                Sign in with Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <GoogleLoginPopup
        isOpen={showGooglePopup}
        onClose={() => setShowGooglePopup(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  )
}

