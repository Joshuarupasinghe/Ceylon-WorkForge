"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, CheckCircle, CreditCard, Calendar, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { user, updatePaymentStatus, isLoading: userLoading } = useUser()
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly")
  const [formData, setFormData] = useState({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [last4, setLast4] = useState("")
  const { toast } = useToast()

  // Redirect if not logged in or already paid
  useEffect(() => {
    if (!userLoading) {
      if (!user) return router.push("/login")
      if (user.isPaid) return router.push("/role-selection")
    }
  }, [user, userLoading, router])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      errs.cardNumber = "Enter 16 digits"
    if (!formData.cardName.trim()) errs.cardName = "Required"
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) errs.expiryDate = "MM/YY"
    if (!/^\d{3,4}$/.test(formData.cvv)) errs.cvv = "3–4 digits"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()
    }
    if (name === "expiryDate") {
      value = value.replace(/\D/g, "").slice(0, 4)
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev }
        delete newErr[name]
        return newErr
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !user) return
    setProcessing(true)
    try {
      // Derive last 4 digits
      const digits = formData.cardNumber.replace(/\s/g, "")
      const last4Digits = digits.slice(-4)
      setLast4(last4Digits)

      // Determine amount in LKR
      const amount = plan === "yearly" ? 38000 : 3500

      // Write payment record
      await addDoc(collection(db, "payments"), {
        userId:        user.id,
        amount,
        currency:      "LKR",
        status:        "completed",
        paymentMethod: "card",
        cardLast4:     last4Digits,
        createdAt:     serverTimestamp(),
      })

      // Flip user.isPaid flag
      await updateDoc(doc(db, "users", user.id), { isPaid: true })
      updatePaymentStatus(true)

      setSuccess(true)
      toast({ title: "Payment successful", description: `Card ending in **** ${last4Digits}` })
      setTimeout(() => router.push("/role-selection"), 1500)
    } catch (err: any) {
      console.error(err)
      setErrors({ form: err.message || "Payment failed" })
    } finally {
      setProcessing(false)
    }
  }

  if (userLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  if (!user) return null

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {success ? "Payment Complete!" : "Complete Your Registration"}
          </CardTitle>
          <CardDescription className="text-center">
            {success
              ? `Your card ending in **** ${last4} has been saved.`
              : "A one-time payment in Rs. is required."}
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium">
              Redirecting to the next step…
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Subscription Plan</span>
                  <span className="font-medium">Ceylon Work Force</span>
                </Label>
                <Tabs value={plan} onValueChange={setPlan}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly">
                    <div className="flex justify-between">
                      <span>Monthly</span>
                      <span className="font-bold">Rs. 3,500</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly">
                    <div className="flex justify-between">
                      <span>Yearly</span>
                      <span className="font-bold">Rs. 38,000</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cardNumber" className="flex items-center">
                  <CreditCard className="mr-2" /> Card Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  disabled={processing}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">{errors.cardNumber}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleChange}
                  disabled={processing}
                />
                {errors.cardName && (
                  <p className="text-sm text-destructive">{errors.cardName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="expiryDate" className="flex items-center">
                    <Calendar className="mr-2" /> Expiry
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    maxLength={5}
                    disabled={processing}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive">{errors.expiryDate}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cvv" className="flex items-center">
                    <Lock className="mr-2" /> CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    disabled={processing}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {errors.form && (
                <p className="text-center text-sm text-destructive">{errors.form}</p>
              )}
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Processing...
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
