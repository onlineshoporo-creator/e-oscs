'use client'

import React, { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Fetch pending requests count
  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const response = await fetch('/api/admin/stats?metric=pending_requests')
        if (response.ok) {
          const data = await response.json()
          setPendingRequestsCount(data.count || 0)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du compteur:', error)
      }
    }
    fetchPendingCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle responsive sidebar
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingRequestsCount={pendingRequestsCount}
      />
      
      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
      )}>
        {/* Header */}
        <AdminHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {!sidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
