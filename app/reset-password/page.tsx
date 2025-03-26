"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { isLoading, error, resetPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const success = await resetPassword(email)
    if (success) {
      setIsSubmitted(true)
    }
  }

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
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter your email to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Password Reset Email Sent</h3>
                <p className="text-gray-400 mb-4">
                  We've sent a password reset link to <span className="text-primary">{email}</span>. Please check your
                  inbox and follow the instructions.
                </p>
                <Button className="bg-primary hover:bg-primary-hover" onClick={() => router.push("/login")}>
                  Return to Login
                </Button>
              </div>
            ) : (
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

