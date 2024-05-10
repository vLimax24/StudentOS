"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingsTab from "./_components/SettingsTab"
import OverviewTab from "./_components/OverviewTab"
import WorkItemsTab from "./_components/WorkItemsTab"
import DocumentsTab from "./_components/DocumentsTab"
import RessourcesTab from "./_components/ResourcesTab"


const Page = () => {
  const params = useParams<{ projectId: Id<"projects"> }>()
  const projectId = params?.projectId
  const project = useQuery(api.projects.getSpecificProject, { projectId: projectId })
  return (
    <div className="flex flex-col">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>{project?.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-start justify-start">
        <Tabs defaultValue="overview" className="w-full mt-10 transition-all ease-in-out duration-300 md:scale-100 md:mx-0" orientation="horizontal">
            <TabsList className="max-w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="workitems">Work Items</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="ressources">Ressources</TabsTrigger>
                <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <OverviewTab/>
            </TabsContent>
            <TabsContent value="workitems">
                <WorkItemsTab/>
            </TabsContent>
            <TabsContent value="documents">
                <DocumentsTab/>
            </TabsContent>
            <TabsContent value="ressources">
                <RessourcesTab/>
            </TabsContent>
            <TabsContent value="settings">
                <SettingsTab project={project}/>
            </TabsContent>
        </Tabs>
        </div>
    </div>
  )
}

export default Page