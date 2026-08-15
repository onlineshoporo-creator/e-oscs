'use client'

import React, { useState, useEffect } from 'react'
import {
  Bell,
  Settings,
  CheckCheck,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  NotificationList,
  NotificationBadge,
  EmptyNotifications,
} from '@/components/metier/notifications'
import type { Notification as NotifType } from '@/lib/actions/notifications'

// Données mock pour la démo
const MOCK_NOTIFICATIONS: NotifType[] = [
  {
    id: 'notif-1',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_SOUMISE',
    titre: 'Nouvelle activité soumise',
    message:
      'L\'activité "Formation des cadres techniques" a été soumise pour validation par Marie Kouassi.',
    lien: '/app/validation',
    lue: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_VALIDEE',
    titre: 'Activité validée',
    message:
      'Félicitations ! L\'activité "Sensibilisation communautaire" a été validée.',
    lien: '/app/activites',
    lue: false,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'RAPPORT_DISPONIBLE',
    titre: 'Rapport mensuel disponible',
    message:
      'Le rapport d\'activités de janvier est prêt. Consultez-le dans la section rapports.',
    lien: '/app/rapports',
    lue: false,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'PERIODE_CLOTUREE',
    titre: 'Période clôturée',
    message:
      'Le trimestre T1 2024 a été clôturé. Vous pouvez consulter le bilan trimestriel.',
    lien: '/app/periodes/2024/1',
    lue: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_REJETEE',
    titre: 'Activité rejetée',
    message:
      'L\'activité "Renforcement des capacités" a été rejetée. Motif : Documents manquants.',
    lien: '/app/activites',
    lue: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-6',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'NOUVEAU_MEMBRE',
    titre: 'Nouveau membre',
    message:
      'Un nouvel utilisateur a rejoint votre organisation : Amadou Diallo.',
    lien: null,
    lue: true,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-7',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_SOUMISE',
    titre: 'Nouvelle activité soumise',
    message:
      'L\'activité "Campagne de vaccination" a été soumise pour validation.',
    lien: '/app/validation',
    lue: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function NotificationsPage() {
  // État
  const [activeTab, setActiveTab] = useState<'toutes' | 'non_lues' | 'importantes'>('toutes')
  const [notifications, setNotifications] = useState<NotifType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setNotifications(MOCK_NOTIFICATIONS)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Filtrer selon l'onglet actif
  const filteredNotifications = notifications.filter((n) => {
    switch (activeTab) {
      case 'non_lues':
        return !n.lue
      case 'importantes':
        return ['PERIODE_CLOTUREE', 'ACTIVITE_REJETEE'].includes(n.type)
      default:
        return true
    }
  })

  // Compteurs
  const unreadCount = notifications.filter((n) => !n.lue).length

  // Handlers
  const handleToggleRead = async (id: string, lue: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lue } : n))
    )
    
    // En production:
    // await markAsRead(id, lue)
  }

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    
    // En production:
    // await deleteNotification(id)
  }

  const handleClick = (notification: NotifType) => {
    // Marquer comme lue si non lue
    if (!notification.lue) {
      handleToggleRead(notification.id, true)
    }
    
    // Naviguer vers le lien si présent
    if (notification.lien) {
      window.location.href = notification.lien
    }
  }

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })))
    setIsMarkingAll(false)
    
    // En production:
    // await markAllAsRead(userId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-7 h-7 text-orange-500" />
            Centre de Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Restez informé des activités de votre organisation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton tout marquer lu */}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="gap-2"
            >
              {isMarkingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Tout marquer lu ({unreadCount})
            </Button>
          )}

          {/* Bouton paramètres */}
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Badge compteur */}
          <NotificationBadge count={unreadCount} size="lg" />
        </div>
      </div>

      {/* Onglets */}
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as typeof activeTab)
        }
      >
        <TabsList>
          <TabsTrigger value="toutes" className="gap-2">
            Toutes
            <Badge variant="secondary" className="ml-1 text-xs">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="non_lues" className="gap-2 relative">
            Non lues
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
            )}
            <Badge variant="secondary" className="ml-1 text-xs">
              {unreadCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="importantes" className="gap-2">
            ⚠️ Importantes
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <NotificationList
                notifications={filteredNotifications}
                isLoading={isLoading}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
                onClick={handleClick}
                onMarkAllRead={handleMarkAllRead}
                emptyMessage={
                  activeTab === 'non_lues'
                    ? 'Aucune notification non lue'
                    : activeTab === 'importantes'
                    ? 'Aucune notification importante'
                    : undefined
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats en bas */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-sm text-slate-500">
        <span>
          📊 {notifications.length} notification(s) au total
        </span>
        <span>•</span>
        <span className="text-orange-600 font-medium">
          🔔 {unreadCount} non lue(s)
        </span>
        <span>•</span>
        <span>
          ✅ {notifications.filter((n) => n.lue).length} lue(s)
        </span>
      </div>
    </div>
  )
}
