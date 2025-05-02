"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu, User, X, Plus, CreditCard, AlertCircle, Briefcase, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function Navbar() {
  const { user, logout, updateUserType } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handlePostJob = () => {
    router.push("/create-job")
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  // Determine user-specific nav items based on role and userType
  const userNavItems = user
    ? user.role === "admin"
      ? [{ name: "Admin Dashboard", href: "/admin" }]
      : user.userType === "seeker"
        ? [{ name: "Jobs", href: "/job-seekers" }]
        : [{ name: "Talent", href: "/job-posters" }]
    : []

  const allNavItems = [...navItems, ...userNavItems]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-subtle bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Ceylon Work Force Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-primaryDark">Ceylon Work Forge</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-medium",
                        pathname === item.href ? "text-accent" : "text-primaryDark hover:text-accent",
                      )}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

              {user && user.role === "user" && user.userType === "seeker" && (
                <NavigationMenuItem>
                  <Link href="/job-seekers" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-medium",
                        pathname === "/job-seekers" ? "text-accent" : "text-primaryDark hover:text-accent",
                      )}
                    >
                      Jobs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {user && user.role === "user" && user.userType === "poster" && (
                <NavigationMenuItem>
                  <Link href="/job-posters" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-medium",
                        pathname === "/job-posters" ? "text-accent" : "text-primaryDark hover:text-accent",
                      )}
                    >
                      Talent
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {user && user.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm font-medium",
                        pathname === "/admin" ? "text-accent" : "text-primaryDark hover:text-accent",
                      )}
                    >
                      Admin Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "user" && user.userType === "poster" && (
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 text-accent border-accent hover:bg-accent/10"
                  onClick={handlePostJob}
                >
                  <Plus className="h-4 w-4" />
                  Post Job
                </Button>
              )}

              {user && user.role === "user" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-2 bg-background border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {user.userType === "seeker" ? (
                        <>
                          <User className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">Job Seeker</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">Employer</span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuLabel className="text-center text-sm font-medium text-muted-foreground">
                      Switch Role
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="grid grid-cols-2 gap-2 p-2">
                      <DropdownMenuItem
                        onClick={() => {
                          if (user.userType !== "seeker") {
                            updateUserType("seeker")
                            toast({
                              title: "Role Updated",
                              description: "You are now browsing as a Job Seeker",
                            })
                            router.push("/job-seekers")
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center h-20 p-2 rounded-md transition-all",
                          user.userType === "seeker"
                            ? "bg-accent/10 border-2 border-accent text-accent shadow-sm"
                            : "hover:bg-accent/5 border border-transparent",
                        )}
                      >
                        <User
                          className={cn(
                            "h-8 w-8 mb-1",
                            user.userType === "seeker" ? "text-accent" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-xs font-medium">Job Seeker</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (user.userType !== "poster") {
                            updateUserType("poster")
                            toast({
                              title: "Role Updated",
                              description: "You are now browsing as an Employer",
                            })
                            router.push("/job-posters")
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center h-20 p-2 rounded-md transition-all",
                          user.userType === "poster"
                            ? "bg-accent/10 border-2 border-accent text-accent shadow-sm"
                            : "hover:bg-accent/5 border border-transparent",
                        )}
                      >
                        <Briefcase
                          className={cn(
                            "h-8 w-8 mb-1",
                            user.userType === "poster" ? "text-accent" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-xs font-medium">Employer</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-white">{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {user.role === "admin" && <p className="text-xs font-medium text-accent">Administrator</p>}
                      {user.role === "user" && (
                        <p className="text-xs font-medium text-accent">
                          {user.userType === "seeker" ? "Job Seeker" : "Employer"}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "user" && user.userType === "poster" && (
                    <DropdownMenuItem asChild>
                      <Link href="/posted-jobs">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Posted Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user.role === "user" && user.userType === "seeker" && (
                    <DropdownMenuItem asChild>
                      <Link href="/applied-jobs">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Applied Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user && user.role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/reports" className="cursor-pointer">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Report a Problem</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user.role === "user" && (
                    <DropdownMenuItem asChild>
                      <Link href="/billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/chat">
                      <User className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>

                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" className="text-primaryDark">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <img src="/logo.png" alt="Ceylon Work Force Logo" className="h-8 w-8" />
                    <span className="font-bold text-xl text-primaryDark">Ceylon Work Force</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <nav className="flex flex-col gap-4">
                  {allNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "px-2 py-1 text-lg font-medium rounded-md",
                        pathname === item.href
                          ? "text-accent bg-accent/10"
                          : "text-primaryDark hover:text-accent hover:bg-accent/10",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {user && user.role === "user" && user.userType === "poster" && (
                    <button
                      className="px-2 py-1 text-lg font-medium rounded-md text-primaryDark hover:text-accent hover:bg-accent/10 text-left"
                      onClick={() => {
                        setIsOpen(false)
                        handlePostJob()
                      }}
                    >
                      Post Job
                    </button>
                  )}

                  {user && (
                    <>
                      <Link
                        href="/profile"
                        className={cn(
                          "px-2 py-1 text-lg font-medium rounded-md",
                          pathname === "/profile"
                            ? "text-accent bg-accent/10"
                            : "text-primaryDark hover:text-accent hover:bg-accent/10",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>

                      {user.role === "user" && user.userType === "poster" && (
                        <Link
                          href="/posted-jobs"
                          className={cn(
                            "px-2 py-1 text-lg font-medium rounded-md",
                            pathname === "/posted-jobs"
                              ? "text-accent bg-accent/10"
                              : "text-primaryDark hover:text-accent hover:bg-accent/10",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          Posted Jobs
                        </Link>
                      )}

                      {user.role === "user" && user.userType === "seeker" && (
                        <Link
                          href="/applied-jobs"
                          className={cn(
                            "px-2 py-1 text-lg font-medium rounded-md",
                            pathname === "/applied-jobs"
                              ? "text-accent bg-accent/10"
                              : "text-primaryDark hover:text-accent hover:bg-accent/10",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          Applied Jobs
                        </Link>
                      )}

                      {user && user.role !== "admin" && (
                        <Link
                          href="/reports"
                          className={cn(
                            "px-2 py-1 text-lg font-medium rounded-md",
                            pathname === "/reports"
                              ? "text-accent bg-accent/10"
                              : "text-primaryDark hover:text-accent hover:bg-accent/10",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          Report a Problem
                        </Link>
                      )}

                      {user.role === "user" && (
                        <Link
                          href="/billing"
                          className={cn(
                            "px-2 py-1 text-lg font-medium rounded-md",
                            pathname === "/billing"
                              ? "text-accent bg-accent/10"
                              : "text-primaryDark hover:text-accent hover:bg-accent/10",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          Billing
                        </Link>
                      )}

                      <Link
                        href="/chat"
                        className={cn(
                          "px-2 py-1 text-lg font-medium rounded-md",
                          pathname === "/chat"
                            ? "text-accent bg-accent/10"
                            : "text-primaryDark hover:text-accent hover:bg-accent/10",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        Messages
                      </Link>
                    </>
                  )}
                </nav>

                <div className="mt-auto">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 px-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-accent text-white">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.role === "admin" && <p className="text-xs font-medium text-accent">Administrator</p>}
                          {user.role === "user" && (
                            <p className="text-xs font-medium text-accent">
                              {user.userType === "seeker" ? "Job Seeker" : "Employer"}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                      >
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
