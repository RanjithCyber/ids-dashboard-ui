"use client"

import { Shield, Activity, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface HeaderProps {
  systemStatus: "active" | "attack" | "idle"
  onLogout: () => void
}

export function Header({ systemStatus, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const statusConfig = {
    active: {
      text: "Active",
      color: "text-[#00ff88]",
      bgColor: "bg-[#00ff88]/10",
      borderColor: "border-[#00ff88]/30",
      dot: "bg-[#00ff88]",
      glow: "animate-safe-pulse"
    },
    attack: {
      text: "Under Attack",
      color: "text-[#ff3366]",
      bgColor: "bg-[#ff3366]/10",
      borderColor: "border-[#ff3366]/30",
      dot: "bg-[#ff3366]",
      glow: "animate-threat-pulse"
    },
    idle: {
      text: "Standby",
      color: "text-[#71717a]",
      bgColor: "bg-[#71717a]/10",
      borderColor: "border-[#71717a]/30",
      dot: "bg-[#71717a]",
      glow: ""
    }
  }
  
  const status = statusConfig[systemStatus]
  
  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a3e] bg-[#0a0a0f]/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#00d4ff]" />
              <div className="absolute inset-0 blur-md bg-[#00d4ff]/30 -z-10" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#e4e4e7] text-glow-cyan tracking-tight">
                Intrusion Detection System
              </h1>
              <p className="text-xs md:text-sm text-[#71717a] hidden sm:block">
                AI-Based Network Threat Monitoring Dashboard
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* System Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.bgColor} ${status.borderColor} ${status.glow}`}>
              <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
              <Activity className={`w-4 h-4 ${status.color}`} />
              <span className={`text-sm font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-[#2a2a3e] bg-[#12121a] hover:bg-[#ff3366]/10 hover:border-[#ff3366]/50 hover:text-[#ff3366] text-[#e4e4e7] transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs ${status.bgColor} ${status.borderColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
              <span className={status.color}>{status.text}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#e4e4e7]"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2a2a3e]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onLogout()
                setMobileMenuOpen(false)
              }}
              className="w-full border-[#2a2a3e] bg-[#12121a] hover:bg-[#ff3366]/10 hover:border-[#ff3366]/50 hover:text-[#ff3366] text-[#e4e4e7]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
