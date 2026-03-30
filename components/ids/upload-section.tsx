"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadSectionProps {
  onFileUpload: (file: File) => Promise<void>
  isAnalyzing: boolean
}

export function UploadSection({ onFileUpload, isAnalyzing }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
      setFileName(file.name)
      onFileUpload(file)
    }
  }, [onFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileUpload(file)
    }
  }, [onFileUpload])

  return (
    <section className="max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300",
          isDragging
            ? "border-[#00d4ff] bg-[#00d4ff]/10 glow-cyan"
            : "border-[#2a2a3e] bg-[#12121a] hover:border-[#00d4ff]/50 hover:bg-[#1a1a2e]",
          isAnalyzing && "pointer-events-none"
        )}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00d4ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff]" />
        
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <Loader2 className="w-16 h-16 text-[#00d4ff] animate-spin" />
              <div className="absolute inset-0 blur-lg bg-[#00d4ff]/30" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#00d4ff] text-glow-cyan">
                Analyzing traffic...
              </p>
              <p className="text-sm text-[#71717a]">
                Processing network packets and detecting anomalies
              </p>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <Upload className="w-16 h-16 text-[#00d4ff]" />
              <div className="absolute inset-0 blur-md bg-[#00d4ff]/20 -z-10" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#e4e4e7]">
                Upload Network Traffic Dataset
              </p>
              <p className="text-sm text-[#71717a]">
                Drag and drop your CSV or TXT file here, or click to browse
              </p>
            </div>
            
            {fileName && (
              <div className="flex items-center justify-center gap-2 text-[#00ff88]">
                <FileText className="w-4 h-4" />
                <span className="text-sm">{fileName}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  asChild
                  className="bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-[#0a0a0f] font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]"
                >
                  <span>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Select File
                  </span>
                </Button>
              </label>
              
              <span className="text-xs text-[#71717a]">
                Supported: .csv, .txt
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
