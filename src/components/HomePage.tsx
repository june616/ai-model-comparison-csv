import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, UserSession } from '@/types/evaluation'
import { Users, Question, Shield } from '@phosphor-icons/react'
import { getAssignedQuestions } from '@/utils/questionAssignment'
import { toast } from 'sonner'

interface HomePageProps {
  users: User[]
  sessions: UserSession[]
  onUserSelect: (user: User) => void
  onAdminAccess: () => void
}

export function HomePage({ users, sessions, onUserSelect, onAdminAccess }: HomePageProps) {
  const [password, setPassword] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAdminLogin = () => {
    if (password === 'cosmic-tool') {
      setIsDialogOpen(false)
      setPassword('')
      onAdminAccess()
      toast.success('Admin access granted')
    } else {
      toast.error('Incorrect password')
      setPassword('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdminLogin()
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* User Selection */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Users size={24} />
                Select Your Evaluator
              </CardTitle>
              <p className="text-muted-foreground">
                Choose your name from the list below to access your assigned questions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                {users.map((user) => {
                  const assignedQuestions = getAssignedQuestions(user)
                  
                  return (
                    <Button
                      key={user.id}
                      onClick={() => onUserSelect(user)}
                      variant="outline"
                      className="h-auto p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-left text-primary">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Question size={16} />
                        <span className="text-sm">{assignedQuestions.length} questions</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Button */}
          <div className="flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Shield size={16} />
                  Admin: View Results
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Admin Access
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter admin password"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdminLogin}>
                      Access Admin
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </div>
    </div>
  )
}