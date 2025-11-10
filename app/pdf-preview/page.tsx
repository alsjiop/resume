"use client"

import { useEffect, useState, Suspense } from "react"
import type { ResumeData } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { generatePdfFilename } from "@/lib/resume-utils"
import ResumePreview from "@/components/resume-preview"

function PDFPreviewContent() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  useEffect(() => {
    // 先检查 sessionStorage 是否有数据
    const storedData = sessionStorage.getItem('resumeData');
    if (storedData) {
      try {
        setResumeData(JSON.parse(storedData));
      } catch (error) {
        console.error("Failed to parse stored resume data:", error);
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resumeData') {
        setResumeData(event.data.data);
        sessionStorage.setItem('resumeData', JSON.stringify(event.data.data));
      }
    };

    window.addEventListener('message', handleMessage);

    // 发送 ready 消息到父窗口
    if (window.opener) {
      window.opener.postMessage({ type: 'ready' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [])

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">正在加载简历数据...</p>
      </div>
    )
  }

  const fileName = generatePdfFilename(resumeData.title)

  return (
    <div className="flex flex-col h-screen overflow-hidden pdf-preview-mode">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">PDF预览</h1>
        <div className="flex gap-2">
          <Button onClick={() => window.close()} variant="outline" size="sm" className="gap-2">
            <Icon icon="mdi:close" className="w-4 h-4" />
            关闭
          </Button>
          <Button size="sm" className="gap-2" onClick={() => window.print()}>
            <Icon icon="mdi:download" className="w-4 h-4" />
            下载PDF
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center bg-muted/30">
        <div className="py-6">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}

export default function PDFPreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">加载中...</p>
      </div>
    }>
      <PDFPreviewContent />
    </Suspense>
  )
}
