"use client"

import { DebugPanel } from "@/components/debug-panel"
import { ConfigDisplay } from "@/components/config-display"

export default function DebugPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Sawty API Debug</h1>
      <div className="mb-6">
        <ConfigDisplay />
      </div>
      <DebugPanel />
    </div>
  )
}
