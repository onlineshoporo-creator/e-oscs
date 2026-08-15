'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  // Icons pour KPIs principaux
  ClipboardList, 
  CheckCircle2, 
  Target,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  
  // Icons pour KPIs secondaires (catégories)
  Heart,
  Handshake,
  Eye,
  GraduationCap,
  Megaphone,
  
  // Icons pour actions et navigation
  Plus,
  FileText,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  ChevronRight,
  
  // Icons divers
  Activity,
  Zap,
  Clock,
  Loader2
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { 
  activites, 
  statsMensuelles, 
  formatMontant, 
  STATUT_CONFIG,
  type Activite 
} from '@/lib/mock/activites'

// ============================================
// DESIGN SYSTEM - COULEURS E-OSCS
// ============================================
const COLORS = {
  orange: {
    main: '#F77F00',
    light: '#FFF4E6',
    medium: '#FED7AA',
    dark: '#C2410C',
  },
  green: {
    main: '#009E60',
    light: '#F0FDF4',
    medium: '#BBF7D0',
    dark: '#166534',
  },
  teal: {
    main: '#0F766E',
    light: '#F0FDFA',
    medium: '#99F6E4',
    dark: '#115E59',
  },
  red: {
    main: '#DC2626',
    light: '#FEF2F2',
    medium: '#FECACA',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    500: '#64748B',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  }
}

// ============================================
// CONFIGURATION DES STATUTS AVEC COULEURS CI
// ============================================
const STATUT_CONFIG_ENHANCED: Record<string, { 
  label: string; 
  bgColor: string; 
  textColor: string; 
  borderColor: string;
  dotColor: string;
}> = {
  BROUILLON: { 
    label: 'Brouillon', 
    bgColor: 'bg-slate-100', 
    textColor: 'text-slate-700', 
    borderColor: 'border-slate-300',
    dotColor: 'bg-slate-500' 
  },
  SOUMIS: { 
    label: 'Soumis', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700', 
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-500' 
  },
  EN_VERIFICATION: { 
    label: 'En vérification', 
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-700', 
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500' 
  },
  VALIDE: { 
    label: 'Validé', 
    bgColor: 'bg-emerald-100', 
    textColor: 'text-emerald-700', 
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500' 
  },
  REJETE: { 
    label: 'Rejeté', 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-700', 
    borderColor: 'border-red-300',
    dotColor: 'bg-red-500' 
  },
  CORRECTION: { 
    label: 'Correction', 
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-700', 
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-500' 
  },
  // Legacy statuts
  en_cours: { 
    label: 'En cours', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700', 
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-500' 
  },
  en_attente: { 
    label: 'En attente', 
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-700', 
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-500' 
  },
  termine: { 
    label: 'Terminé', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-700', 
    borderColor: 'border-green-300',
    dotColor: 'bg-green-600' 
  },
  valide: { 
    label: 'Validée', 
    bgColor: 'bg-emerald-100', 
    textColor: 'text-emerald-700', 
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500' 
  },
  rejete: { 
    label: 'Rejetée', 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-700', 
    borderColor: 'border-red-300',
    dotColor: 'bg-red-500' 
  },
  planifie: { 
    label: 'Planifiée', 
    bgColor: 'bg-slate-100', 
    textColor: 'text-slate-600', 
    borderColor: 'border-slate-300',
    dotColor: 'bg-slate-400' 
  },
}

// ============================================
// TYPES
// ============================================
interface DashboardStats {
  totalActivites: number
  activitesRealisees: number
  tauxRealisation: number
  beneficiairesTotal: number
  incidents: number
}

interface CategoryStats {
  name: string
  count: number
  percentage: number
  icon: React.ElementType
  color: string
  bgColor: string
}

// ============================================
// LOADING SKELETON COMPONENT
// ============================================
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
        <ClipboardList className="w-10 h-10 text-orange-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Aucune activité pour le moment
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Commencez par créer votre première activité ou importez votre plan annuel 
        pour voir vos statistiques apparaître ici.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/app/activites/nouveau">
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4" />
            Créer une activité
          </Button>
        </Link>
        <Button variant="outline" className="gap-2 border-slate-200">
          <FileText className="w-4 h-4" />
          Importer un plan
        </Button>
      </div>
    </div>
  )
}

// ============================================
// KPI CARD PRINCIPAL COMPONENT
// ============================================
interface KPICardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  color: 'orange' | 'green' | 'teal' | 'red' | 'blue'
  borderLeft?: boolean
}

function KPICard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendUp = true, 
  color,
  borderLeft = true 
}: KPICardProps) {
  const colorConfig = {
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      border: 'border-l-orange-500',
      trendBg: trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-l-green-500',
      trendBg: trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
    },
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      border: 'border-l-teal-500',
      trendBg: trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-l-red-500',
      trendBg: trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-l-blue-500',
      trendBg: trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
    }
  }

  const config = colorConfig[color]

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-slate-200 group hover:border-slate-300 ${borderLeft ? `border-l-4 ${config.border}` : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${config.iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          {trend && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.trendBg}`}>
              {trendUp ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// KPIs PRINCIPAUX SECTION
// ============================================
function PrimaryKPIs() {
  const totalActivites = activites.length
  const activitesRealisees = activites.filter(a => ['termine', 'valide', 'VALIDE'].includes(a.statut)).length
  const tauxRealisation = totalActivites > 0 ? Math.round((activitesRealisees / totalActivites) * 100) : 0
  const beneficiairesTotal = activites.reduce((sum, a) => sum + a.beneficiairesCount, 0)
  const incidents = 2 // Mock data - would come from API

  const kpis: KPICardProps[] = [
    {
      title: 'Activités prévues',
      value: totalActivites,
      description: `${totalActivites - activitesRealisees} en cours`,
      icon: ClipboardList,
      trend: '+12%',
      trendUp: true,
      color: 'orange',
    },
    {
      title: 'Activités réalisées',
      value: activitesRealisees,
      description: `${tauxRealisation}% du total`,
      icon: CheckCircle2,
      trend: '+8%',
      trendUp: true,
      color: 'green',
    },
    {
      title: 'Taux de réalisation',
      value: `${tauxRealisation}%`,
      description: 'Objectif: 85%',
      icon: Target,
      trend: '+5.2%',
      trendUp: true,
      color: 'teal',
    },
    {
      title: 'Bénéficiaires totaux',
      value: beneficiairesTotal.toLocaleString('fr-FR'),
      description: 'Personnes atteintes',
      icon: Users,
      trend: '+18%',
      trendUp: true,
      color: 'blue',
    },
    {
      title: 'Incidents',
      value: incidents,
      description: 'À traiter',
      icon: AlertTriangle,
      trend: '-1',
      trendUp: false,
      color: 'red',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}

// ============================================
// KPIs SECONDAIRES PAR CATÉGORIE
// ============================================
function SecondaryKPIs() {
  // Calcul des stats par catégorie
  const categories = [
    { name: 'Solidarité', icon: Heart, color: 'rose', bgColor: 'bg-rose-50', iconBg: 'bg-rose-100', textColor: 'text-rose-600' },
    { name: 'Cohésion sociale', icon: Handshake, color: 'purple', bgColor: 'bg-purple-50', iconBg: 'bg-purple-100', textColor: 'text-purple-600' },
    { name: 'Visites compassion', icon: Eye, color: 'teal', bgColor: 'bg-teal-50', iconBg: 'bg-teal-100', textColor: 'text-teal-600' },
    { name: 'Formations', icon: GraduationCap, color: 'blue', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100', textColor: 'text-blue-600' },
    { name: 'Sensibilisations', icon: Megaphone, color: 'amber', bgColor: 'bg-amber-50', iconBg: 'bg-amber-100', textColor: 'text-amber-600' },
  ]

  // Données mock par catégorie (seraient calculées depuis les vraies données)
  const categoryData: CategoryStats[] = [
    { name: 'Solidarité', count: 12, percentage: 24, icon: Heart, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { name: 'Cohésion sociale', count: 8, percentage: 16, icon: Handshake, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Visites compassion', count: 15, percentage: 30, icon: Eye, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { name: 'Formations', count: 10, percentage: 20, icon: GraduationCap, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Sensibilisations', count: 5, percentage: 10, icon: Megaphone, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {categoryData.map((cat) => (
        <Card key={cat.name} className="hover:shadow-md transition-all duration-200 border-slate-200 group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${cat.bgColor} group-hover:scale-110 transition-transform`}>
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{cat.name}</p>
                <p className="text-lg font-bold text-slate-900">{cat.count}</p>
              </div>
              <span className="text-xs text-slate-400">{cat.percentage}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================
// GRAPHIQUE BARRES HORIZONTALES - ÉVOLUTION MENSUELLE
// ============================================
function MonthlyEvolutionChart() {
  const maxVal = Math.max(...statsMensuelles.map(s => s.activitesPlanifiees))
  
  return (
    <div className="space-y-4">
      {statsMensuelles.map((stat, idx) => {
        const plannedWidth = (stat.activitesPlanifiees / maxVal) * 100
        const realizedWidth = (stat.activitesRealisees / maxVal) * 100
        
        return (
          <div key={idx} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 w-24">{stat.mois}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">
                  {stat.activitesRealisees}/{stat.activitesPlanifiees}
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  stat.tauxExecution >= 80 ? 'bg-green-100 text-green-700' :
                  stat.tauxExecution >= 60 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {stat.tauxExecution}%
                </span>
              </div>
            </div>
            <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden">
              {/* Barre planifiée (fond) */}
              <div 
                className="absolute inset-y-0 left-0 bg-slate-200 rounded-lg"
                style={{ width: `${plannedWidth}%` }}
              />
              {/* Barre réalisée */}
              <div 
                className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-700 ease-out ${
                  stat.tauxExecution >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                  stat.tauxExecution >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                  'bg-gradient-to-r from-orange-500 to-red-400'
                }`}
                style={{ width: `${realizedWidth}%` }}
              >
                {realizedWidth > 25 && (
                  <div className="h-full flex items-center justify-end pr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {/* Légende */}
      <div className="flex items-center gap-6 pt-3 mt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-400" />
          <span className="text-xs text-slate-600">Réalisé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-200" />
          <span className="text-xs text-slate-600">Prévu</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// GRAPHIQUE DONUT - RÉPARTITION PAR TYPE
// ============================================
function ActivityTypeDonutChart() {
  const data = [
    { name: 'Formation', value: 25, color: '#F77F00' },
    { name: 'Sensibilisation', value: 20, color: '#009E60' },
    { name: 'Évaluation', value: 18, color: '#0F766E' },
    { name: 'Atelier', value: 15, color: '#8B5CF6' },
    { name: 'Autre', value: 22, color: '#94A3B8' },
  ]
  
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const size = 180
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  
  let cumulativePercentage = 0
  
  return (
    <div className="flex flex-col items-center">
      {/* SVG Donut Chart */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {data.map((segment, idx) => {
          const percentage = segment.value / total
          const strokeDasharray = `${percentage * 2 * Math.PI * radius} ${2 * Math.PI * radius}`
          const strokeDashoffset = -cumulativePercentage * 2 * Math.PI * radius
          
          cumulativePercentage += percentage
          
          return (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 hover:opacity-80"
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          )
        })}
        
        {/* Center text */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          className="fill-slate-900 font-bold"
          fontSize="24"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="fill-slate-500"
          fontSize="11"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          Total
        </text>
      </svg>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600">{item.name}</span>
            <span className="text-xs font-semibold text-slate-800 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// TABLEAU ACTIVITÉS RÉCENTES
// ============================================
function RecentActivitiesTable() {
  const recentes = [...activites]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  if (recentes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-sm">Aucune activité récente</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Activité</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {recentes.map((activite) => {
            const statutConfig = STATUT_CONFIG_ENHANCED[activite.statut] || STATUT_CONFIG_ENHANCED.BROUILLON
            
            return (
              <tr key={activite.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statutConfig.dotColor}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-orange-600 transition-colors truncate max-w-[200px]">
                        {activite.nom}
                      </p>
                      <p className="text-xs text-slate-500 sm:hidden">{activite.categorie}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className="text-sm text-slate-600">{activite.categorie}</span>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-sm text-slate-500">
                    {new Date(activite.dateActivite).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Badge 
                    variant="secondary" 
                    className={`${statutConfig.bgColor} ${statutConfig.textColor} ${statutConfig.borderColor} border text-xs font-medium px-2.5 py-1`}
                  >
                    {statutConfig.label}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/app/activites/${activite.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// COMPOSANT FILTRES
// ============================================
function Filters({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const [periode, setPeriode] = useState('mois')
  const [categorie, setCategorie] = useState('all')
  const [statut, setStatut] = useState('all')

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtres:</span>
          </div>
          
          <Select value={periode} onValueChange={(v) => setPeriode(v)}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categorie} onValueChange={(v) => setCategorie(v)}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Type d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="solidarite">Solidarité</SelectItem>
              <SelectItem value="cohesion">Cohésion sociale</SelectItem>
              <SelectItem value="compassion">Visites compassion</SelectItem>
              <SelectItem value="formation">Formations</SelectItem>
              <SelectItem value="sensibilisation">Sensibilisations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statut} onValueChange={(v) => setStatut(v)}>
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="planifie">Planifié</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
              <SelectItem value="valide">Validé</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="ml-auto gap-2 h-9 text-slate-600 border-slate-200">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// ACTIONS RAPIDES
// ============================================
function QuickActions() {
  const actions = [
    {
      title: 'Nouvelle activité',
      description: 'Créer une nouvelle activité',
      icon: Plus,
      href: '/app/activites/nouveau',
      primary: true,
    },
    {
      title: 'Plan annuel',
      description: 'Voir le plan annuel',
      icon: Calendar,
      href: '/app/planning',
      primary: false,
    },
    {
      title: 'Générer un rapport',
      description: 'Exporter les données',
      icon: FileText,
      href: '/app/rapports',
      primary: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className={`hover:shadow-md transition-all duration-200 cursor-pointer group ${
            action.primary 
              ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-300' 
              : 'border-slate-200 hover:border-slate-300'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  action.primary ? 'bg-orange-100' : 'bg-slate-100'
                } group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-4 h-4 ${
                    action.primary ? 'text-orange-600' : 'text-slate-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    action.primary ? 'text-orange-800' : 'text-slate-800'
                  }`}>
                    {action.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{action.description}</p>
                </div>
                <ArrowUpRight className={`w-4 h-4 flex-shrink-0 ${
                  action.primary ? 'text-orange-400' : 'text-slate-400'
                }`} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// ============================================
// RÉSUMÉ PERFORMANCE (Mini Widget)
// ============================================
function PerformanceSummary() {
  const dernierMois = statsMensuelles[statsMensuelles.length - 1]
  const moyenne = Math.round(
    statsMensuelles.reduce((sum, m) => sum + m.tauxExecution, 0) / statsMensuelles.length
  )

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
        <p className="text-xs text-green-600 font-medium mb-1">Ce mois</p>
        <p className="text-xl font-bold text-green-700">{dernierMois?.tauxExecution || 0}%</p>
      </div>
      <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-600 font-medium mb-1">Moyenne</p>
        <p className="text-xl font-bold text-blue-700">{moyenne}%</p>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
        <p className="text-xs text-purple-600 font-medium mb-1">Objectif</p>
        <p className="text-xl font-bold text-purple-700">85%</p>
      </div>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD PAGE
// ============================================
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Vérifier si des données existent
      setIsEmpty(activites.length === 0)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])

  // Loading State
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Empty State
  if (isEmpty) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ========================================== */}
      {/* HEADER DE PAGE                            */}
      {/* ========================================== */}
      <PageHeader />

      {/* ========================================== */}
      {/* ACTIONS RAPIDES                           */}
      {/* ========================================== */}
      <QuickActions />

      {/* ========================================== */}
      {/* KPIs PRINCIPAUX                           */}
      {/* ========================================== */}
      <section aria-label="Indicateurs clés de performance">
        <PrimaryKPIs />
      </section>

      {/* ========================================== */}
      {/* KPIs SECONDAIRES (PAR CATÉGORIE)           */}
      {/* ========================================== */}
      <section aria-label="Statistiques par catégorie">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Répartition par type d&apos;activité
          </h2>
        </div>
        <SecondaryKPIs />
      </section>

      {/* ========================================== */}
      {/* FILTRES                                   */}
      {/* ========================================== */}
      <Filters />

      {/* ========================================== */}
      {/* GRILLE PRINCIPALE                         */}
      {/* ========================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Graphiques */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graphique évolution mensuelle */}
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Évolution mensuelle
                  </CardTitle>
                  <CardDescription>Activités planifiées vs réalisées</CardDescription>
                </div>
                <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
                  Moyenne: {Math.round(statsMensuelles.reduce((s, m) => s + m.tauxExecution, 0) / statsMensuelles.length)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MonthlyEvolutionChart />
            </CardContent>
          </Card>

          {/* Activités récentes */}
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-500" />
                    Activités récentes
                  </CardTitle>
                  <CardDescription>Dernières activités ajoutées ou modifiées</CardDescription>
                </div>
                <Link href="/app/activites">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs">
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RecentActivitiesTable />
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Widgets */}
        <div className="space-y-6">
          {/* Répartition donut */}
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Répartition
              </CardTitle>
              <CardDescription>Par type d&apos;activité</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTypeDonutChart />
            </CardContent>
          </Card>

          {/* Performance summary */}
          <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Performance
              </CardTitle>
              <CardDescription>Aperçu rapide</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceSummary />
              
              {/* Progress global */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Progression globale</span>
                  <span className="text-sm font-semibold text-slate-800">72%</span>
                </div>
                <Progress value={72} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Alertes / Actions requises */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Attention requise
              </CardTitle>
              <CardDescription>{activites.filter(a => a.statut === 'en_attente').length} activité(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activites
                  .filter(a => a.statut === 'en_attente')
                  .slice(0, 3)
                  .map((activite) => (
                    <div 
                      key={activite.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-100"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {activite.nom}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))
                }
                
                {activites.filter(a => a.statut === 'en_attente').length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm">Tout est à jour !</p>
                  </div>
                )}
              </div>
              
              {activites.filter(a => a.statut === 'en_attente').length > 0 && (
                <Link href="/app/validation">
                  <Button size="sm" variant="outline" className="w-full mt-4 gap-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                    Traiter les validations
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PAGE HEADER COMPONENT
// ============================================
function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          Tableau de bord
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-normal">
            e-OSCS
          </Badge>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">
          Vue d&apos;ensemble de vos activités et performances
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Clock className="w-4 h-4" />
        <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  )
}
