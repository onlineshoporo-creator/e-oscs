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
  Search
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

// Types de rapports disponibles
const typesRapports = [
  { id: 'mensuel', label: 'Rapport Mensuel', icon: FileText, description: 'Synthèse mensuelle des activités' },
  { id: 'trimestriel', label: 'Rapport Trimestriel', icon: FileSpreadsheet, description: 'Bilan trimestriel complet' },
  { id: 'presentation', label: 'Présentation PPTX', icon: Presentation, description: 'Diapositives pour réunion' },
]

interface Rapport {
  id: string
  titre: string
  type: string
  periode: string
  dateGeneration: string
  taille: string
  format: 'docx' | 'pptx' | 'pdf'
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
  },
  {
    id: 'rpt-002',
    titre: 'Présentation - Bilan Q4 2025',
    type: 'presentation',
    periode: '2025-Q4',
    dateGeneration: '2026-01-15T14:00:00Z',
    taille: '5.8 MB',
    format: 'pptx',
  },
]

export default function RapportsPage() {
  const [selectedType, setSelectedType] = useState('mensuel')
  const [selectedPeriode, setSelectedPeriode] = useState('2026-01')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simuler la génération
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setDialogOpen(false)
    // Ici on pourrait ajouter une notification de succès
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rapports</h1>
          <p className="text-slate-500 mt-1">
            Générez et téléchargez vos rapports
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4" />
              Nouveau rapport
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Générer un rapport</DialogTitle>
              <DialogDescription>
                Choisissez le type et la période du rapport à générer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Type de rapport */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de rapport</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesRapports.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Période */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={selectedPeriode} onValueChange={setSelectedPeriode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026-01">Janvier 2026</SelectItem>
                    <SelectItem value="2025-12">Décembre 2025</SelectItem>
                    <SelectItem value="2025-Q4">Q4 2025</SelectItem>
                    <SelectItem value="2025-Q3">Q3 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Aperçu */}
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-slate-700">
                    {typesRapports.find(t => t.id === selectedType)?.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {typesRapports.find(t => t.id === selectedType)?.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Types de rapports */}
      <div className="grid gap-4 md:grid-cols-3">
        {typesRapports.map((type) => (
          <Card key={type.id} className={`cursor-pointer transition-all hover:shadow-md ${
            selectedType === type.id ? 'ring-2 ring-orange-500 border-orange-200' : ''
          }`} onClick={() => setSelectedType(type.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <type.icon className="w-5 h-5 text-slate-700" />
                </div>
                <CardTitle className="text-base">{type.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Rapports existants */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Rapports générés</h2>
        
        {rapportsExistant.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900 mb-1">Aucun rapport</h3>
              <p className="text-sm text-slate-500">
                Générez votre premier rapport en cliquant sur &quot;Nouveau rapport&quot;
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rapportsExistant.map((rapport) => (
              <Card key={rapport.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-lg ${
                        rapport.format === 'docx' ? 'bg-blue-100' :
                        rapport.format === 'pptx' ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        <FileText className={`w-6 h-6 ${
                          rapport.format === 'docx' ? 'text-blue-600' :
                          rapport.format === 'pptx' ? 'text-orange-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">
                          {rapport.titre}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{new Date(rapport.dateGeneration).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>{rapport.taille}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs uppercase">
                            {rapport.format}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" title="Aperçu">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="gap-1.5 bg-orange-500 hover:bg-orange-600">
                        <Download className="w-4 h-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
