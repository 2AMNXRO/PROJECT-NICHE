"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const handleSignOut = () => {
    logout()
    router.push("/")
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {user.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <span className="text-white font-semibold">{user.name.charAt(0) || user.email.charAt(0)}</span>
                </div>
              )}
              <span className="text-sm">Welcome, {user.name}</span>
            </div>
            <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-300 mb-4">
              Welcome to faceless niches! Start creating your first faceless account by following our simple guide.
            </p>
            <Button className="bg-primary hover:bg-primary-hover">Create Account</Button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Your Analytics</h2>
            <p className="text-gray-300 mb-4">Track your performance and see how your content is performing.</p>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
              View Analytics
            </Button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Content Library</h2>
            <p className="text-gray-300 mb-4">Browse our library of templates and content ideas for your next post.</p>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-700">
              Explore Library
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

