'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Bell, 
  BellRing,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  Info,
  UserPlus,
  X,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Types
type NotificationType = 'demande_abonnement' | 'organisation_activee' | 'paiement_recu' | 'systeme' | 'info'

interface Notification {
  id: string
  type: NotificationType
  titre: string
  description: string
  lue: boolean
  created_at: string
  lien?: string
}

// Configuration des types de notification
const NOTIF_CONFIG: Record<NotificationType, { 
  icon: React.ElementType 
  color: string 
  bg: string 
  label: string 
}> = {
  demande_abonnement: {
    icon: UserPlus,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    label: 'Demande'
  },
  organisation_activee: {
    icon: Building2,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    label: 'Organisation'
  },
  paiement_recu: {
    icon: CreditCard,
    color: 'text-green-700',
    bg: 'bg-green-100',
    label: 'Paiement'
  },
  systeme: {
    icon: Info,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    label: 'Système'
  },
  info: {
    icon: AlertCircle,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    label: 'Info'
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/notifications')
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setNotifications(data.data || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) {
      console.error('Erreur chargement notifications:', err)
      setError('Impossible de charger les notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Petit délai pour éviter les problèmes d'hydration
    const timer = setTimeout(() => {
      loadNotifications()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [loadNotifications])

  // Marquer une notification comme lue
  const markAsRead = async (notifId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId: notifId })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notifId ? { ...n, lue: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Erreur marquer lu:', err)
    }
  }

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, lue: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Erreur marquer tout lu:', err)
    }
  }

  // Supprimer une notification
  const deleteNotification = async (notifId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications?id=${notifId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const notif = notifications.find(n => n.id === notifId)
        setNotifications(prev => prev.filter(n => n.id !== notifId))
        if (notif && !notif.lue) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  // Formatage de date
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'À l\'instant'
      if (diffMins < 60) return `Il y a ${diffMins} min`
      if (diffHours < 24) return `Il y a ${diffHours}h`
      if (diffDays < 7) return `Il y a ${diffDays}j`
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    } catch {
      return '-'
    }
  }

  // Gestionnaire de clic sur notification
  const handleNotifClick = (notif: Notification) => {
    if (!notif.lue) {
      markAsRead(notif.id)
    }
    if (notif.lien) {
      window.location.href = notif.lien
    }
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${unreadCount > 0 ? 'bg-[#F77F00]/10' : 'bg-slate-100'}`}>
            {unreadCount > 0 ? (
              <BellRing className={`w-6 h-6 text-[#F77F00]`} />
            ) : (
              <Bell className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {unreadCount > 0 
                ? `${unreadCount} notification(s) non lue(s)` 
                : 'Toutes les notifications ont été lues'
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Tout marquer comme lu
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadNotifications}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-xl font-bold text-slate-900">{notifications.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xl font-bold text-amber-700">
                {notifications.filter(n => n.type === 'demande_abonnement').length}
              </p>
              <p className="text-xs text-amber-600">Demandes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-blue-700">
                {notifications.filter(n => n.type === 'organisation_activee').length}
              </p>
              <p className="text-xs text-blue-600">Organisations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${unreadCount > 0 ? 'border-red-200 bg-red-50/30' : 'border-green-200 bg-green-50/30'}`}>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className={`w-5 h-5 ${unreadCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
            <div>
              <p className={`text-xl font-bold ${unreadCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                {unreadCount}
              </p>
              <p className={`text-xs ${unreadCount > 0 ? 'text-red-600' : 'text-green-600'}`}>Non lues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <Button size="sm" variant="outline" onClick={loadNotifications}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chargement */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        /* État vide */
        <Card>
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Aucune notification
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Vous n&apos;avez pas encore de notification. Les nouvelles alertes apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Liste des notifications */
        <div className="space-y-2">
          {notifications.map((notif) => {
            const config = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.systeme
            const Icon = config.icon
            
            return (
              <Card 
                key={notif.id}
                className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                  !notif.lue 
                    ? 'border-l-4 border-l-[#F77F00] bg-[#F77F00]/[0.02]' 
                    : 'opacity-90 hover:opacity-100'
                }`}
                onClick={() => handleNotifClick(notif)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div className={`p-2.5 rounded-xl ${config.bg} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.lue && (
                              <span className="w-2 h-2 rounded-full bg-[#F77F00] flex-shrink-0" />
                            )}
                            <h3 className={`font-semibold truncate ${
                              !notif.lue ? 'text-slate-900' : 'text-slate-700'
                            }`}>
                              {notif.titre}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                            {notif.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`${config.bg} ${config.color} text-xs`}>
                              {config.label}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(notif.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {notif.lien && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = notif.lien!
                              }}
                            >
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                            </Button>
                          )}
                          {!notif.lue && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notif.id)
                              }}
                              title="Marquer comme lu"
                            >
                              <CheckCheck className="w-4 h-4 text-slate-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notif.id)
                            }}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Footer actions si notifications existent */}
      {notifications.length > 0 && !loading && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (confirm('Supprimer toutes les notifications ?')) {
                try {
                  const response = await fetch('/api/admin/notifications?all=true', {
                    method: 'DELETE'
                  })
                  if (response.ok) {
                    setNotifications([])
                    setUnreadCount(0)
                  }
                } catch (err) {
                  console.error('Erreur suppression:', err)
                }
              }
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer toutes les notifications
          </Button>
        </div>
      )}
    </div>
  )
}
