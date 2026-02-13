import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentTab from "./DocumentTab";
import DiagnosisTab from "./DiagnosisTab";
import PerscriptionTab from "./PrescriptionsTab";
const MDTabs = () => {
  const documents = [
    {
      id: "1",
      name: "Blood Test Results - Complete Blood Count",
      type: "Lab Report",
      date: "2026-01-10",
      doctor: "Dr. Sarah Johnson",
      verified: true,
      fileType: "PDF",
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Prescription - Cardiovascular Medication",
      type: "Prescription",
      date: "2026-01-08",
      doctor: "Dr. Sarah Johnson",
      verified: true,
      fileType: "PDF",
      size: "156 KB",
    },
    {
      id: "3",
      name: "Chest X-Ray Report",
      type: "Imaging",
      date: "2025-12-20",
      doctor: "Dr. Michael Chen",
      verified: true,
      fileType: "PDF",
      size: "5.8 MB",
    },
    {
      id: "4",
      name: "Annual Physical Examination",
      type: "Checkup Report",
      date: "2025-12-15",
      doctor: "Dr. Michael Chen",
      verified: true,
      fileType: "PDF",
      size: "1.2 MB",
    },
  ];
  const diagnoses = [
    {
      id: "1",
      diagnosis: "Hypertension Stage 1",
      date: "2026-01-08",
      doctor: "Dr. Sarah Johnson",
      status: "Active",
      notes:
        "Blood pressure consistently above 130/80. Prescribed medication and lifestyle modifications.",
    },
    {
      id: "2",
      diagnosis: "Vitamin D Deficiency",
      date: "2025-12-15",
      doctor: "Dr. Michael Chen",
      status: "Under Treatment",
      notes: "Low vitamin D levels detected. Prescribed supplements.",
    },
  ];

  const prescriptions = [
    {
      id: "1",
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      duration: "3 months",
      date: "2026-01-08",
      doctor: "Dr. Sarah Johnson",
      status: "Active",
    },
    {
      id: "2",
      medication: "Vitamin D3 2000 IU",
      dosage: "Once daily",
      duration: "6 months",
      date: "2025-12-15",
      doctor: "Dr. Michael Chen",
      status: "Active",
    },
  ];

  return (
    <div>
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="diagnoses">
            Diagnoses ({diagnoses.length})
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            Prescriptions ({prescriptions.length})
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 mt-4">
          <DocumentTab documents={documents} />
        </TabsContent>

        {/* Diagnoses Tab */}
        <TabsContent value="diagnoses" className="space-y-4 mt-4">
          <DiagnosisTab diagnoses={diagnoses} />
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4 mt-4">
          <PerscriptionTab prescriptions={prescriptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MDTabs;
