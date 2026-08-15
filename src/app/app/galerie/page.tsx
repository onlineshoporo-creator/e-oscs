'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import {
  Upload,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MediaFilters,
  GalleryGrid,
  DocumentList,
  MediaViewer,
  UploadDialog,
} from '@/components/metier/gallery'
import type { Attachment, MediaFilters as MediaFiltersType, UploadedFile } from '@/components/metier/gallery'
import {
  getAttachments,
  getAttachmentStats,
  toggleSelectionPresentation,
  deleteAttachment,
} from '@/lib/actions/attachments'

// Données mock pour la démo (seront remplacées par Supabase)
const MOCK_ATTACHMENTS: Attachment[] = [
  {
    id: '1',
    organization_id: 'org-1',
    activity_id: 'act-1',
    incident_id: null,
    kind: 'PHOTO',
    storage_path: '/attachments/photo1.jpg',
    nom_fichier: 'formation_cadres_2024.jpg',
    mime: 'image/jpeg',
    taille: 2457600,
    legende: 'Formation des cadres techniques',
    date_prise: '2024-01-15',
    lieu_prise: 'Abidjan, Plateau',
    description: 'Photo de groupe lors de la formation des cadres',
    selection_presentation: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    organization_id: 'org-1',
    activity_id: 'act-2',
    incident_id: null,
    kind: 'PHOTO',
    storage_path: '/attachments/photo2.jpg',
    nom_fichier: 'atelier_planification.jpg',
    mime: 'image/jpeg',
    taille: 1890000,
    legende: 'Atelier de planification annuelle',
    date_prise: '2024-02-20',
    lieu_prise: 'Yamoussoukro',
    description: null,
    selection_presentation: false,
    created_at: '2024-02-20T14:15:00Z',
    updated_at: '2024-02-20T14:15:00Z',
  },
  {
    id: '3',
    organization_id: 'org-1',
    activity_id: null,
    incident_id: null,
    kind: 'DOCUMENT',
    storage_path: '/attachments/rapport.pdf',
    nom_fichier: 'rapport_activite_Q1.pdf',
    mime: 'application/pdf',
    taille: 1524000,
    legende: 'Rapport d\'activité du premier trimestre',
    date_prise: null,
    lieu_prise: null,
    description: 'Document PDF contenant le résumé des activités du Q1',
    selection_presentation: true,
    created_at: '2024-03-31T09:00:00Z',
    updated_at: '2024-03-31T09:00:00Z',
  },
  {
    id: '4',
    organization_id: 'org-1',
    activity_id: 'act-3',
    incident_id: null,
    kind: 'PHOTO',
    storage_path: '/attachments/photo3.png',
    nom_fichier: 'sensibilisation_sanitaire.png',
    mime: 'image/png',
    taille: 3200000,
    legende: 'Campagne de sensibilisation sanitaire',
    date_prise: '2024-03-10',
    lieu_prise: 'Bouaké',
    description: null,
    selection_presentation: false,
    created_at: '2024-03-10T16:45:00Z',
    updated_at: '2024-03-10T16:45:00Z',
  },
  {
    id: '5',
    organization_id: 'org-1',
    activity_id: null,
    incident_id: 'inc-1',
    kind: 'PHOTO',
    storage_path: '/attachments/photo4.jpg',
    nom_fichier: 'intervention_incident.jpg',
    mime: 'image/jpeg',
    taille: 1750000,
    legende: null,
    date_prise: '2024-04-05',
    lieu_prise: 'San-Pedro',
    description: 'Photo prise lors de l\'intervention sur incident',
    selection_presentation: false,
    created_at: '2024-04-05T11:20:00Z',
    updated_at: '2024-04-05T11:20:00Z',
  },
  {
    id: '6',
    organization_id: 'org-1',
    activity_id: 'act-1',
    incident_id: null,
    kind: 'DOCUMENT',
    storage_path: '/attachments/budget.xlsx',
    nom_fichier: 'budget_annuel_2024.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    taille: 89000,
    legende: 'Budget annuel détaillé',
    date_prise: null,
    lieu_prise: null,
    description: null,
    selection_presentation: false,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
]

export default function GaleriePage() {
  // État
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<MediaFiltersType>({
    kind: 'ALL',
    lien: 'all',
    search: '',
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentAttachment, setCurrentAttachment] = useState<Attachment | null>(null)
  
  // Upload dialog
  const [uploadOpen, setUploadOpen] = useState(false)
  
  // Loading
  const [isLoading, setIsLoading] = useState(true)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalDocuments: 0,
    tailleTotale: 0,
    selectionneesPresentation: 0,
  })

  // Charger les données (simulation avec données mock)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simuler un chargement
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Utiliser les données mock pour l'instant
      // En production, remplacer par :
      // const result = await getAttachments(organizationId, filters)
      // const statsData = await getAttachmentStats(organizationId)
      
      setAttachments(MOCK_ATTACHMENTS)
      
      const photos = MOCK_ATTACHMENTS.filter((a) => a.kind === 'PHOTO')
      const documents = MOCK_ATTACHMENTS.filter((a) => a.kind === 'DOCUMENT')
      const tailleTotale = MOCK_ATTACHMENTS.reduce((sum, a) => sum + a.taille, 0)
      const selectionnees = MOCK_ATTACHMENTS.filter(
        (a) => a.selection_presentation
      ).length
      
      setStats({
        totalPhotos: photos.length,
        totalDocuments: documents.length,
        tailleTotale,
        selectionneesPresentation: selectionnees,
      })
      
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Filtrer les attachments selon les filtres actuels
  const filteredAttachments = attachments.filter((att) => {
    // Filtre type
    if (filters.kind !== 'ALL' && att.kind !== filters.kind) return false
    
    // Filtre lien
    if (filters.lien === 'activites' && !att.activity_id) return false
    if (filters.lien === 'incidents' && !att.incident_id) return false
    if (
      filters.lien === 'aucun' &&
      (att.activity_id || att.incident_id)
    )
      return false
    
    // Recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchNom = att.nom_fichier.toLowerCase().includes(searchLower)
      const matchLegende = att.legende?.toLowerCase().includes(searchLower)
      if (!matchNom && !matchLegende) return false
    }
    
    return true
  })

  // Séparer photos et documents
  const photos = filteredAttachments.filter((a) => a.kind === 'PHOTO')
  const documents = filteredAttachments.filter((a) => a.kind === 'DOCUMENT')

  // Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleView = (attachment: Attachment) => {
    setCurrentAttachment(attachment)
    setViewerOpen(true)
  }

  const handleNavigate = (attachment: Attachment) => {
    setCurrentAttachment(attachment)
  }

  const handleToggleSelectionPresentation = async (id: string) => {
    // Simuler l'action
    setAttachments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, selection_presentation: !a.selection_presentation } : a
      )
    )
    
    // En production:
    // await toggleSelectionPresentation(id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return
    
    // Simuler la suppression
    setAttachments((prev) => prev.filter((a) => a.id !== id))
    
    // En production:
    // await deleteAttachment(id)
  }

  const handleUploadComplete = (files: UploadedFile[]) => {
    // Ajouter les nouveaux fichiers à la liste (simulation)
    const newAttachments: Attachment[] = files.map((f) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id: 'org-1',
      activity_id: null,
      incident_id: null,
      kind: f.kind,
      storage_path: `/uploads/${f.nom_fichier}`,
      nom_fichier: f.nom_fichier,
      mime: f.mime,
      taille: f.taille,
      legende: '',
      date_prise: null,
      lieu_prise: null,
      description: null,
      selection_presentation: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    
    setAttachments((prev) => [...newAttachments, ...prev])
  }

  // Pagination
  const ITEMS_PER_PAGE = viewMode === 'grid' ? 12 : 10
  const totalPages = Math.ceil(filteredAttachments.length / ITEMS_PER_PAGE)
  const paginatedAttachments = filteredAttachments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galerie Médias</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos photos et documents joints aux activités
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle vue grille/liste */}
          <div className="flex items-center border rounded-lg p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className={`h-8 w-8 p-0 ${
                viewMode === 'grid' ? 'bg-orange-500 text-white' : ''
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`h-8 w-8 p-0 ${
                viewMode === 'list' ? 'bg-orange-500 text-white' : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Bouton upload */}
          <Button
            onClick={() => setUploadOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 gap-2"
          >
            <Upload className="w-4 h-4" />
            Uploader
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <MediaFilters
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              setCurrentPage(1)
            }}
            stats={stats}
          />
        </CardContent>
      </Card>

      {/* Sélection multiple */}
      {selectedIds.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700">
              {selectedIds.length} élément(s) sélectionné(s)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-100"
                onClick={async () => {
                  // Toggle sélection pour tous
                  selectedIds.forEach((id) => {
                    handleToggleSelectionPresentation(id)
                  })
                  setSelectedIds([])
                }}
              >
                ⭐ Ajouter au rapport
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
              >
                Désélectionner tout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenu principal */}
      {isLoading ? (
        /* Skeleton loading */
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`animate-pulse rounded-lg bg-slate-100 ${
                viewMode === 'grid' ? 'aspect-square' : 'h-24'
              }`}
            />
          ))}
        </div>
      ) : (
        <>
          {filteredAttachments.length === 0 ? (
            /* État vide */
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  {filters.kind !== 'ALL' || filters.search ? (
                    <svg
                      className="w-8 h-8 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-lg font-medium text-slate-700">
                  {filters.kind !== 'ALL' || filters.search
                    ? 'Aucun résultat trouvé'
                    : 'Aucun média'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {filters.kind !== 'ALL' || filters.search
                    ? 'Essayez de modifier vos filtres'
                    : 'Commencez par importer vos premiers fichiers'}
                </p>
                {(filters.kind !== 'ALL' || filters.search) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      setFilters({ kind: 'ALL', lien: 'all', search: '' })
                    }
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
                {!filters.search && filters.kind === 'ALL' && (
                  <Button
                    className="mt-4 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setUploadOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importer des fichiers
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Onglets Photos/Documents ou vue unique */}
              {filters.kind === 'ALL' ? (
                <Tabs defaultValue="photos" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="photos" className="gap-2">
                      📷 Photos ({photos.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="gap-2">
                      📄 Documents ({documents.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="photos">
                    <GalleryGrid
                      photos={photos}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onView={handleView}
                      onToggleSelectionPresentation={
                        handleToggleSelectionPresentation
                      }
                      onDelete={handleDelete}
                    />
                  </TabsContent>

                  <TabsContent value="documents">
                    <DocumentList
                      documents={documents}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onView={handleView}
                      onToggleSelectionPresentation={
                        handleToggleSelectionPresentation
                      }
                      onDelete={handleDelete}
                    />
                  </TabsContent>
                </Tabs>
              ) : filters.kind === 'PHOTO' ? (
                <GalleryGrid
                  photos={paginatedAttachments.filter(
                    (a) => a.kind === 'PHOTO'
                  )}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onView={handleView}
                  onToggleSelectionPresentation={
                    handleToggleSelectionPresentation
                  }
                  onDelete={handleDelete}
                />
              ) : (
                <DocumentList
                  documents={paginatedAttachments.filter(
                    (a) => a.kind === 'DOCUMENT'
                  )}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onView={handleView}
                  onToggleSelectionPresentation={
                    handleToggleSelectionPresentation
                  }
                  onDelete={handleDelete}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </Button>
                  
                  <span className="text-sm text-slate-600">
                    Page {currentPage} sur {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Media Viewer Modal */}
      <MediaViewer
        attachment={currentAttachment}
        attachments={filteredAttachments.filter((a) => a.kind === 'PHOTO')}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={handleNavigate}
        onToggleSelectionPresentation={handleToggleSelectionPresentation}
      />

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
