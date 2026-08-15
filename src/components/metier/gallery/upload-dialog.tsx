'use client'

import React, { useState, useCallback } from 'react'
import {
  Upload,
  X,
  FileImage,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  Link2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (files: UploadedFile[]) => void
  activities?: { id: string; titre: string }[]
  incidents?: { id: string; titre: string }[]
}

export interface UploadedFile {
  id: string
  nom_fichier: string
  mime: string
  taille: number
  kind: 'PHOTO' | 'DOCUMENT'
}

// Types de fichiers acceptés
const ACCEPTED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
}

// Extensions acceptées
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx'

interface FileWithPreview extends File {
  preview?: string
  id: string
}

export function UploadDialog({
  isOpen,
  onClose,
  onUploadComplete,
  activities = [],
  incidents = [],
}: UploadDialogProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // Métadonnées
  const [legende, setLegende] = useState('')
  const [datePrise, setDatePrise] = useState('')
  const [lieuPrise, setLieuPrise] = useState('')
  const [description, setDescription] = useState('')
  const [lienActivite, setLienActivite] = useState<string>('')
  const [lienIncident, setLienIncident] = useState<string>('')

  // Déterminer le type de fichier
  const getFileKind = (file: File): 'PHOTO' | 'DOCUMENT' => {
    if (ACCEPTED_TYPES.images.includes(file.type)) return 'PHOTO'
    return 'DOCUMENT'
  }

  // Formater la taille du fichier
  const formatTaille = (taille: number): string => {
    if (taille < 1024) return `${taille} o`
    if (taille < 1024 * 1024) return `${(taille / 1024).toFixed(1)} Ko`
    return `${(taille / (1024 * 1024)).toFixed(1)} Mo`
  }

  // Ajouter des fichiers à la liste - declared before use
  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const isValidType = [...ACCEPTED_TYPES.images, ...ACCEPTED_TYPES.documents].includes(
        file.type
      )
      if (!isValidType) {
        setUploadError(`Type de fichier non supporté: ${file.name}`)
        return false
      }
      return true
    })

    const filesWithIds = validFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substring(7),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...filesWithIds])
    setUploadError(null)
  }, [])

  // Gérer le drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [addFiles])

  // Gérer la sélection de fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  // Supprimer un fichier de la liste
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) URL.revokeObjectURL(file.preview)
      return prev.filter((f) => f.id !== id)
    })
  }

  // Simuler l'upload
  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    // Simuler une progression d'upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Préparer les métadonnées des fichiers uploadés
    const uploadedFiles: UploadedFile[] = files.map((file) => ({
      id: file.id,
      nom_fichier: file.name,
      mime: file.type,
      taille: file.size,
      kind: getFileKind(file),
    }))

    // Appeler le callback si fourni
    if (onUploadComplete) {
      onUploadComplete(uploadedFiles)
    }

    // Reset et fermer
    setTimeout(() => {
      setIsUploading(false)
      resetForm()
      onClose()
    }, 500)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    setFiles([])
    setLegende('')
    setDatePrise('')
    setLieuPrise('')
    setDescription('')
    setLienActivite('')
    setLienIncident('')
    setUploadProgress(0)
    setUploadError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-500" />
            Importer des fichiers
          </DialogTitle>
          <DialogDescription>
            Importez des photos ou documents pour votre organisation.
            Formats acceptés : JPG, PNG, WEBP, PDF, DOC, DOCX, XLS, XLSX
          </DialogDescription>
        </DialogHeader>

        {/* Zone de drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-orange-500 bg-orange-50'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">
            Glissez-déposez vos fichiers ici
          </p>
          <p className="text-xs text-slate-500 mt-1">
            ou cliquez pour parcourir
          </p>
        </div>

        {/* Liste des fichiers sélectionnés */}
        {files.length > 0 && (
          <div className="space-y-2 mt-4">
            <Label>Fichiers sélectionnés ({files.length})</Label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                >
                  {getFileKind(file) === 'PHOTO' ? (
                    <FileImage className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  ) : (
                    <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                  )}
                  
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : null}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatTaille(file.size)} •{' '}
                      {getFileKind(file) === 'PHOTO' ? 'Photo' : 'Document'}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                    onClick={() => removeFile(file.id)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Upload en cours...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Erreur */}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

        {/* Métadonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="legende">Légende</Label>
            <Input
              id="legende"
              placeholder="Description courte..."
              value={legende}
              onChange={(e) => setLegende(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datePrise">Date de prise</Label>
            <Input
              id="datePrise"
              type="date"
              value={datePrise}
              onChange={(e) => setDatePrise(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieuPrise">Lieu</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="lieuPrise"
                placeholder="Ville, région..."
                value={lieuPrise}
                onChange={(e) => setLieuPrise(e.target.value)}
                disabled={isUploading}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lienActivite">Lier à une activité</Label>
            <Select value={lienActivite} onValueChange={setLienActivite} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Optionnel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune activité</SelectItem>
                {activities.map((act) => (
                  <SelectItem key={act.id} value={act.id}>
                    {act.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              placeholder="Description optionnelle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importer {files.length > 0 ? `(${files.length})` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
