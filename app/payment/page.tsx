"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, CreditCard, Calendar, Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { user, updatePaymentStatus, isLoading: userLoading } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isNewRegistration, setIsNewRegistration] = useState(false)
  const [isRedirectedFromRoleSelection, setIsRedirectedFromRoleSelection] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    if (!userLoading) {
      if (!user) {
        // No user is logged in, redirect to login
        router.push("/login")
        return
      }

      // Check if this is a new registration
      const justRegistered = sessionStorage.getItem("justRegistered") === "true"
      const redirectedFromRoleSelection = sessionStorage.getItem("redirectedFromRoleSelection") === "true"

      if (justRegistered) {
        // This is a new registration, allow access to payment page
        setIsNewRegistration(true)
        // Clear the flag after checking
        sessionStorage.removeItem("justRegistered")
      } else if (redirectedFromRoleSelection) {
        // This is a redirect from role selection, allow access to payment page
        setIsRedirectedFromRoleSelection(true)
        // Clear the flag after checking
        sessionStorage.removeItem("redirectedFromRoleSelection")
      } else if (user.isPaid) {
        // User has already paid, redirect to role selection
        router.push("/role-selection")
      }
    }
  }, [user, userLoading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format"
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    }

    // Format expiry date
    if (name === "expiryDate") {
      value = value.replace(/\D/g, "")
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) {
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Check if using test card
      const isTestCard = formData.cardNumber.replace(/\s/g, "") === "4242424242424242"

      if (!isTestCard) {
        setErrors({ form: "Payment failed. Please use the test card: 4242 4242 4242 4242" })
        setIsProcessing(false)
        return
      }

      // Store payment record in localStorage for demo purposes
      const paymentRecord = {
        id: crypto.randomUUID(),
        userId: user.id,
        amount: 19.99,
        currency: "USD",
        status: "completed",
        paymentMethod: "card",
        cardLast4: formData.cardNumber.slice(-4),
        createdAt: new Date().toISOString(),
      }

      // Store payment record in localStorage
      const payments = JSON.parse(localStorage.getItem("payments") || "[]")
      payments.push(paymentRecord)
      localStorage.setItem("payments", JSON.stringify(payments))

      // Update user payment status
      updatePaymentStatus(true)

      setIsSuccess(true)

      toast({
        title: "Payment successful",
        description: "Your account has been activated successfully.",
      })

      // Redirect after success message
      setTimeout(() => {
        router.push("/role-selection")
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setErrors({ form: "Payment processing failed. Please try again." })
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading state while checking user status
  if (userLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access this page.</p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">
            {isSuccess ? "Payment Successful!" : "Complete Your Registration"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? "Your account has been activated successfully."
              : "A one-time payment is required to activate your account"}
          </CardDescription>
        </CardHeader>

        {isSuccess ? (
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-lg font-medium">Thank you for your payment!</p>
            <p className="text-center text-muted-foreground mt-2">
              You will be redirected to your dashboard shortly...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <span className="text-sm font-medium">Ceylon Work Force Plan</span>
                </div>

                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly" className="p-4 border rounded-md mt-2">
                    <div className="flex justify-between">
                      <span>Monthly Subscription</span>
                      <span className="font-bold">$19.99</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly" className="p-4 border rounded-md mt-2">
                    <div className="flex justify-between">
                      <span>Yearly Subscription</span>
                      <span className="font-bold">$191.90</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="cardNumber" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-accent" />
                    Card Number
                  </Label>
                </div>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  disabled={isProcessing}
                />
                {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                <p className="text-xs text-muted-foreground">For testing, use card number: 4242 4242 4242 4242</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                {errors.cardName && <p className="text-sm text-destructive">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="expiryDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-accent" />
                      Expiry Date
                    </Label>
                  </div>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    maxLength={5}
                    disabled={isProcessing}
                  />
                  {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="cvv" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-accent" />
                      CVV
                    </Label>
                  </div>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    disabled={isProcessing}
                  />
                  {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                </div>
              </div>

              {errors.form && <p className="text-sm text-destructive text-center">{errors.form}</p>}
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
