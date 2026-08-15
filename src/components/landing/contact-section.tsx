"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    label: "WhatsApp",
    value: "+225 05 76 10 32 77",
    href: "https://wa.me/2250576103277",
    description: "Réponse rapide garantie",
    color: "#25D366",
    bgColor: "#E8FDF0",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    label: "Email",
    value: "omouitsi@gmail.com",
    href: "mailto:omouitsi@gmail.com",
    description: "Pour les demandes détaillées",
    color: "#F77F00",
    bgColor: "#FFF7ED",
  },
];

export function ContactSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="contact"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Une question ?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]">
              Contactez-nous
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Notre équipe est disponible pour répondre à toutes vos questions
            sur e-OSCS.
          </p>
        </div>

        {/* Cartes de contact */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          {contactInfo.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                backgroundColor: contact.bgColor,
                borderColor: `${contact.color}30`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md"
                style={{ color: contact.color, backgroundColor: `white` }}
              >
                {contact.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-[var(--hover-color)]" style={{ '--hover-color': contact.color } as React.CSSProperties}>
                {contact.label}
              </h3>
              <p className="font-semibold text-base mb-2" style={{ color: contact.color }}>
                {contact.value}
              </p>
              <p className="text-sm text-slate-600">{contact.description}</p>

              {/* CTA */}
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: contact.color }}>
                Contacter par {contact.label.toLowerCase()}
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Informations complémentaires */}
        <div className="bg-slate-50 rounded-2xl p-8 max-w-2xl mx-auto border border-slate-200">
          <div className="grid sm:grid-cols-2 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-slate-900">Localisation</p>
                <p className="text-sm text-slate-600">Côte d&apos;Ivoire</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-slate-900">Disponibilité</p>
                <p className="text-sm text-slate-600">Lun - Ven, 8h - 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
