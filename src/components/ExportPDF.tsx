import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportPDFProps {
  fileName: string;
}

export const ExportPDF = ({ fileName }: ExportPDFProps) => {
  const handleExport = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your report...",
      });

      // Get the results section to export
      const resultsElement = document.getElementById("analysis-results");
      if (!resultsElement) {
        throw new Error("Results not found");
      }

      // Capture the element as canvas with high quality
      const canvas = await html2canvas(resultsElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add the canvas as image
      const imgData = canvas.toDataURL("image/png");
      
      // Add content in pages if needed
      let position = 0;
      const pageHeight = 295; // A4 height in mm
      
      if (imgHeight > pageHeight) {
        // Multiple pages needed
        let heightLeft = imgHeight;
        
        while (heightLeft > 0) {
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      } else {
        // Single page
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      // Save the PDF
      const pdfFileName = `${fileName.replace(/\.[^/.]+$/, "")}_analysis_report.pdf`;
      pdf.save(pdfFileName);

      toast({
        title: "PDF Generated",
        description: "Your analysis report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Download PDF Report
    </Button>
  );
};
