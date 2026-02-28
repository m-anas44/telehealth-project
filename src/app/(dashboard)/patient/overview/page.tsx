"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Video, 
  MessageSquare,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';

const Overview= () => {
  // Mock data
  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2026-01-18',
      time: '10:00 AM',
      type: 'Video Consultation',
      status: 'confirmed',
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: '2026-01-22',
      time: '2:30 PM',
      type: 'In-Person',
      status: 'pending',
    },
  ];

  const recentDocuments = [
    {
      id: '1',
      name: 'Blood Test Results',
      date: '2026-01-10',
      type: 'Lab Report',
      doctor: 'Dr. Sarah Johnson',
    },
    {
      id: '2',
      name: 'Prescription - January',
      date: '2026-01-08',
      type: 'Prescription',
      doctor: 'Dr. Michael Chen',
    },
    {
      id: '3',
      name: 'X-Ray Report',
      date: '2025-12-20',
      type: 'Imaging',
      doctor: 'Dr. Sarah Johnson',
    },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
    { label: 'Weight', value: '70', unit: 'kg', status: 'normal' },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-[#0891b2] bg-gradient-to-br from-[#0891b2] to-[#0e7490] text-white cursor-pointer hover:shadow-lg transition-shadow" >
          <CardContent className="p-6">
            <Calendar className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Book Appointment</h3>
            <p className="text-sm text-white/80">Schedule with verified doctors</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-[#10b981] bg-gradient-to-br from-[#10b981] to-[#059669] text-white cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Upload Documents</h3>
            <p className="text-sm text-white/80">Add medical records</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-[#8b5cf6] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <MessageSquare className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Message Doctor</h3>
            <p className="text-sm text-white/80">Secure chat available</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Upcoming Appointments
          </CardTitle>
          <Button variant="ghost" size="sm" >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-[#0891b2] rounded-lg flex items-center justify-center flex-shrink-0">
                {apt.type === 'Video Consultation' ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <Calendar className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{apt.doctor}</h4>
                  <Badge variant="outline" className="text-xs">{apt.specialty}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {apt.time}
                  </span>
                </div>
              </div>
              <Badge className={apt.status === 'confirmed' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}>
                {apt.status}
              </Badge>
            </div>
          ))}
          {upcomingAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming appointments</p>
              <Button className="mt-3 bg-[#0891b2]" >
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#10b981]" />
              Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg">
                <span className="text-gray-700">{metric.label}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Measurement
            </Button>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#10b981]" />
              Recent Documents
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-lg border border-gray-200 cursor-pointer hover:border-[#0891b2] transition-colors">
                <div className="w-10 h-10 bg-[#e0f2fe] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#0891b2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                  <p className="text-xs text-gray-500">{doc.doctor} • {new Date(doc.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="text-xs">{doc.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview
