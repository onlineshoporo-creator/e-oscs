"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

/** Questions fréquentes e-OSCS */
const faqItems: FAQItem[] = [
  {
    question: "Comment fonctionne le paiement ?",
    answer:
      "Le paiement s'effectue par Mobile Money (Orange Money, MTN, Wave) après validation de votre demande. Vous recevrez les coordonnées de paiement par SMS ou WhatsApp. Aucun prélèvement automatique n'est effectué — vous renouvelez manuellement chaque mois ou chaque année selon votre choix.",
  },
  {
    question: "Quel est le délai d'activation ?",
    answer:
      "Une fois votre paiement confirmé (généralement instantané avec Mobile Money), votre espace est activé sous 24 heures ouvrées maximum. Vous recevrez vos identifiants de connexion par SMS et email.",
  },
  {
    question: "Combien d'utilisateurs puis-je avoir ?",
    answer:
      "Cela dépend de votre formule : Essentiel (3 utilisateurs), Professionnel (5 utilisateurs), Institutionnel (utilisateurs illimités). Chaque utilisateur a son propre compte avec des droits personnalisables.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui, absolument. Vos données sont hébergées sur des serveurs sécurisés et sont 100% isolées entre les différentes Directions. Chaque Direction n'accède qu'à ses propres données. Nous appliquons les meilleures pratiques de sécurité : chiffrement SSL, sauvegardes quotidiennes, et contrôle d'accès strict.",
  },
  {
    question: "Puis-je résilier à tout moment ?",
    answer:
      "Oui, vous pouvez résilier votre abonnement à tout moment sans frais ni pénalité. En cas de résiliation en cours de mois, vous conservez l'accès jusqu'à la fin de la période déjà payée. Vos données restent disponibles pendant 30 jours après résiliation pour exportation.",
  },
  {
    question: "Ai-je besoin de compétences techniques ?",
    answer:
      "Non, e-OSCS a été conçu pour être utilisé par tous, sans formation technique préalable. L'interface est intuitive et nous fournissons un guide utilisateur ainsi que des vidéos tutorielles. Notre support est également disponible pour vous accompagner.",
  },
];

/**
 * FAQSection - Composant accordion pour les questions fréquentes
 */
export function FAQSection() {
  return (
    <section className="w-full">
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base md:text-lg font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FAQSection;
