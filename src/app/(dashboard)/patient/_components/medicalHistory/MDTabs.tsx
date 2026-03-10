import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentTab from "./DocumentTab";
import DiagnosisTab from "./DiagnosisTab";
import PerscriptionTab from "./PrescriptionsTab";
import { useEffect, useState, useMemo } from "react";
import { getPatientMedicalDocuments } from "@/handlers/patientHandler";
import CardSkeleton from "../skeletons/CardSkeleton";

const MDTabs = () => {
  const [loading, setLoading] = useState(true);
  const [medicalData, setMedicalData] = useState<any>(null);

  const fetchRecords = async () => {
    try {
      const response = await getPatientMedicalDocuments();
      console.log("response from client: ", response.data);
      setMedicalData(response.data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Categorize documents
  const categorizedDocuments = useMemo(() => {
    return {
      reports: medicalData?.reports || [],
      xrays: medicalData?.xrays || [],
      prescriptions: medicalData?.prescriptions || [],
      other: medicalData?.other || [],
    };
  }, [medicalData]);

  return (
    <div>
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">
            Reports ({categorizedDocuments.reports.length})
          </TabsTrigger>
          <TabsTrigger value="xrays">
            X-Rays ({categorizedDocuments.xrays.length})
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            Prescriptions ({categorizedDocuments.prescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="other">
            Other ({categorizedDocuments.other.length})
          </TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4 mt-4">
          {loading ? (
            <CardSkeleton />
          ) : (
            <DocumentTab documents={categorizedDocuments.reports} />
          )}
        </TabsContent>

        {/* X-Rays Tab */}
        <TabsContent value="xrays" className="space-y-4 mt-4">
          {loading ? (
            <CardSkeleton />
          ) : (
            <DocumentTab documents={categorizedDocuments.xrays} />
          )}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4 mt-4">
          {loading ? (
            <CardSkeleton />
          ) : (
            <DocumentTab documents={categorizedDocuments.prescriptions} />
          )}
        </TabsContent>

        {/* Other Tab */}
        <TabsContent value="other" className="space-y-4 mt-4">
          {loading ? (
            <CardSkeleton />
          ) : (
            <DocumentTab documents={categorizedDocuments.other} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MDTabs;
