"use client"

import React from "react"
import { Icon } from "@iconify/react"
import type { ResumeData } from "@/types/resume"
import RichTextRenderer from "./rich-text-renderer"

interface ResumePreviewProps {
  resumeData: ResumeData
}

/**
 * 简历预览组件
 */
export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const isAsciiOnly = (str: string | undefined) => !!str && /^[\x00-\x7F]+$/.test(str);
  // 格式化求职意向显示
  const formatJobIntention = () => {
    if (!resumeData.jobIntentionSection?.enabled || !resumeData.jobIntentionSection?.items?.length) {
      return null;
    }

    const items = resumeData.jobIntentionSection.items
      .filter(item => {
        // 过滤掉空值的项
        if (item.type === 'salary') {
          return item.salaryRange?.min !== undefined || item.salaryRange?.max !== undefined;
        }
        return item.value && item.value.trim() !== '';
      })
      .sort((a, b) => a.order - b.order)
      .map(item => `${item.label}：${item.value}`)
      .join(' ｜ ');

    return items || null;
  };

  const jobIntentionText = formatJobIntention();

  return (
    <div className="resume-preview resume-content">
      {/* 头部信息 */}
      <div className={`flex items-start mb-6 ${resumeData.centerTitle ? 'flex-col items-center' : 'justify-between'}`}>
        <div className={`flex-1 ${resumeData.centerTitle ? 'w-full' : ''}`}>
          <h1 className={`resume-title text-2xl font-bold text-foreground mb-4 ${resumeData.centerTitle ? 'text-center' : ''}`}>
            {resumeData.title || "简历标题"}
          </h1>

          {/* 求职意向 */}
          {jobIntentionText && (
            <div className={`job-intention-line text-sm text-muted-foreground mb-3 ${resumeData.centerTitle ? 'text-center' : ''}`}>
              {jobIntentionText}
            </div>
          )}

          {/* 个人信息 */}
          {(resumeData.personalInfoSection?.layout?.mode === 'inline' ||
            (resumeData.personalInfoSection?.layout?.mode === undefined && (resumeData.personalInfoSection as any)?.personalInfoInline)) ? (
            /* 单行显示模式（inline） */
            <div className="personal-info flex items-center justify-between w-full whitespace-nowrap" style={{ backgroundColor: '#F5F6F8', padding: '8px 12px', borderRadius: '4px' }}>
              {resumeData.personalInfoSection?.personalInfo.map((item) => (
                <div
                  key={item.id}
                  className="personal-info-item flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                >
                  {item.icon && (
                    <svg
                      className="resume-icon w-[1em] h-[1em] shrink-0"
                      fill="black"
                      viewBox="0 0 24 24"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  )}
                  {resumeData.personalInfoSection?.showPersonalInfoLabels !== false && (
                    <span className="text-sm leading-none text-muted-foreground shrink-0">{item.label}:</span>
                  )}
                  {item.value.type === "link" && item.value.content ? (
                    <a
                      href={item.value.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm leading-none text-blue-600 hover:text-blue-800 hover:underline ${isAsciiOnly(item.value.title || item.value.content) ? 'font-latin' : ''}`}
                    >
                      {item.value.title || "点击访问"}
                    </a>
                  ) : (
                    <span className={`text-sm leading-none text-foreground ${isAsciiOnly(item.value.content) ? 'font-latin' : ''}`}>{item.value.content || "未填写"}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* 多行显示：使用 CSS Grid 统一列轨道 + 两端对齐（不换行，必要时省略） */
            (() => {
              const itemsPerRow = resumeData.personalInfoSection?.layout?.itemsPerRow || 2;
              const rowGapRem = 0.5; // 行间距
              const personalInfo = resumeData.personalInfoSection?.personalInfo || [];
              // 为防止某一列极长导致整体溢出，按列数设置上限宽度（ch 单位）
              

              return (
                <div
                  className="personal-info personal-info-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${itemsPerRow}, max-content)`,
                    justifyContent: 'space-between',
                    justifyItems: 'start',
                    alignItems: 'center',
                    columnGap: 0,
                    rowGap: `${rowGapRem}rem`,
                    width: '100%'
                  }}
                >
                  {personalInfo.map((item) => (
                    <div
                      key={item.id}
                      className="personal-info-item inline-flex items-center gap-0.5 whitespace-nowrap"
                    >
                      {item.icon && (
                        <svg
                          className="resume-icon w-[1em] h-[1em] flex-shrink-0"
                          fill="black"
                          viewBox="0 0 24 24"
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                      )}
                      {resumeData.personalInfoSection?.showPersonalInfoLabels !== false && (
                        <span className="text-sm leading-none text-muted-foreground flex-shrink-0">{item.label}:</span>
                      )}
                      {item.value.type === "link" && item.value.content ? (
                        <a
                          href={item.value.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm leading-none text-blue-600 hover:text-blue-800 hover:underline ${isAsciiOnly(item.value.title || item.value.content) ? 'font-latin' : ''}`}
                        >
                          {item.value.title || "点击访问"}
                        </a>
                      ) : (
                        <span className={`text-sm leading-none text-foreground ${isAsciiOnly(item.value.content) ? 'font-latin' : ''}`}>{item.value.content || "未填写"}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>

        {/* 头像 */}
        {resumeData.avatar && (
          <div className={resumeData.centerTitle ? 'mt-4' : 'ml-6'}>
            <img
              src={resumeData.avatar}
              alt="头像"
              className="resume-avatar w-20 h-20 rounded-full object-cover border-2 border-border"
            />
          </div>
        )}
      </div>

      {/* 简历模块 */}
      <div className="space-y-6">
        {resumeData.modules
          .sort((a, b) => a.order - b.order)
          .map((module) => (
            <div key={module.id} className="resume-module">
              <div className="module-title text-lg font-semibold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
                {module.icon && (
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    dangerouslySetInnerHTML={{ __html: module.icon }}
                  />
                )}
                {module.title}
              </div>

              <div className="space-y-3">
                {/* 渲染行 */}
                {module.rows
                  .sort((a, b) => a.order - b.order)
                  .map((row) => (
                    <div
                      key={row.id}
                      className="grid gap-3"
                      style={{
                        gridTemplateColumns: `repeat(${row.columns}, 1fr)`,
                      }}
                    >
                      {row.elements.map((element) => (
                        <div
                          key={element.id}
                          className="text-sm text-foreground"
                        >
                          <RichTextRenderer content={element.content} />
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* 空状态提示 */}
      {resumeData.modules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground no-print">
          <Icon
            icon="mdi:file-document-outline"
            className="w-12 h-12 mx-auto mb-4 opacity-50"
          />
          <p>暂无简历内容，请在左侧编辑区域添加模块</p>
        </div>
      )}
    </div>
  );
}
