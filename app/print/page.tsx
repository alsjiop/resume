import type { ResumeData } from "@/types/resume";
import PrintContent from "@/components/print-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeDataParam(data?: string): ResumeData | null {
  if (!data) return null;
  try {
    const json = Buffer.from(decodeURIComponent(data), "base64").toString("utf-8");
    return JSON.parse(json) as ResumeData;
  } catch {
    return null;
  }
}

export default function PrintPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  const resumeData = decodeDataParam(searchParams?.data);

  // 兼容两种方式：
  // 1) 通过 URL `?data=` 传参（小数据量）
  // 2) 通过 sessionStorage 注入数据（大数据量，避免 431/414）
  return <PrintContent initialData={resumeData} />;
}
