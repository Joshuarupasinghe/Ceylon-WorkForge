"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, CreditCard, Receipt, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BillingPage() {
  const router = useRouter()
  const { user, isLoading: userLoading, updatePaymentStatus } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("subscription")
  const { toast } = useToast()

  // Mock payment history
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "pay_1234567890",
      date: "2023-05-15",
      amount: 29.99,
      status: "completed",
      description: "Monthly Subscription",
    },
    {
      id: "pay_0987654321",
      date: "2023-04-15",
      amount: 29.99,
      status: "completed",
      description: "Monthly Subscription",
    },
  ])

  // Mock subscription data
  const [subscription, setSubscription] = useState({
    plan: "Professional",
    status: "active",
    nextBillingDate: "2023-06-15",
    amount: 29.99,
    paymentMethod: "Visa ending in 4242",
  })

  useEffect(() => {
    // Redirect if not logged in or is admin
    if (!userLoading && (!user || user.role === "admin")) {
      router.push("/login")
      return
    }

    // Load billing data
    const loadBillingData = async () => {
      setIsLoading(true)
      try {
        // In a real app, we would fetch billing data from an API
        // For now, we'll just use the mock data and add a delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update subscription status based on user's payment status
        if (user && user.isPaid) {
          setSubscription((prev) => ({ ...prev, status: "active" }))
        } else {
          setSubscription((prev) => ({ ...prev, status: "inactive" }))
        }
      } catch (error) {
        console.error("Error loading billing data:", error)
        toast({
          title: "Error",
          description: "Failed to load billing data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadBillingData()
    }
  }, [user, userLoading, router, toast])

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true)
      // In a real app, we would call an API to cancel the subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setSubscription((prev) => ({ ...prev, status: "cancelled" }))
      await updatePaymentStatus(false)

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      })
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      setIsLoading(true)
      // In a real app, we would call an API to reactivate the subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setSubscription((prev) => ({ ...prev, status: "active" }))
      await updatePaymentStatus(true)

      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated successfully.",
      })
    } catch (error) {
      console.error("Error reactivating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePaymentMethod = () => {
    toast({
      title: "Update Payment Method",
      description: "This feature is not available in the demo version.",
    })
  }

  if (userLoading || (isLoading && !user)) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground mb-8">Manage your subscription and payment information</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </div>
                  <Badge
                    variant={subscription.status === "active" ? "default" : "destructive"}
                    className={subscription.status === "active" ? "bg-green-500" : ""}
                  >
                    {subscription.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="text-lg font-semibold">{subscription.plan}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">Rs.{subscription.amount}/month</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                    <p className="text-lg font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {subscription.status === "active" ? subscription.nextBillingDate : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <p className="text-lg font-semibold flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {subscription.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start">
                    {subscription.status === "active" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    )}
                    <div>
                      <p className="font-medium">
                        {subscription.status === "active"
                          ? "Your subscription is active"
                          : "Your subscription is not active"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.status === "active"
                          ? "You have full access to all features."
                          : "Reactivate your subscription to regain access to all features."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                {subscription.status === "active" ? (
                  <>
                    <Button variant="destructive" onClick={handleCancelSubscription} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Cancel Subscription
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleReactivateSubscription}
                    disabled={isLoading}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Reactivate Subscription
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment-history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-4 py-3 text-sm">{payment.date}</td>
                          <td className="px-4 py-3 text-sm">{payment.description}</td>
                          <td className="px-4 py-3 text-sm">Rs.{payment.amount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant={payment.status === "completed" ? "outline" : "destructive"}
                              className={payment.status === "completed" ? "border-green-500 text-green-500" : ""}
                            >
                              {payment.status === "completed" ? (
                                <span className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              ) : (
                                payment.status
                              )}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {paymentHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No payment history found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
