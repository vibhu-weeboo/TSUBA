import { useEffect, useState } from 'react'
import { BarChart3, CheckSquare, Calendar, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  upcomingEvents: number
  researchProjects: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    researchProjects: 0,
  })

  useEffect(() => {
    // Simulated data - would fetch from API in production
    setStats({
      totalTasks: 24,
      completedTasks: 18,
      upcomingEvents: 5,
      researchProjects: 3,
    })
  }, [])

  const statCards = [
    { icon: CheckSquare, label: 'Total Tasks', value: stats.totalTasks, color: 'bg-blue-500' },
    { icon: TrendingUp, label: 'Completed', value: stats.completedTasks, color: 'bg-green-500' },
    { icon: Calendar, label: 'Upcoming Events', value: stats.upcomingEvents, color: 'bg-purple-500' },
    { icon: BarChart3, label: 'Research Projects', value: stats.researchProjects, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your tasks and projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {['Complete project proposal', 'Review research papers', 'Schedule team meeting'].map((task, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <CheckSquare size={18} className="text-primary-600" />
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Schedule</h2>
          <div className="space-y-3">
            {['Team Sync - 10:00 AM', 'Research Review - 2:00 PM', 'Project Demo - 4:00 PM'].map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Calendar size={18} className="text-purple-600" />
                <span className="text-gray-700">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
