"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import type { ResumeData } from "@/types/resume";
import { generatePdfFilename } from "@/lib/resume-utils";
import dynamic from "next/dynamic";

const DynamicPDFDownloadLink = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface PDFExportButtonProps {
  resumeData: ResumeData;
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

export function PDFExportButton({
  resumeData,
  variant = "default",
  size = "default",
}: PDFExportButtonProps) {
  const fileName = generatePdfFilename(resumeData.title);

  const openPDFPreview = () => {
    const childWindow = window.open('/pdf-preview', '_blank');
    if (!childWindow) {
      console.error('Failed to open popup window');
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.source === childWindow && event.data.type === 'ready') {
        childWindow.postMessage({ type: 'resumeData', data: resumeData }, '*');
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // 设置超时，如果子窗口没有准备好
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 5000); // 5秒超时
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openPDFPreview}
        className="gap-2"
      >
        <Icon icon="mdi:file-pdf-box" className="w-4 h-4" />
        导出PDF
      </Button>
    </>
  );
}

export default PDFExportButton;
