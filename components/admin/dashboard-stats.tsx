import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsProps {
  totalUsers: number
  activeUsers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
}

export function DashboardStats({ totalUsers, activeUsers, totalJobs, activeJobs, totalApplications }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Users</CardTitle>
          <CardDescription>Total registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-primaryDark">{totalUsers}</div>
            <div className="text-sm text-muted-foreground">{activeUsers} active</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Jobs</CardTitle>
          <CardDescription>Total job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-primaryDark">{totalJobs}</div>
            <div className="text-sm text-muted-foreground">{activeJobs} active</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Applications</CardTitle>
          <CardDescription>Total job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-primaryDark">{totalApplications}</div>
            <div className="text-sm text-muted-foreground">
              {Math.round(totalApplications / Math.max(activeJobs, 1))} avg. per job
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
