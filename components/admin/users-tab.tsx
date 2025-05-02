"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  userType: string
  status: string
  isPaid: boolean
  joinedAt: string
}

interface UsersTabProps {
  users: User[]
  onApproveUser: (userId: string) => void
  onRejectUser: (userId: string) => void
}

export function UsersTab({ users, onApproveUser, onRejectUser }: UsersTabProps) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all registered users on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.userType === "seeker" ? "Job Seeker" : "Employer"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={user.status === "active" ? "bg-green-500 hover:bg-green-500/80" : ""}
                  >
                    {user.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isPaid ? "default" : "outline"}
                    className={user.isPaid ? "bg-accent hover:bg-accent/80" : ""}
                  >
                    {user.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </TableCell>
                <TableCell>{user.joinedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onApproveUser(user.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onRejectUser(user.id)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`/chat/support-${user.id}`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
