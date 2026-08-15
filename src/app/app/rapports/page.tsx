'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  Plus,
  Calendar,
  FileSpreadsheet,
  Presentation,
  Eye,
  Trash2,
  Search,
  Clock,
  CheckCircle2,
  Loader2,
  FileDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

// Types de rapports disponibles
const typesRapports = [
  { 
    id: 'mensuel', 
    label: 'Rapport Mensuel', 
    icon: FileText, 
    description: 'Synthèse mensuelle des activités avec KPIs et graphiques',
    format: ['docx', 'pdf'],
    color: 'bg-blue-100 text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200'
  },
  { 
    id: 'trimestriel', 
    label: 'Rapport Trimestriel', 
    icon: FileSpreadsheet, 
    description: 'Bilan trimestriel complet avec analyse des tendances',
    format: ['docx', 'xlsx', 'pdf'],
    color: 'bg-green-100 text-green-600',
    iconBg: 'bg-green-50 border-green-200'
  },
  { 
    id: 'annuel', 
    label: 'Rapport Annuel', 
    icon: Presentation, 
    description: 'Rapport annuel complet pour la direction',
    format: ['docx', 'pptx', 'pdf'],
    color: 'bg-purple-100 text-purple-600',
    iconBg: 'bg-purple-50 border-purple-200'
  },
  { 
    id: 'presentation', 
    label: 'Présentation PPTX', 
    icon: Presentation, 
    description: 'Diapositives pour réunion ou présentation',
    format: ['pptx'],
    color: 'bg-orange-100 text-orange-600',
    iconBg: 'bg-orange-50 border-orange-200'
  },
]

interface Rapport {
  id: string
  titre: string
  type: string
  periode: string
  dateGeneration: string
  taille: string
  format: 'docx' | 'pptx' | 'pdf' | 'xlsx'
  statut: 'GENERE' | 'GENERATION_EN_COURS' | 'ERREUR'
}

const rapportsExistant: Rapport[] = [
  {
    id: 'rpt-001',
    titre: 'Rapport Mensuel - Janvier 2026',
    type: 'mensuel',
    periode: '2026-01',
    dateGeneration: '2026-02-01T10:30:00Z',
    taille: '2.4 MB',
    format: 'docx',
    statut: 'GENERE',
  },
  {
    id: 'rpt-002',
    titre: 'Présentation - Bilan Q4 2025',
    type: 'presentation',
    periode: '2025-Q4',
    dateGeneration: '2026-01-15T14:00:00Z',
    taille: '5.8 MB',
    format: 'pptx',
    statut: 'GENERE',
  },
  {
    id: 'rpt-003',
    titre: 'Rapport Trimestriel - T1 2025',
    type: 'trimestriel',
    periode: '2025-Q1',
    dateGeneration: '2025-04-05T09:15:00Z',
    taille: '3.2 MB',
    format: 'xlsx',
    statut: 'GENERE',
  },
]

// Périodes disponibles
const periodesDisponibles = [
  { value: '2026-01', label: 'Janvier 2026' },
  { value: '2025-12', label: 'Décembre 2025' },
  { value: '2025-11', label: 'Novembre 2025' },
  { value: '2025-Q4', label: 'Q4 2025 (Oct-Déc)' },
  { value: '2025-Q3', label: 'Q3 2025 (Juil-Sep)' },
  { value: '2025-Q2', label: 'Q2 2025 (Avr-Juin)' },
  { value: '2025-Q1', label: 'Q1 2025 (Jan-Mars)' },
  { value: '2025', label: 'Année 2025 complète' },
]

// Configuration des formats
const formatsConfig = {
  docx: { label: 'Word (.docx)', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  pptx: { label: 'PowerPoint (.pptx)', icon: Presentation, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  pdf: { label: 'PDF (.pdf)', icon: FileText, color: 'text-red-600 bg-red-50 border-red-200' },
  xlsx: { label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-green-600 bg-green-50 border-green-200' },
}

export default function RapportsPage() {
  const [selectedType, setSelectedType] = useState('mensuel')
  const [selectedPeriode, setSelectedPeriode] = useState('2026-01')
  const [selectedFormat, setSelectedFormat] = useState('docx')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Filtrer les rapports
  const rapportsFiltres = rapportsExistant.filter(r => 
    r.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.includes(searchTerm.toLowerCase())
  )

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      // Simuler la génération du rapport
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      toast({
        title: '✅ Rapport généré avec succès',
        description: `Le ${typesRapports.find(t => t.id === selectedType)?.label} pour ${periodesDisponibles.find(p => p.value === selectedPeriode)?.label} est prêt.`,
      })
      
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Erreur lors de la génération',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (rapport: Rapport) => {
    toast({
      title: '📥 Téléchargement démarré',
      description: `Téléchargement de "${rapport.titre}" en cours...`,
    })
  }

  const handlePreview = (rapport: Rapport) => {
    toast({
      title: '👁️ Aperçu',
      description: `Ouverture de l'aperçu pour "${rapport.titre}"...`,
    })
  }

  const currentTypeConfig = typesRapports.find(t => t.id === selectedType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rapports</h1>
          <p className="text-slate-500 mt-1">
            Générez et téléchargez vos rapports d&apos;activités
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200">
              <Plus className="w-4 h-4" />
              Nouveau rapport
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-orange-500" />
                Générer un rapport
              </DialogTitle>
              <DialogDescription>
                Choisissez le type, la période et le format du rapport à générer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              {/* Type de rapport */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type de rapport</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesRapports.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Période */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Période</label>
                <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodesDisponibles.map(periode => (
                      <SelectItem key={periode.value} value={periode.value}>
                        {periode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Format d&apos;export</label>
                <div className="grid grid-cols-2 gap-2">
                  {currentTypeConfig?.format.map(format => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                        selectedFormat === format 
                          ? formatsConfig[format as keyof typeof formatsConfig].color + ' border-current ring-2 ring-offset-1' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {React.createElement(formatsConfig[format as keyof typeof formatsConfig].icon, { 
                        className: 'w-4 h-4' 
                      })}
                      <span className="text-sm font-medium">{formatsConfig[format as keyof typeof formatsConfig].label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aperçu */}
              <Card className={`${currentTypeConfig?.iconBg}`}>
                <CardContent className="p-4">
                  <p className={`font-semibold ${currentTypeConfig?.color}`}>
                    {currentTypeConfig?.label}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {currentTypeConfig?.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {periodesDisponibles.find(p => p.value === selectedPeriode)?.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs uppercase">
                      {selectedFormat}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="gap-2 bg-orange-500 hover:bg-orange-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Générer le rapport
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Types de rapports */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {typesRapports.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
              selectedType === type.id ? 'ring-2 ring-orange-500 border-orange-200 shadow-md' : 'border-slate-200'
            }`} 
            onClick={() => setSelectedType(type.id)}
          >
            <CardHeader className="pb-3">
              <div className={`inline-flex p-3 rounded-xl ${type.iconBg}`}>
                <type.icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <CardTitle className="text-base mt-3">{type.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{type.description}</p>
              <div className="flex gap-1 mt-3">
                {type.format.map(f => (
                  <Badge key={f} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {f.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Section rapports générés */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Rapports générés</h2>
          
          {/* Recherche */}
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {rapportsFiltres.length === 0 ? (
          <Card className="border-dashed border-slate-300">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Aucun rapport trouvé</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
                {searchTerm ? 'Essayez une autre recherche' : 'Générez votre premier rapport en cliquant sur "Nouveau rapport"'}
              </p>
              {!searchTerm && (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Générer un rapport
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rapportsFiltres.map((rapport) => {
              const formatConfig = formatsConfig[rapport.format]
              const FormatIcon = formatConfig.icon
              
              return (
                <Card key={rapport.id} className="hover:shadow-md transition-all duration-200 border-slate-200 group">
                  <CardContent className="p-4 lg:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Icône format */}
                        <div className={`p-3 rounded-xl ${formatConfig.color} flex-shrink-0`}>
                          <FormatIcon className="w-6 h-6" />
                        </div>
                        
                        {/* Infos rapport */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                            {rapport.titre}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(rapport.dateGeneration).toLocaleDateString('fr-FR')}
                            </span>
                            <span>•</span>
                            <span>{rapport.taille}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-medium">
                              {rapport.format}
                            </Badge>
                            
                            {rapport.statut === 'GENERE' && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Prêt
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Aperçu"
                          onClick={() => handlePreview(rapport)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="gap-1.5 bg-orange-500 hover:bg-orange-600"
                          onClick={() => handleDownload(rapport)}
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </div>

                      {/* Actions mobiles toujours visibles */}
                      <div className="flex items-center gap-2 flex-shrink-0 sm:hidden">
                        <Button 
                          size="sm" 
                          className="gap-1.5 bg-orange-500 hover:bg-orange-600"
                          onClick={() => handleDownload(rapport)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
