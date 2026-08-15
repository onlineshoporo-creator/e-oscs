'use client'

import React, { useEffect, useCallback, useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Check,
  MapPin,
  Calendar,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Attachment } from '@/lib/actions/attachments'

interface MediaViewerProps {
  attachment: Attachment | null
  attachments: Attachment[]
  isOpen: boolean
  onClose: () => void
  onNavigate?: (attachment: Attachment) => void
  onToggleSelectionPresentation?: (id: string) => void
}

// Générer une URL placeholder pour l'image
function getPlaceholderUrl(attachment: Attachment): string {
  const colors = [
    'from-orange-300 to-amber-200',
    'from-green-300 to-emerald-200',
    'from-blue-300 to-sky-200',
    'from-purple-300 to-violet-200',
    'from-pink-300 to-rose-200',
    'from-teal-300 to-cyan-200',
  ]
  
  const index = attachment.nom_fichier.length % colors.length
  return `bg-gradient-to-br ${colors[index]}`
}

// Formater la date
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function MediaViewer({
  attachment,
  attachments,
  isOpen,
  onClose,
  onNavigate,
  onToggleSelectionPresentation,
}: MediaViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(true)
  const prevAttachmentIdRef = React.useRef<string | null>(null)

  // Reset zoom quand l'image change - using ref comparison
  React.useEffect(() => {
    if (attachment?.id && attachment.id !== prevAttachmentIdRef.current) {
      setZoom(1)
      setShowInfo(true)
      prevAttachmentIdRef.current = attachment.id
    }
  }, [attachment?.id])

  const currentIndex = attachments.findIndex((a) => a.id === attachment?.id)

  // Navigation functions - declared before use
  const navigatePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1
      const prev = attachments[prevIdx]
      if (onNavigate && prev) {
        onNavigate(prev)
      }
    }
  }, [currentIndex, attachments, onNavigate])

  const navigateNext = useCallback(() => {
    if (currentIndex < attachments.length - 1) {
      const nextIdx = currentIndex + 1
      const next = attachments[nextIdx]
      if (onNavigate && next) {
        onNavigate(next)
      }
    }
  }, [currentIndex, attachments, onNavigate])

  // Navigation clavier
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !attachment) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          navigatePrev()
          break
        case 'ArrowRight':
          navigateNext()
          break
        case '+':
        case '=':
          setZoom((z) => Math.min(z + 0.25, 3))
          break
        case '-':
          setZoom((z) => Math.max(z - 0.25, 0.5))
          break
        case 'i':
          setShowInfo((s) => !s)
          break
      }
    },
    [isOpen, attachment, navigatePrev, navigateNext, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!attachment) return null

  const isPhoto = attachment.kind === 'PHOTO'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden bg-slate-900">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-medium truncate max-w-md">
              {attachment.nom_fichier}
            </h3>
            <Badge variant={isPhoto ? 'default' : 'secondary'} className={
              isPhoto ? 'bg-blue-500' : ''
            }>
              {isPhoto ? '📷 Photo' : '📄 Document'}
            </Badge>
            {attachment.selection_presentation && (
              <Badge className="bg-orange-500 text-white">
                ⭐ Sélectionnée rapport
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Contrôles zoom */}
            {isPhoto && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Toggle info */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>

            {/* Fermer */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex items-center justify-center h-full pt-16 pb-24">
          <div
            className="transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            {isPhoto ? (
              /* Zone image */
              <div
                className={`${getPlaceholderUrl(attachment)} w-[80vw] max-w-4xl h-[60vh] rounded-lg flex items-center justify-center`}
              >
                <div className="text-center text-white/60">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Aperçu de l'image</p>
                  <p className="text-xs mt-1 opacity-70">{attachment.nom_fichier}</p>
                </div>
              </div>
            ) : (
              /* Zone document */
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl">
                <div className="flex flex-col items-center text-center">
                  <FileIcon mime={attachment.mime} className="w-24 h-24 mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    {attachment.nom_fichier}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {(attachment.taille / 1024).toFixed(1)} Ko • {attachment.mime}
                  </p>
                  
                  {attachment.description && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg w-full text-left">
                      <p className="text-sm text-slate-600">{attachment.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation précédent/suivant */}
        {isPhoto && attachments.length > 1 && (
          <>
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                onClick={navigatePrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            {currentIndex < attachments.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full"
                onClick={navigateNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
            
            {/* Indicateur position */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {attachments.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-orange-500 w-6'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => onNavigate && onNavigate(attachments[idx])}
                />
              ))}
            </div>
          </>
        )}

        {/* Footer avec infos */}
        {showInfo && (
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-start justify-between text-white">
              <div className="space-y-1">
                {attachment.legende && (
                  <p className="font-medium">{attachment.legende}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-white/70">
                  {attachment.date_prise && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(attachment.date_prise)}
                    </span>
                  )}
                  {attachment.lieu_prise && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {attachment.lieu_prise}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onToggleSelectionPresentation && (
                  <Button
                    variant={attachment.selection_presentation ? 'default' : 'outline'}
                    size="sm"
                    className={`${
                      attachment.selection_presentation
                        ? 'bg-orange-500 hover:bg-orange-600 border-orange-500'
                        : 'border-white/50 text-white hover:bg-white/10'
                    }`}
                    onClick={() => onToggleSelectionPresentation(attachment.id)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {attachment.selection_presentation ? 'Sélectionnée' : 'Sélectionner'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/50 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Composant icône fichier pour les documents
function FileIcon({ mime, className }: { mime: string; className?: string }) {
  let color = 'text-slate-400'
  
  if (mime.includes('pdf')) color = 'text-red-500'
  else if (mime.includes('sheet') || mime.includes('excel')) color = 'text-green-500'
  else if (mime.includes('word') || mime.includes('document')) color = 'text-blue-500'

  return (
    <svg
      className={className || ''}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        className={color}
      />
    </svg>
  )
}
