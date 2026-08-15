'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Users, 
  Users2, 
  CheckSquare,
  Paperclip
} from 'lucide-react'
import { BeneficiariesCard } from './beneficiaries-card'
import { ActorsList } from './actors-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Types
interface ActivityDetail {
  id: string
  intitule: string
  description?: string
  objectif?: string
  resultats?: string
  difficultes?: string
  recommandations?: string
  perspectives?: string
  observations?: string
  statut: string
}

interface BeneficiaryData {
  hommes?: number
  femmes?: number
  enfants?: number
  adultes?: number
  personnes_agees?: number
  vulnerables?: number
  total?: number
}

interface ActorData {
  id: string
  acteur: string
  type_acteur: 'INTERNE' | 'PARTENAIRE'
  role?: string
}

interface ActivityTabsProps {
  activity: ActivityDetail
  beneficiaries: BeneficiaryData | null
  actors: ActorData[]
  onDeleteActor?: (actorId: string) => void
  readOnly?: boolean
}

export function ActivityTabs({ 
  activity, 
  beneficiaries, 
  actors, 
  onDeleteActor,
  readOnly = false 
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState('resume')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 h-auto">
        <TabsTrigger 
          value="resume" 
          className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Résumé</span>
          <span className="sm:hidden">Résumé</span>
        </TabsTrigger>
        <TabsTrigger 
          value="beneficiaires" 
          className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Bénéficiaires</span>
          <span className="sm:hidden">Bén.</span>
        </TabsTrigger>
        <TabsTrigger 
          value="acteurs" 
          className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <Users2 className="w-4 h-4" />
          <span className="hidden sm:inline">Acteurs</span>
          <span className="sm:hidden">Act.</span>
        </TabsTrigger>
        <TabsTrigger 
          value="resultats" 
          className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Résultats</span>
          <span className="sm:hidden">Rés.</span>
        </TabsTrigger>
        <TabsTrigger 
          value="pieces" 
          className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
        >
          <Paperclip className="w-4 h-4" />
          <span className="hidden sm:inline">Pièces jointes</span>
          <span className="sm:hidden">PJ</span>
        </TabsTrigger>
      </TabsList>

      {/* Onglet Résumé */}
      <TabsContent value="resume" className="mt-6 animate-in fade-in duration-200">
        <div className="space-y-6">
          {/* Description */}
          {activity.description && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Objectif */}
          {activity.objectif && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Objectif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {activity.objectif}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mini aperçu bénéficiaires */}
          {beneficiaries && beneficiaries.total !== undefined && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Bénéficiaires (aperçu)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-slate-50 rounded-lg">
                    <span className="text-2xl font-bold text-slate-900">{beneficiaries.total}</span>
                    <span className="text-sm text-slate-500 ml-2">Total</span>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-lg">
                    <span className="text-lg font-semibold text-blue-700">{beneficiaries.hommes || 0}</span>
                    <span className="text-sm text-slate-500 ml-1">H</span>
                  </div>
                  <div className="px-4 py-2 bg-pink-50 rounded-lg">
                    <span className="text-lg font-semibold text-pink-700">{beneficiaries.femmes || 0}</span>
                    <span className="text-sm text-slate-500 ml-1">F</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Onglet Bénéficiaires */}
      <TabsContent value="beneficiaires" className="mt-6 animate-in fade-in duration-200">
        <BeneficiariesCard beneficiaries={beneficiaries} showChart={true} />
      </TabsContent>

      {/* Onglet Acteurs */}
      <TabsContent value="acteurs" className="mt-6 animate-in fade-in duration-200">
        <ActorsList 
          actors={actors} 
          onDelete={onDeleteActor}
          readOnly={readOnly}
        />
      </TabsContent>

      {/* Onglet Résultats */}
      <TabsContent value="resultats" className="mt-6 animate-in fade-in duration-200">
        <div className="space-y-6">
          {/* Résultats obtenus */}
          <ResultSection
            title="Résultats obtenus"
            icon={<CheckSquare className="w-5 h-5 text-green-500" />}
            content={activity.resultats}
            emptyMessage="Les résultats de cette activité n'ont pas encore été renseignés."
          />

          {/* Difficultés rencontrées */}
          <ResultSection
            title="Difficultés rencontrées"
            icon={
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            content={activity.difficultes}
            emptyMessage="Aucune difficulté signalée."
          />

          {/* Recommandations */}
          <ResultSection
            title="Recommandations"
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            content={activity.recommandations}
            emptyMessage="Aucune recommandation formulée."
          />

          {/* Perspectives */}
          <ResultSection
            title="Perspectives"
            icon={
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            content={activity.perspectives}
            emptyMessage="Aucune perspective définie."
          />

          {/* Observations */}
          <ResultSection
            title="Observations"
            icon={
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            }
            content={activity.observations}
            emptyMessage="Aucune observation ajoutée."
          />
        </div>
      </TabsContent>

      {/* Onglet Pièces jointes */}
      <TabsContent value="pieces" className="mt-6 animate-in fade-in duration-200">
        <Card className="border-dashed border-slate-300">
          <CardContent className="p-8 text-center">
            <Paperclip className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-medium text-slate-700 mb-1">Pièces jointes</h3>
            <p className="text-sm text-slate-500 mb-4">
              Aucune pièce jointe pour le moment.
            </p>
            
            {/* Zone d'upload (placeholder) */}
            <div className="max-w-md mx-auto border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer">
              <Paperclip className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">
                Glissez vos fichiers ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, Word, Excel, Images • Max 10MB par fichier
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Composant réutilisable pour les sections de résultats
function ResultSection({ 
  title, 
  icon, 
  content, 
  emptyMessage 
}: { 
  title: string
  icon: React.ReactNode
  content?: string | null
  emptyMessage: string 
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content ? (
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        ) : (
          <p className="text-slate-400 italic text-sm">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  )
}
