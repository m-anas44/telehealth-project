"use client"
import React, { useState } from 'react'
import { currentMedications, documents, medicalHistory, patientData } from '@/app/data/doctorDashboard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Upload,
  Save,
  Printer,
  Activity,
  Plus,
  Download,
  Eye,
  Calendar,
  Pill
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function ConsultationsPage() {
const [activeTab, setActiveTab] = useState('encounter');
  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#0891b2] text-white text-xl">
                  {patientData.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patientData.name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline">{patientData.age}y, {patientData.gender}</Badge>
                  <Badge variant="outline">Blood Type: {patientData.bloodType}</Badge>
                  {patientData.allergies && (
                    <Badge className="bg-[#ef4444]">Allergies: {patientData.allergies}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Summary
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Full Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Sidebar - Patient Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicalHistory.map((item) => (
                <div key={item.id} className="p-3 bg-[#f8fafc] rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-[#f59e0b]" />
                    <p className="font-semibold text-gray-900">{item.diagnosis}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{item.notes}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString()} • {item.doctor}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentMedications.map((med) => (
                <div key={med.id} className="p-3 bg-[#f8fafc] rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill className="w-4 h-4 text-[#10b981]" />
                    <p className="font-semibold text-gray-900">{med.name}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{med.dosage}</p>
                  <p className="text-xs text-gray-500">
                    Since {new Date(med.prescribedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 p-2 bg-[#f8fafc] rounded-lg text-sm cursor-pointer hover:bg-gray-100">
                  <FileText className="w-4 h-4 text-[#0891b2]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Encounter</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="encounter">Encounter Notes</TabsTrigger>
                  <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                  <TabsTrigger value="prescription">Prescription</TabsTrigger>
                </TabsList>

                {/* Encounter Notes */}
                <TabsContent value="encounter" className="space-y-4 mt-4">
                  <div>
                    <Label>Chief Complaint</Label>
                    <Input placeholder="What brings the patient in today?" className="mt-2" />
                  </div>
                  <div>
                    <Label>History of Present Illness</Label>
                    <Textarea 
                      placeholder="Detailed description of symptoms, onset, duration, etc."
                      className="mt-2 min-h-25"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Blood Pressure</Label>
                      <Input placeholder="e.g., 120/80" className="mt-2" />
                    </div>
                    <div>
                      <Label>Heart Rate</Label>
                      <Input placeholder="e.g., 72 bpm" className="mt-2" />
                    </div>
                    <div>
                      <Label>Temperature</Label>
                      <Input placeholder="e.g., 98.6°F" className="mt-2" />
                    </div>
                    <div>
                      <Label>Weight</Label>
                      <Input placeholder="e.g., 70 kg" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label>Physical Examination</Label>
                    <Textarea 
                      placeholder="Findings from physical examination..."
                      className="mt-2 min-h-25"
                    />
                  </div>
                  <div>
                    <Label>Assessment & Plan</Label>
                    <Textarea 
                      placeholder="Clinical assessment and treatment plan..."
                      className="mt-2 min-h-25"
                    />
                  </div>
                  <Button className="w-full bg-[#10b981]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Encounter Notes
                  </Button>
                </TabsContent>

                {/* Diagnosis */}
                <TabsContent value="diagnosis" className="space-y-4 mt-4">
                  <div className="p-4 bg-[#e0f2fe] rounded-lg">
                    <p className="text-sm text-[#0c4a6e] mb-2">
                      <strong>Note:</strong> Diagnoses will be visible to the patient and added to their permanent medical record.
                    </p>
                  </div>
                  <div>
                    <Label>Primary Diagnosis</Label>
                    <Input placeholder="e.g., Hypertension Stage 1" className="mt-2" />
                  </div>
                  <div>
                    <Label>ICD-10 Code</Label>
                    <Input placeholder="Search or enter ICD-10 code" className="mt-2" />
                  </div>
                  <div>
                    <Label>Secondary Diagnosis (Optional)</Label>
                    <Input placeholder="Additional diagnoses" className="mt-2" />
                  </div>
                  <div>
                    <Label>Clinical Notes</Label>
                    <Textarea 
                      placeholder="Additional notes about the diagnosis, severity, and recommendations..."
                      className="mt-2 min-h-30"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select className="w-full mt-2 p-2 border rounded-lg">
                      <option>Active</option>
                      <option>Resolved</option>
                      <option>Under Treatment</option>
                      <option>Chronic</option>
                    </select>
                  </div>
                  <Button className="w-full bg-[#f59e0b]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Diagnosis to Record
                  </Button>
                </TabsContent>

                {/* Prescription */}
                <TabsContent value="prescription" className="space-y-4 mt-4">
                  <div className="p-4 bg-[#d1fae5] rounded-lg">
                    <p className="text-sm text-[#065f46] mb-2">
                      <strong>E-Prescription:</strong> Prescriptions will be electronically sent to the patient's pharmacy.
                    </p>
                  </div>
                  <div>
                    <Label>Medication Name</Label>
                    <Input placeholder="Search medication..." className="mt-2" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Strength</Label>
                      <Input placeholder="e.g., 10mg" className="mt-2" />
                    </div>
                    <div>
                      <Label>Form</Label>
                      <select className="w-full mt-2 p-2 border rounded-lg">
                        <option>Tablet</option>
                        <option>Capsule</option>
                        <option>Liquid</option>
                        <option>Injection</option>
                        <option>Cream</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Dosage Instructions</Label>
                    <Input placeholder="e.g., Take 1 tablet once daily with food" className="mt-2" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input placeholder="e.g., 30" type="number" className="mt-2" />
                    </div>
                    <div>
                      <Label>Refills</Label>
                      <Input placeholder="e.g., 3" type="number" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <select className="w-full mt-2 p-2 border rounded-lg">
                      <option>1 week</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>Until further notice</option>
                    </select>
                  </div>
                  <div>
                    <Label>Pharmacy (Optional)</Label>
                    <Input placeholder="Select patient's preferred pharmacy" className="mt-2" />
                  </div>
                  <div>
                    <Label>Special Instructions</Label>
                    <Textarea 
                      placeholder="Any special instructions or warnings for the patient..."
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#10b981]">
                      <Save className="w-4 h-4 mr-2" />
                      Save Prescription
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ConsultationsPage