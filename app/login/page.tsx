"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { auth, db, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore"

export default function LoginPage() {
  const router = useRouter()
  const { user, setUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/role-selection")
      }
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const uid = userCred.user.uid

      const userDoc = await getDoc(doc(db, "users", uid))
      if (!userDoc.exists()) {
        throw new Error("User profile not found in Firestore.")
      }

      const userData = userDoc.data()
      setUser(userData)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name || "User"}!`,
      })

      setTimeout(() => {
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/role-selection")
        }
      }, 200)

    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const googleUser = result.user
      const email = googleUser.email

      if (!email) throw new Error("Google account missing email address.")

      // Check if user with same email already exists
      const usersRef = collection(db, "users")
      const existingQuery = query(usersRef, where("email", "==", email))
      const existingSnap = await getDocs(existingQuery)

      let userData

      if (!existingSnap.empty) {
        // Use existing user data
        userData = existingSnap.docs[0].data()
      } else {
        // Create new user document
        userData = {
          id: googleUser.uid,
          name: googleUser.displayName,
          email: email,
          avatarUrl: googleUser.photoURL,
          role: "user",
          userType: null,
          isPaid: false,
          createdAt: new Date().toISOString(),
        }

        await setDoc(doc(db, "users", googleUser.uid), userData)
      }

      setUser(userData)

      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name || "User"}!`,
      })

      setTimeout(() => {
        router.push(userData.isPaid ? "/role-selection" : "/payment")
      }, 200)

    } catch (error: any) {
      console.error("Google login error:", error)
      setError("Google login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">Log in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

            <Button
              type="button"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in with Google...
                </>
              ) : (
                "Sign in with Google"
              )}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline">
                Create account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
