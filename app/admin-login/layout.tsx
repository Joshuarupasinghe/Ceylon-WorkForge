import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${inter.className} bg-background min-h-screen`}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <UserProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
        </UserProvider>
      </ThemeProvider>
    </div>
  )
}
