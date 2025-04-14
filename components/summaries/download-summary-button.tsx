"use client";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export function DownloadSummaryButton({
  title,
  summaryText,
  fileName,
  createdAt,
}: {
  title: string;
  summaryText: string;
  fileName: string;
  createdAt: string;
}) {
  const handleDownload = () => {
    const summaryContent = `#${title}
Generated Summary
Generated on: ${new Date(createdAt).toLocaleDateString()}
 
${summaryText}

Original File: ${fileName}
Generated by Sommaire
`;

    const blob = new Blob([summaryContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Summary-${title.replace(/[^a-z0-9]/gi, "_")}.text`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      size="sm"
      className="h-8 px-3 bg-rose-100 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
      onClick={handleDownload}
    >
      <Download className="h-4 w-4 mr-1" />
      Download Summary
    </Button>
  );
}
