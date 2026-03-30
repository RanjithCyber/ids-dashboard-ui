"use client"

import { useState } from "react"
import { Shield, Lock, Eye, EyeOff, Fingerprint, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock credentials
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoading(false)
      onLoginSuccess()
    } else {
      setError("Invalid credentials. Access denied.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] cyber-grid flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff3366]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#12121a] border border-[#2a2a3e] mb-6 relative">
            <Shield className="w-10 h-10 text-[#00d4ff]" />
            <div className="absolute inset-0 rounded-2xl blur-xl bg-[#00d4ff]/20 -z-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#e4e4e7] text-glow-cyan mb-2">
            Intrusion Detection System
          </h1>
          <p className="text-[#71717a] text-sm">
            AI-Based Network Threat Monitoring Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#2a2a3e] bg-[#12121a]/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#ffaa00]/10 border border-[#ffaa00]/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-[#ffaa00] shrink-0" />
            <p className="text-xs text-[#ffaa00]">
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-[#e4e4e7] mb-1">
            Secure Access Required
          </h2>
          <p className="text-sm text-[#71717a] mb-6">
            Enter your credentials to access the dashboard
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff3366] text-sm text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e4e4e7]">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-[#1a1a2e] border-[#2a2a3e] text-[#e4e4e7] placeholder:text-[#71717a] focus:border-[#00d4ff] focus:ring-[#00d4ff]/20"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e4e4e7]">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10 bg-[#1a1a2e] border-[#2a2a3e] text-[#e4e4e7] placeholder:text-[#71717a] focus:border-[#00d4ff] focus:ring-[#00d4ff]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#e4e4e7] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-[#0a0a0f] font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Access Dashboard
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#2a2a3e] text-center">
            <p className="text-xs text-[#71717a]">
              Protected by multi-layer security protocols
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-[#00ff88]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-xs">Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#00d4ff]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                <span className="text-xs">Monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Version info */}
        <p className="text-center text-xs text-[#71717a] mt-6">
          IDS v2.0.1 | Session Timeout: 30 minutes
        </p>
      </div>
    </div>
  )
}
