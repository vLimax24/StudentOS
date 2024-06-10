"use client"

import TutorialDialog from "@/components/dashboard/Dialogs/tutorial/TutorialDialog"
import DashboardHeader from "@/components/dashboard/Layout/header"
import DashboardSidebar from "@/components/dashboard/Layout/sidebar"
import { api } from "@/convex/_generated/api"
import { useConvexAuth, useQuery } from "convex/react"
import * as React from "react"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const DashboardClient = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { isAuthenticated } = useConvexAuth()
  const [openDialog, setOpenDialog] = React.useState(false)

  const subjects = useQuery(
    api.subjects.getUserSubjects,
    !isAuthenticated ? "skip" : undefined
  )

  useEffect(() => {
    if (!subjects) return
    if (subjects.length <= 0) {
      setOpenDialog(true)
    }
  }, [subjects])

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main
          className={cn(
            "h-full w-full gap-4 overflow-y-hidden bg-[#FAFAFA] lg:gap-6",
            className
          )}
        >
          {children}
        </main>
        <Toaster richColors />
        <TutorialDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </div>
    </div>
  )
}

export default DashboardClient