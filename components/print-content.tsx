"use client";

import React, { useState } from "react";
import type { ResumeData } from "@/types/resume";
import ResumePreview from "@/components/resume-preview";

export default function PrintContent({ initialData }: { initialData?: ResumeData | null }) {
  const [resumeData] = useState<ResumeData | null>(() => {
    if (initialData) return initialData;
    try {
      const s = typeof window !== "undefined" ? sessionStorage.getItem("resumeData") : null;
      return s ? (JSON.parse(s) as ResumeData) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="pdf-preview-mode">
      {resumeData ? (
        <ResumePreview resumeData={resumeData} />
      ) : (
        <div className="resume-content p-8">
          <h1 className="text-xl font-bold mb-4">无法加载简历数据</h1>
          <p className="text-muted-foreground">请通过后端生成接口或附带 data 参数访问本页面。</p>
        </div>
      )}
    </div>
  );
}
