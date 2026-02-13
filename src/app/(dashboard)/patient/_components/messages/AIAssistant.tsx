import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bot } from 'lucide-react'
import React from 'react'

const AIAssistant = () => {
  return (
    <div>
        <Card className="mb-6 border-2 border-[#8b5cf6] bg-gradient-to-r from-[#f3e8ff] to-[#e9d5ff]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">AI Chat Assistant</h4>
              <p className="text-sm text-gray-600">Get instant answers to common health questions (Coming Soon)</p>
            </div>
            <Badge className="bg-[#8b5cf6]">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIAssistant