"use client"

import { ScrollText, Download, Clock, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PredictionResult } from "@/app/page"

interface ThreatLogProps {
  predictions: PredictionResult[]
  onExport: () => void
}

export function ThreatLog({ predictions, onExport }: ThreatLogProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  return (
    <section className="rounded-xl border border-[#2a2a3e] bg-[#12121a] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-[#2a2a3e]">
        <h2 className="text-lg font-semibold text-[#e4e4e7] flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-[#00d4ff]" />
          Threat Log Panel
          <span className="text-xs font-normal text-[#71717a] ml-2">
            ({predictions.length} entries)
          </span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="border-[#2a2a3e] bg-[#1a1a2e] hover:bg-[#2a2a3e] hover:border-[#00d4ff]/50 text-[#e4e4e7]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-cyber">
        <div className="divide-y divide-[#2a2a3e]">
          {predictions.slice(0, 100).map((prediction) => (
            <div
              key={prediction.id}
              className={`flex items-center gap-4 p-3 px-5 transition-colors hover:bg-[#1a1a2e] ${
                prediction.type === "attack" ? "border-l-2 border-l-[#ff3366]" : "border-l-2 border-l-[#00ff88]"
              }`}
            >
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                prediction.type === "attack" 
                  ? "bg-[#ff3366]/10" 
                  : "bg-[#00ff88]/10"
              }`}>
                {prediction.type === "attack" ? (
                  <AlertTriangle className="w-4 h-4 text-[#ff3366]" />
                ) : (
                  <Shield className="w-4 h-4 text-[#00ff88]" />
                )}
              </div>

              {/* Log Entry */}
              <div className="flex-1 min-w-0 font-mono text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#71717a]">#{String(prediction.id).padStart(4, '0')}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                    prediction.type === "attack"
                      ? "bg-[#ff3366]/20 text-[#ff3366]"
                      : "bg-[#00ff88]/20 text-[#00ff88]"
                  }`}>
                    {prediction.label}
                  </span>
                  <span className="text-[#71717a] text-xs">
                    Confidence: {prediction.confidence}%
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-[#71717a]">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{formatTime(prediction.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {predictions.length > 100 && (
        <div className="p-3 text-center text-sm text-[#71717a] border-t border-[#2a2a3e]">
          Showing 100 of {predictions.length} entries. Export for full results.
        </div>
      )}
    </section>
  )
}
