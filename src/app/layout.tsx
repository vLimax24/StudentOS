"use client"
import * as React from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { env } from "@/env"
import { Inter } from "next/font/google"
import { Bricolage_Grotesque } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { dark } from "@clerk/themes"

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

// do not cache this layout
const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const handleSignOut = () => {
    // Delete the desired entry from localStorage
    localStorage.removeItem("tutorial-user-store")
  }

  return (
    <ClerkProvider
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl={"/dashboard"}
      signUpFallbackRedirectUrl={"/welcome"}
      afterSignOutUrl={"/"}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("min-h-screen", bricolage.className ?? inter.className)}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout
