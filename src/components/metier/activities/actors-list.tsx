'use client'

import React from 'react'
import { Users, Building2, Handshake, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Types
interface ActorData {
  id: string
  acteur: string
  type_acteur: 'INTERNE' | 'PARTENAIRE'
  role?: string
}

interface ActorsListProps {
  actors: ActorData[]
  onDelete?: (actorId: string) => void
  readOnly?: boolean
}

// Configuration des types d'acteurs
const ACTEUR_TYPE_CONFIG = {
  INTERNE: {
    label: 'Interne',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Building2,
  },
  PARTENAIRE: {
    label: 'Partenaire',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Handshake,
  },
} as const

// Composant pour un groupe d'acteurs (défini hors du rendu)
function ActorGroup({ 
  type, 
  items, 
  config, 
  onDelete, 
  readOnly 
}: { 
  type: 'INTERNE' | 'PARTENAIRE'
  items: ActorData[]
  config: typeof ACTEUR_TYPE_CONFIG.INTERNE | typeof ACTEUR_TYPE_CONFIG.PARTENAIRE
  onDelete?: (actorId: string) => void
  readOnly?: boolean
}) {
  const Icon = config.icon
  
  if (items.length === 0) return null

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${type === 'INTERNE' ? 'text-blue-600' : 'text-green-600'}`} />
        <h3 className={`text-sm font-semibold ${type === 'INTERNE' ? 'text-blue-700' : 'text-green-700'}`}>
          Acteurs {config.label}s ({items.length})
        </h3>
        <Badge variant="outline" className={config.color}>
          {config.label}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {items.map((actor) => (
          <Card key={actor.id} className="border-slate-200 hover:border-slate-300 transition-colors">
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900">{actor.acteur}</span>
                  <Badge variant="outline" className={`text-xs ${config.color}`}>
                    {config.label}
                  </Badge>
                </div>
                {actor.role && (
                  <p className="text-sm text-slate-500 mt-1">
                    Rôle : {actor.role}
                  </p>
                )}
              </div>
              
              {!readOnly && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l&apos;acteur &laquo;{actor.acteur}&raquo; ? 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(actor.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ActorsList({ actors, onDelete, readOnly = false }: ActorsListProps) {
  // Séparer les acteurs par type
  const internes = actors.filter(a => a.type_acteur === 'INTERNE')
  const partenaires = actors.filter(a => a.type_acteur === 'PARTENAIRE')

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-700" />
          <h2 className="font-semibold text-slate-900">Acteurs impliqués</h2>
          <Badge variant="secondary" className="ml-2">
            {actors.length}
          </Badge>
        </div>
      </div>

      {/* Liste des acteurs */}
      {actors.length > 0 ? (
        <>
          <ActorGroup type="INTERNE" items={internes} config={ACTEUR_TYPE_CONFIG.INTERNE} onDelete={onDelete} readOnly={readOnly} />
          <ActorGroup type="PARTENAIRE" items={partenaires} config={ACTEUR_TYPE_CONFIG.PARTENAIRE} onDelete={onDelete} readOnly={readOnly} />
        </>
      ) : (
        <Card className="border-dashed border-slate-300">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-medium text-slate-700 mb-1">Aucun acteur renseigné</h3>
            <p className="text-sm text-slate-500">
              Les acteurs impliqués dans cette activité n&apos;ont pas encore été ajoutés.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Résumé */}
      {actors.length > 0 && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-slate-600">
                  Internes : <strong className="text-slate-900">{internes.length}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-green-600" />
                <span className="text-slate-600">
                  Partenaires : <strong className="text-slate-900">{partenaires.length}</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
