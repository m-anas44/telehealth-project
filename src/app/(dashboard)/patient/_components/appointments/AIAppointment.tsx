import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot } from 'lucide-react';

const AIAppointment = () => {
  return (
    <div>
        {/* AI Feature Placeholder */}
              <Card className="border-2 border-[#f59e0b] bg-linear-to-r from-[#fef3c7] to-[#fde68a]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">AI Voice Assistant</h3>
                        <Badge className="bg-[#f59e0b]">Coming Soon</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Soon you'll be able to book appointments using our AI voice assistant. Just speak naturally and let AI handle the rest!
                      </p>
                      <Button variant="outline" disabled className="border-[#f59e0b] text-[#f59e0b]">
                        <Bot className="w-4 h-4 mr-2" />
                        Try Voice Booking (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
    </div>
  )
}

export default AIAppointment