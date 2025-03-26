"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  const handleStartForFree = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=30&width=30"
              alt="faceless niches logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="text-lg font-semibold">faceless niches</span>
          </div>
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
            {user ? (
              <Link href="/dashboard" className="text-sm hover:text-primary">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm hover:text-primary">
                Log In
              </Link>
            )}
            <Button className="bg-primary hover:bg-primary-hover text-white">FREE TRIAL</Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Create Faceless Accounts in <span className="text-primary">One Click</span>
            </h1>
            <p className="text-xl mb-8">Use AI to automatically create and post custom videos daily</p>
            <Button
              className="bg-primary hover:bg-primary-hover text-white text-lg py-6 px-8"
              onClick={handleStartForFree}
            >
              START FOR FREE
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=400&width=225&text=Video ${i + 1}`}
                    alt={`Video ${i + 1}`}
                    width={225}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              We Get <span className="text-primary">Views</span>
            </h2>
            <p className="text-xl mb-8">Check out these results from some of our autopilot faceless creators</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden relative">
                  <Image
                    src={`/placeholder.svg?height=400&width=225&text=View ${i + 1}`}
                    alt={`View ${i + 1}`}
                    width={225}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  {(i === 0 || i === 3) && (
                    <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs py-1 px-2 rounded">
                      Pinned
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

