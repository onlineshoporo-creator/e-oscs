'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Download,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Users,
  Building2,
  Key,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Types pour les options d'export
interface ExportOption {
  id: string
  title: string
  description: string
  icon: React.ElementType
  fields: ExportField[]
  format: ('csv' | 'xlsx')[]
}

interface ExportField {
  id: string
  label: string
  required?: boolean
  defaultSelected?: boolean
}

// Options d'export disponibles
const exportOptions: ExportOption[] = [
  {
    id: 'users',
    title: 'Liste des utilisateurs',
    description: 'Export de tous les utilisateurs inscrits sur la plateforme',
    icon: Users,
    fields: [
      { id: 'email', label: 'Email', required: true, defaultSelected: true },
      { id: 'nom', label: 'Nom complet', required: true, defaultSelected: true },
      { id: 'organisation', label: 'Organisation', defaultSelected: true },
      { id: 'role', label: 'Rôle', defaultSelected: true },
      { id: 'date_inscription', label: "Date d'inscription", defaultSelected: true },
      { id: 'derniere_connexion', label: 'Dernière connexion', defaultSelected: false },
      { id: 'statut', label: 'Statut du compte', defaultSelected: false },
    ],
    format: ['csv', 'xlsx'],
  },
  {
    id: 'organizations',
    title: 'Liste des organisations',
    description: 'Export des organisations abonnées (DR/DD)',
    icon: Building2,
    fields: [
      { id: 'nom', label: 'Nom de l\'organisation', required: true, defaultSelected: true },
      { id: 'type', label: 'Type (DR/DD)', required: true, defaultSelected: true },
      { id: 'region', label: 'Région', defaultSelected: true },
      { id: 'plan', label: 'Plan d\'abonnement', defaultSelected: true },
      { id: 'date_abonnement', label: 'Date d\'abonnement', defaultSelected: true },
      { id: 'nb_utilisateurs', label: 'Nombre d\'utilisateurs', defaultSelected: true },
      { id: 'statut', label: 'Statut', defaultSelected: false },
    ],
    format: ['csv', 'xlsx'],
  },
  {
    id: 'codes',
    title: 'Codes d\'activation',
    description: 'Export des codes générés et leur statut',
    icon: Key,
    fields: [
      { id: 'code', label: 'Code', required: true, defaultSelected: true },
      { id: 'plan', label: 'Plan associé', defaultSelected: true },
      { id: 'email_proprietaire', label: 'Email propriétaire', defaultSelected: true },
      { id: 'duree', label: 'Durée (mois)', defaultSelected: true },
      { id: 'date_creation', label: 'Date de création', defaultSelected: true },
      { id: 'date_expiration', label: 'Date d\'expiration', defaultSelected: true },
      { id: 'statut', label: 'Statut (utilisé/disponible/expiré)', defaultSelected: true },
      { id: 'date_utilisation', label: 'Date d\'utilisation', defaultSelected: false },
    ],
    format: ['csv', 'xlsx'],
  },
]

// Historique des exports (mock)
const exportHistory = [
  { 
    id: '1', 
    type: 'users', 
    format: 'xlsx', 
    date: '2025-02-15T10:30:00', 
    status: 'completed',
    records: 156,
    fileSize: '45 Ko'
  },
  { 
    id: '2', 
    type: 'organizations', 
    format: 'csv', 
    date: '2025-02-14T15:20:00', 
    status: 'completed',
    records: 24,
    fileSize: '12 Ko'
  },
  { 
    id: '3', 
    type: 'codes', 
    format: 'xlsx', 
    date: '2025-02-13T09:10:00', 
    status: 'completed',
    records: 89,
    fileSize: '28 Ko'
  },
]

export default function ExportPage() {
  const [selectedOption, setSelectedOption] = useState<string>('users')
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx'>('xlsx')
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(['email', 'nom']))
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Get current export option
  const currentOption = exportOptions.find(o => o.id === selectedOption) || exportOptions[0]

  // Update selected fields when option changes
  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId)
    const option = exportOptions.find(o => o.id === optionId)
    if (option) {
      const defaultFields = new Set(
        option.fields.filter(f => f.defaultSelected).map(f => f.id)
      )
      setSelectedFields(defaultFields)
    }
  }

  // Toggle field selection
  const toggleField = (fieldId: string) => {
    const newSelection = new Set(selectedFields)
    if (newSelection.has(fieldId)) {
      newSelection.delete(fieldId)
    } else {
      newSelection.add(fieldId)
    }
    setSelectedFields(newSelection)
  }

  // Handle export
  const handleExport = async () => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real implementation, this would trigger an API call to generate and download the file
    console.log('Exporting:', {
      type: selectedOption,
      format: selectedFormat,
      fields: Array.from(selectedFields),
      dateRange: { from: dateFrom, to: dateTo }
    })
    
    setIsExporting(false)
    
    // Show success message (would use toast in real implementation)
    alert(`Export ${selectedFormat.toUpperCase()} généré avec succès!`)
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get type label
  const getTypeLabel = (typeId: string) => {
    const option = exportOptions.find(o => o.id === typeId)
    return option?.title || typeId
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/rapports">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Download className="w-7 h-7 text-[#F77F00]" />
                Export de données
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Téléchargez vos données aux formats CSV ou Excel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Export Form (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Select Data Type */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#009E60]" />
                Type de données à exporter
              </CardTitle>
              <CardDescription>Sélectionnez le type de données que vous souhaitez exporter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {exportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionChange(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOption === option.id
                        ? 'border-[#F77F00] bg-orange-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg w-fit mb-3 ${
                      selectedOption === option.id ? 'bg-[#F77F00] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-semibold ${
                      selectedOption === option.id ? 'text-[#F77F00]' : 'text-slate-800'
                    }`}>
                      {option.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{option.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range & Format Selection */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F77F00]" />
                Options d&apos;export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Date Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Période (optionnel)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Date de début</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Date de fin</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Laissez vide pour exporter toutes les données
                </p>
              </div>

              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Format d&apos;export</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFormat('xlsx')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 flex-1 transition-all ${
                      selectedFormat === 'xlsx'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <FileSpreadsheet className={`w-8 h-8 ${selectedFormat === 'xlsx' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <p className={`font-semibold ${selectedFormat === 'xlsx' ? 'text-emerald-800' : 'text-slate-700'}`}>
                        Excel (.xlsx)
                      </p>
                      <p className={`text-xs ${selectedFormat === 'xlsx' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Feuilles multiples, mise en forme
                      </p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedFormat('csv')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 flex-1 transition-all ${
                      selectedFormat === 'csv'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <FileText className={`w-8 h-8 ${selectedFormat === 'csv' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <p className={`font-semibold ${selectedFormat === 'csv' ? 'text-blue-800' : 'text-slate-700'}`}>
                        CSV (.csv)
                      </p>
                      <p className={`text-xs ${selectedFormat === 'csv' ? 'text-blue-600' : 'text-slate-400'}`}>
                        Compatible tous logiciels
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Fields Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Champs à inclure ({selectedFields.size} sélectionné(s))
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentOption.fields.map((field) => (
                      <label
                        key={field.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                          selectedFields.has(field.id)
                            ? 'bg-white border border-[#F77F00]/30 shadow-sm'
                            : 'hover:bg-white/70 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.has(field.id)}
                          onChange={() => !field.required && toggleField(field.id)}
                          disabled={field.required}
                          className="w-4 h-4 rounded border-slate-300 text-[#F77F00] focus:ring-[#F77F00]"
                        />
                        <span className={`text-sm ${
                          selectedFields.has(field.id) ? 'font-medium text-slate-800' : 'text-slate-600'
                        }`}>
                          {field.label}
                        </span>
                        {field.required && (
                          <Badge variant="secondary" className="text-[10px] ml-auto bg-red-50 text-red-600 border-red-200">
                            Requis
                          </Badge>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={isExporting || selectedFields.size === 0}
                className="w-full gap-2 py-6 text-base bg-gradient-to-r from-[#F77F00] to-[#FFA940] hover:from-[#e67300] hover:to-[#F77F00] shadow-lg shadow-orange-500/25"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Générer l&apos;export {selectedFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - History (1/3 width) */}
        <div className="space-y-6">
          
          {/* Export History */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                Exports récents
              </CardTitle>
              <CardDescription>Historique de vos derniers exports</CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length > 0 ? (
                <div className="space-y-3">
                  {exportHistory.map((exportItem) => (
                    <div
                      key={exportItem.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {exportItem.format === 'xlsx' ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {getTypeLabel(exportItem.type)}
                          </span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${
                          exportItem.format === 'xlsx' 
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50' 
                            : 'border-blue-200 text-blue-700 bg-blue-50'
                        }`}>
                          {exportItem.format.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 pl-6">
                        <span>{formatDate(exportItem.date)}</span>
                        <span>{exportItem.records} enregistrements • {exportItem.fileSize}</span>
                      </div>
                      
                      <div className="mt-2 pl-6">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-[#F77F00] hover:text-[#e67300]">
                          <Download className="w-3 h-3" />
                          Retélécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Download className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Aucun export récent</p>
                  <p className="text-xs text-slate-400 mt-1">Vos exports apparaîtront ici</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Bon à savoir</p>
                  <ul className="text-xs text-blue-600 mt-2 space-y-1.5 list-disc list-inside">
                    <li>Les exports sont disponibles pendant 30 jours</li>
                    <li>La taille maximale est de 10 Mo par fichier</li>
                    <li>Les données sensibles sont masquées automatiquement</li>
                    <li>Un email de confirmation est envoyé après chaque export</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
