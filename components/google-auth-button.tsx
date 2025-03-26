"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface GoogleAuthButtonProps {
  onSuccess: () => void
  onError: (error: string) => void
  disabled?: boolean
  isLocked?: boolean
}

export function GoogleAuthButton({ onSuccess, onError, disabled = false, isLocked = false }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  const handleGoogleSignIn = () => {
    if (isLocked) {
      onError("Account is locked due to too many failed attempts. Please reset your password.")
      return
    }

    setShowDialog(true)
    setStep(1)
    setError("")
  }

  const handleContinue = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setStep(2)
  }

  const handleSubmit = () => {
    if (!password) {
      setError("Please enter your password")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowDialog(false)

      // Reset form
      setEmail("")
      setPassword("")
      setStep(1)

      // Call success callback
      onSuccess()
    }, 1500)
  }

  const handleClose = () => {
    setShowDialog(false)
    setEmail("")
    setPassword("")
    setStep(1)
    setError("")
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLocked}
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white text-black p-0 max-w-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <Image src="/placeholder.svg?height=24&width=24&text=G" alt="Google" width={24} height={24} />
            </div>

            {step === 1 ? (
              <>
                <DialogTitle className="text-xl text-center mb-6">Sign in with Google</DialogTitle>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="your.email@gmail.com"
                    />
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="flex justify-between items-center pt-4">
                    <button type="button" className="text-blue-600 text-sm" onClick={handleClose}>
                      Cancel
                    </button>
                    <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleContinue}>
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <DialogTitle className="text-xl text-center mb-2">Welcome</DialogTitle>
                <DialogDescription className="text-center mb-6">{email}</DialogDescription>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter your password"
                    />
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="flex justify-between items-center pt-4">
                    <button type="button" className="text-blue-600 text-sm" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign in
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

