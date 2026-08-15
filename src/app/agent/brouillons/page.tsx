import Link from 'next/link'
import {
  FileEdit,
  PlusCircle,
  Trash2,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// Données mockées des brouillons
const mockBrouillons = [
  {
    id: 'draft-1',
    intitule: 'Formation en techniques agricoles',
    dateCreation: '2025-01-10',
    dateDerniereModif: '2025-01-14',
    progression: 75, // pourcentage de complétion
  },
  {
    id: 'draft-2',
    intitule: 'Campagne de vaccination',
    dateCreation: '2025-01-08',
    dateDerniereModif: '2025-01-08',
    progression: 25,
  },
  {
    id: 'draft-3',
    intitule: 'Atelier d\'alphabétisation',
    dateCreation: '2025-01-05',
    dateDerniereModif: '2025-01-06',
    progression: 50,
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getProgressionColor(progression: number): string {
  if (progression >= 75) return 'bg-green-500'
  if (progression >= 50) return 'bg-yellow-500'
  return 'bg-orange-500'
}

export default function BrouillonsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mes brouillons</h1>
          <p className="text-slate-500 mt-1">
            Reprenez et finalisez vos activités inachevées.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-800 font-medium">
            Les brouillons sont sauvegardés automatiquement
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Vous pouvez revenir sur vos brouillons à tout moment pour les compléter et les soumettre.
          </p>
        </div>
      </div>

      {/* Liste des brouillons */}
      <div className="space-y-4">
        {mockBrouillons.map((brouillon) => (
          <Card key={brouillon.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileEdit className="w-6 h-6 text-slate-500" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate pr-4">
                      {brouillon.intitule}
                    </h3>
                    
                    <p className="text-sm text-slate-500 mt-1">
                      Créé le {formatDate(brouillon.dateCreation)}
                      {brouillon.dateDerniereModif !== brouillon.dateCreation && (
                        <> · Modifié le {formatDate(brouillon.dateDerniereModif)}</>
                      )}
                    </p>

                    {/* Barre de progression */}
                    <div className="mt-3 max-w-[200px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progression</span>
                        <span className="text-xs font-medium text-slate-700">{brouillon.progression}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${getProgressionColor(brouillon.progression)}`}
                          style={{ width: `${brouillon.progression}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={brouillon.progression > 50 ? "default" : "secondary"}>
                    {brouillon.progression === 100 ? 'Prêt à soumettre' : 'En cours'}
                  </Badge>
                  
                  <Link href={`/agent/activites/nouvelle?id=${brouillon.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Continuer
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce brouillon ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le brouillon &quot;{brouillon.intitule}&quot; sera définitivement supprimé.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockBrouillons.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-8 text-center">
              <FileEdit className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucun brouillon</p>
              <p className="text-sm text-slate-400 mt-1">
                Vous n&apos;avez pas d&apos;activité en cours de rédaction.
              </p>
              <Link href="/agent/activites/nouvelle" className="mt-4 inline-block">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Créer une activité
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
