export default function Accueil() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/30">
      <div className="text-center p-8">
        {/* Logo e-OSCS */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-3xl font-bold text-white">e</span>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">e-OSCS</h1>
        <p className="text-lg text-slate-600 mb-1">
          Plateforme nationale de suivi des activités
        </p>
        <p className="text-sm text-slate-500 mb-8">
          de solidarité et de cohésion sociale
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          En construction — Bientôt disponible
        </div>
        
        <p className="mt-8 text-xs text-slate-400">
          MCNSLP — Ministère de la Cohésion Nationale, de la Solidarité<br />
          et de la Lutte contre la Pauvreté (Côte d&apos;Ivoire)
        </p>
      </div>
    </main>
  )
}
