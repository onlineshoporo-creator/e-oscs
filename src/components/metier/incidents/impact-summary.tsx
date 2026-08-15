import { Card, CardContent } from '@/components/ui/card'
import { Users, AlertTriangle } from 'lucide-react'

interface ImpactSummaryProps {
  victimes: number
  deces: number
}

export function ImpactSummary({ victimes, deces }: ImpactSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Victimes */}
      <Card className={victimes > 0 ? 'border-orange-200 bg-orange-50/50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${victimes > 0 ? 'bg-orange-100' : 'bg-slate-100'}`}>
              <Users className={`h-5 w-5 ${victimes > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Victimes</p>
              <p className={`text-2xl font-bold ${victimes > 0 ? 'text-orange-700' : 'text-slate-600'}`}>
                {victimes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Décès */}
      <Card className={deces > 0 ? 'border-red-200 bg-red-50/50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${deces > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
              <AlertTriangle className={`h-5 w-5 ${deces > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Décès</p>
              <p className={`text-2xl font-bold ${deces > 0 ? 'text-red-700' : 'text-slate-600'}`}>
                {deces}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
