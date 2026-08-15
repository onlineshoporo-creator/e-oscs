'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { usePathname } from 'next/navigation'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  organization?: string | null
  organizationId?: string | null
}

interface AppLayoutProps {
  children: React.ReactNode
  user?: UserData
}

export function AppLayout({ children, user }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content area */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
      `}>
        <Header user={user} />
        
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
