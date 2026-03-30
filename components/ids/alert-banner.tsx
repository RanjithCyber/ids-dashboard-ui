"use client"

import { AlertTriangle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertBannerProps {
  hasThreats: boolean
  threatCount: number
}

export function AlertBanner({ hasThreats, threatCount }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 md:p-6 transition-all duration-500",
        hasThreats
          ? "border-[#ff3366]/50 bg-[#ff3366]/10 animate-threat-pulse"
          : "border-[#00ff88]/50 bg-[#00ff88]/10 animate-safe-pulse"
      )}
    >
      {/* Background pattern */}
      <div 
        className={cn(
          "absolute inset-0 opacity-5",
          hasThreats ? "bg-[#ff3366]" : "bg-[#00ff88]"
        )}
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            currentColor 10px,
            currentColor 20px
          )`
        }}
      />
      
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        {hasThreats ? (
          <>
            <AlertTriangle className="w-8 h-8 text-[#ff3366] animate-pulse" />
            <div>
              <p className="text-xl md:text-2xl font-bold text-[#ff3366] text-glow-red">
                Threat Activity Detected
              </p>
              <p className="text-sm text-[#ff3366]/80">
                {threatCount} malicious {threatCount === 1 ? 'packet' : 'packets'} identified in network traffic
              </p>
            </div>
          </>
        ) : (
          <>
            <ShieldCheck className="w-8 h-8 text-[#00ff88]" />
            <div>
              <p className="text-xl md:text-2xl font-bold text-[#00ff88] text-glow-green">
                System Operating Normally
              </p>
              <p className="text-sm text-[#00ff88]/80">
                No malicious activity detected in network traffic
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
