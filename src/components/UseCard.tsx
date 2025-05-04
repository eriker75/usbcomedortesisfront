"use client";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Session } from "next-auth";

interface UserCardProps {
  session: Session;
  children: React.ReactNode;
}

export default function UserCard({ session, children }: UserCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.querySelector(".info-container")!;
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      });

      // Agregar título
      pdf.setFontSize(20);
      pdf.text("Carnet de estudiante", 20, 20);

      // Agregar fecha
      pdf.setFontSize(12);
      pdf.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, 40);

      // Agregar la imagen
      const imgWidth = pdf.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 20, 60, imgWidth, imgHeight);

      pdf.save("carnet.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="info-container bg-yellow-200 p-8 shadow-xl  rounded-md">
        {children}
        <div className="text-center">
          Nombre: <span className="font-bold">{session.user.name}</span>
        </div>
        <div className="text-center">
          Email: <span className="font-bold">{session.user.email}</span>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className={`
          bg-blue-500 hover:bg-blue-700 
          text-white font-bold py-2 px-4 
          rounded mt-4 transition-colors
          ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {isGenerating ? "Generando PDF..." : "Descargar PDF"}
      </button>
    </div>
  );
}
