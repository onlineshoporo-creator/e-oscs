'use client'

import React from 'react'
import {
  FileText,
  FileSpreadsheet,
  File,
  Download,
  Eye,
  Trash2,
  Check,
  MoreHorizontal,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Attachment } from '@/lib/actions/attachments'

interface DocumentListProps {
  documents: Attachment[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onView?: (attachment: Attachment) => void
  onToggleSelectionPresentation?: (id: string) => void
  onDelete?: (id: string) => void
}

// Obtenir l'icône et la couleur selon le type MIME
function getFileInfo(mime: string): { icon: React.ElementType; color: string; label: string } {
  if (mime.includes('pdf')) {
    return { icon: FileText, color: 'text-red-500 bg-red-50', label: 'PDF' }
  }
  if (
    mime.includes('sheet') ||
    mime.includes('excel') ||
    mime.includes('spreadsheet')
  ) {
    return { icon: FileSpreadsheet, color: 'text-green-500 bg-green-50', label: 'Excel' }
  }
  if (
    mime.includes('word') ||
    mime.includes('document')
  ) {
    return { icon: FileText, color: 'text-blue-500 bg-blue-50', label: 'Word' }
  }
  return { icon: File, color: 'text-slate-500 bg-slate-50', label: 'Document' }
}

// Formater la taille du fichier
function formatTaille(taille: number): string {
  if (taille < 1024) return `${taille} o`
  if (taille < 1024 * 1024) return `${(taille / 1024).toFixed(1)} Ko`
  return `${(taille / (1024 * 1024)).toFixed(1)} Mo`
}

// Formater la date
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DocumentList({
  documents,
  selectedIds,
  onToggleSelect,
  onView,
  onToggleSelectionPresentation,
  onDelete,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <FileText className="w-16 h-16 mb-4 text-slate-300" />
        <p className="text-lg font-medium">Aucun document</p>
        <p className="text-sm">Les documents apparaîtront ici après import</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* En-tête desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider border-b">
        <div className="col-span-1"></div>
        <div className="col-span-4">Nom du fichier</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Taille</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Actions</div>
      </div>

      {documents.map((doc) => {
        const fileInfo = getFileInfo(doc.mime)
        const Icon = fileInfo.icon

        return (
          <Card
            key={doc.id}
            className={`transition-all duration-200 ${
              selectedIds.includes(doc.id)
                ? 'ring-2 ring-orange-500 ring-offset-2 bg-orange-50/30'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="grid grid-cols-12 gap-4 items-center p-3 md:p-4">
              {/* Checkbox */}
              <div className="col-span-1">
                <button
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(doc.id)
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-slate-300 hover:border-orange-400'
                  }`}
                  onClick={() => onToggleSelect(doc.id)}
                >
                  {selectedIds.includes(doc.id) && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Nom et infos */}
              <div className="col-span-11 md:col-span-4 flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg ${fileInfo.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{doc.nom_fichier}</p>
                  {doc.legende && (
                    <p className="text-sm text-slate-500 truncate md:hidden">
                      {doc.legende}
                    </p>
                  )}
                  {doc.selection_presentation && (
                    <Badge className="mt-1 text-xs bg-orange-100 text-orange-700 border-none">
                      ⭐ Rapport
                    </Badge>
                  )}
                </div>
              </div>

              {/* Type - desktop only */}
              <div className="hidden md:flex col-span-2 items-center">
                <Badge variant="secondary">{fileInfo.label}</Badge>
              </div>

              {/* Taille */}
              <div className="hidden md:flex col-span-2 items-center text-sm text-slate-600">
                {formatTaille(doc.taille)}
              </div>

              {/* Date */}
              <div className="hidden md:flex col-span-2 items-center text-sm text-slate-500">
                {formatDate(doc.created_at)}
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-1 flex justify-end gap-1 mt-2 md:mt-0">
                {onView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(doc)}
                    title="Voir détails"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(doc)}>
                        <Eye className="w-4 h-4 mr-2" /> Voir détails
                      </DropdownMenuItem>
                    )}
                    {onToggleSelectionPresentation && (
                      <DropdownMenuItem onClick={() => onToggleSelectionPresentation(doc.id)}>
                        <Check className="w-4 h-4 mr-2" />
                        {doc.selection_presentation ? 'Retirer du rapport' : 'Ajouter au rapport'}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" /> Télécharger
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(doc.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
