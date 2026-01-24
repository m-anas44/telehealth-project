import { recentPatients, stats, todayAppointments } from '@/app/data/doctorDashboard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowRight, Calendar, Clock, FileText, Users, Video } from 'lucide-react'
import React from 'react'

function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Today's Schedule
          </CardTitle>
          <Button variant="ghost" size="sm">
            View Full Schedule <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayAppointments.map((apt) => (
            <div 
              key={apt.id} 
              className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border border-gray-200 cursor-pointer hover:border-[#0891b2] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar>
                  <AvatarFallback className="bg-[#0891b2] text-white">
                    {apt.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{apt.patient}</h4>
                    <Badge variant="outline" className="text-xs">
                      {apt.type === 'Video Consultation' ? <Video className="w-3 h-3 mr-1" /> : null}
                      {apt.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{apt.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-1">
                  <Clock className="w-4 h-4" />
                  {apt.time}
                </div>
                <Badge className="bg-[#10b981]">Ready</Badge>
              </div>
              <Button className="bg-[#0891b2]">
                Start Consultation
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#10b981]" />
              Recent Patients
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPatients.map((patient) => (
              <div 
                key={patient.id} 
                className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-lg border border-gray-200 cursor-pointer hover:border-[#10b981] transition-colors"
            
              >
                <Avatar>
                  <AvatarFallback className="bg-[#10b981] text-white">
                    {patient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{patient.name}</h4>
                  <p className="text-sm text-gray-600">{patient.condition}</p>
                  <p className="text-xs text-gray-500">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline">{patient.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8b5cf6]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-10 h-10 bg-[#e0f2fe] rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#0891b2]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Write Prescription</p>
                  <p className="text-sm text-gray-600">Create new prescription for patient</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-10 h-10 bg-[#d1fae5] rounded-lg flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-[#10b981]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Diagnosis</p>
                  <p className="text-sm text-gray-600">Document patient diagnosis</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review Lab Results</p>
                  <p className="text-sm text-gray-600">12 pending lab reports</p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OverviewPage