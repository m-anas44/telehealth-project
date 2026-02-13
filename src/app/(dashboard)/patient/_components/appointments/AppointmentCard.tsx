import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AppointmentCard = ({apt}: any) => {
  return (
    <div>
        <Card key={apt.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0891b2] rounded-xl flex items-center justify-center shrink-0">
                    {apt.type === 'Video Consultation' ? (
                      <Video className="w-8 h-8 text-white" />
                    ) : (
                      <MapPin
                       className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{apt.doctor}</h3>
                      <Badge variant="outline">{apt.specialty}</Badge>
                      <Badge className={apt.status === 'confirmed' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(apt.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {apt.type === 'Video Consultation' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        {apt.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'confirmed' && apt.type === 'Video Consultation' && (
                      <Button className="bg-[#10b981]">
                        <Video className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                    <Button variant="outline">Reschedule</Button>
                    <Button variant="outline" className="text-[#ef4444] hover:text-[#ef4444]">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
    </div>
  )
}

export default AppointmentCard