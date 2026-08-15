'use client'

import React, { useState } from 'react'
import { Image as ImageIcon, Eye, Download, Check, MoreHorizontal, X } from 'lucide-react'
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

interface GalleryGridProps {
  photos: Attachment[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onView: (attachment: Attachment) => void
  onToggleSelectionPresentation?: (id: string) => void
  onDelete?: (id: string) => void
}

// Générer une URL placeholder pour l'image (sera remplacée par Supabase Storage)
function getPlaceholderUrl(attachment: Attachment): string {
  // Couleurs basées sur le nom du fichier pour des placeholders cohérents
  const colors = [
    'from-orange-200 to-amber-100',
    'from-green-200 to-emerald-100',
    'from-blue-200 to-sky-100',
    'from-purple-200 to-violet-100',
    'from-pink-200 to-rose-100',
    'from-teal-200 to-cyan-100',
  ]
  
  const index = attachment.nom_fichier.length % colors.length
  
  return `bg-gradient-to-br ${colors[index]}`
}

// Formater la date
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function GalleryGrid({
  photos,
  selectedIds,
  onToggleSelect,
  onView,
  onToggleSelectionPresentation,
  onDelete,
}: GalleryGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <ImageIcon className="w-16 h-16 mb-4 text-slate-300" />
        <p className="text-lg font-medium">Aucune photo</p>
        <p className="text-sm">Les photos apparaîtront ici après import</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card
          key={photo.id}
          className={`group relative overflow-hidden cursor-pointer transition-all duration-200 ${
            selectedIds.includes(photo.id)
              ? 'ring-2 ring-orange-500 ring-offset-2'
              : 'hover:shadow-lg hover:scale-[1.02]'
          }`}
          onMouseEnter={() => setHoveredId(photo.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={(e) => {
            // Ne pas ouvrir si clic sur checkbox ou menu
            if ((e.target as HTMLElement).closest('[data-no-view]')) return
            onView(photo)
          }}
        >
          {/* Zone image placeholder */}
          <div className={`aspect-square ${getPlaceholderUrl(photo)} flex items-center justify-center relative`}>
            {/* Icône image */}
            <ImageIcon className="w-12 h-12 text-white/50" />
            
            {/* Overlay au hover */}
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200 ${
                hoveredId === photo.id ? 'opacity-100' : 'opacity-0'
              }`}
              data-no-view
            >
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(photo)
                }}
                data-no-view
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              {onToggleSelectionPresentation && (
                <Button
                  variant={photo.selection_presentation ? 'default' : 'secondary'}
                  size="icon"
                  className={`h-9 w-9 rounded-full ${photo.selection_presentation ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSelectionPresentation(photo.id)
                  }}
                  data-no-view
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Badge sélection présentation */}
            {photo.selection_presentation && (
              <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs gap-1">
                ⭐ Rapport
              </Badge>
            )}

            {/* Checkbox sélection */}
            <button
              className={`absolute top-2 right-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                selectedIds.includes(photo.id)
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-white/70 bg-black/20 opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect(photo.id)
              }}
              data-no-view
            >
              {selectedIds.includes(photo.id) && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Infos sous l'image */}
          <div className="p-3">
            <p className="text-sm font-medium truncate">{photo.nom_fichier}</p>
            {(photo.legende || photo.date_prise) && (
              <div className="flex items-center gap-2 mt-1">
                {photo.date_prise && (
                  <span className="text-xs text-slate-500">{formatDate(photo.date_prise)}</span>
                )}
                {photo.legende && (
                  <span className="text-xs text-slate-400 truncate">{photo.legende}</span>
                )}
              </div>
            )}
            
            {/* Actions rapides */}
            <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-no-view>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-no-view>
                  <DropdownMenuItem onClick={() => onView(photo)} data-no-view>
                    <Eye className="w-4 h-4 mr-2" /> Voir en grand
                  </DropdownMenuItem>
                  {onToggleSelectionPresentation && (
                    <DropdownMenuItem
                      onClick={() => onToggleSelectionPresentation(photo.id)}
                      data-no-view
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {photo.selection_presentation ? 'Retirer du rapport' : 'Ajouter au rapport'}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(photo.id)}
                      data-no-view
                    >
                      <X className="w-4 h-4 mr-2" /> Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
