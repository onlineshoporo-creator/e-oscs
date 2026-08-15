"use client";

import React from "react";
import { FileText, Presentation, Calendar, Download, Eye } from "lucide-react";

const reportTypes = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Rapport Mensuel",
    frequency: "Chaque mois",
    description:
      "Synthèse complète des activités réalisées durant le mois avec indicateurs et statistiques.",
    formats: ["Word (.docx)", "PDF"],
    color: "#F77F00",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Rapport Trimestriel",
    frequency: "T1, T2, T3, T4",
    description:
      "Bilan détaillé du trimestre avec analyse comparative, graphiques et tendances.",
    formats: ["Word (.docx)", "PowerPoint", "PDF"],
    color: "#009E60",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Bilan Annuel",
    description:
      "Rapport annuel complet couvrant toutes les activités de l'année avec analyses approfondies.",
    frequency: "Fin d'année",
    formats: ["Word (.docx)", "PowerPoint", "Excel", "PDF"],
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
];

export function ReportsSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="rapports"
      aria-label="Types de rapports"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Rapports
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Vos rapports,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
              sans repartir de zéro
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Générez des documents professionnels formatés selon les standards
            institutionnels en quelques clics.
          </p>
        </div>

        {/* Cartes des types de rapport */}
        <div className="grid md:grid-cols-3 gap-8">
          {reportTypes.map((report, index) => (
            <div
              key={report.title}
              className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{
                backgroundColor: report.bgColor,
                borderColor: report.borderColor,
              }}
            >
              {/* Header */}
              <div className="p-6 pb-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ color: report.color }}
                >
                  {report.icon}
                </div>
                
                {/* Badge fréquence */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{
                    backgroundColor: `${report.color}20`,
                    color: report.color,
                  }}
                >
                  {report.frequency}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Formats disponibles */}
              <div className="p-6 pt-4 mt-auto">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                  Formats disponibles
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {report.formats.map((format) => (
                    <span
                      key={format}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 shadow-sm"
                    >
                      {format.includes("Word") && <FileText className="w-3 h-3" />}
                      {format.includes("PowerPoint") && <Presentation className="w-3 h-3" />}
                      {format.includes("Excel") && <Eye className="w-3 h-3" />}
                      {format.includes("PDF") && <Download className="w-3 h-3" />}
                      {format}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: report.color }}
                >
                  <Download className="w-4 h-4" />
                  Générer ce rapport
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note importante */}
        <div className="mt-12 text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-600">
            <strong className="text-slate-900">Note :</strong> Les rapports sont générés à partir
            des données déjà saisies dans la plateforme.{" "}
            <span className="text-success font-medium">
              Aucune saisie supplémentaire n&apos;est requise.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReportsSection;
