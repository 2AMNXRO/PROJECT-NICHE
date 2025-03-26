"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface GoogleLoginPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GoogleLoginPopup({ isOpen, onClose, onSuccess }: GoogleLoginPopupProps) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setEmail("")
      setPassword("")
      setError("")
      setIsLoading(false)
    }
  }, [isOpen])

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

    // Simulate Google authentication
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img src="/placeholder.svg?height=24&width=24&text=G" alt="Google" width={24} height={24} />
          </div>

          {step === 1 ? (
            <>
              <DialogTitle className="text-xl text-center mb-6">Sign in with Google</DialogTitle>
              <div className="space-y-4">
                <div>
                  <Label className="text-black">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 text-black"
                    placeholder="your.email@gmail.com"
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex justify-between items-center pt-4">
                  <Button type="button" variant="ghost" className="text-blue-600" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="button" className="bg-blue-600 text-white" onClick={handleContinue}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogTitle className="text-xl text-center mb-2">Welcome</DialogTitle>
              <p className="text-center mb-6 text-gray-600">{email}</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-black">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 text-black"
                    placeholder="Enter your password"
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex justify-between items-center pt-4">
                  <Button type="button" variant="ghost" className="text-blue-600" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" className="bg-blue-600 text-white" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

