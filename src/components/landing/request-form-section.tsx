"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";

export function RequestFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { success: showSuccess, error: showError } = useNotification();
  const [formData, setFormData] = useState({
    nom: "",
    fonction: "",
    typeStructure: "",
    nomDirection: "",
    region: "",
    departement: "",
    nbCollaborateurs: "",
    telephone: "",
    whatsapp: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.nom.trim() || !formData.email.trim() || !formData.telephone.trim()) {
      showError("Formulaire incomplet", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Afficher la notification de succès
      showSuccess(
        "Demande envoyée avec succès !",
        "Notre équipe vous contactera sous 24h pour finaliser votre inscription.",
        { duration: 6000 }
      );

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      showError(
        "Erreur lors de l'envoi",
        "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
        {
          action: {
            label: "Réessayer",
            onClick: () => handleSubmit(e),
          },
        }
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <section className="py-20 lg:py-28 bg-slate-50" id="demande">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-green-200">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Demande envoyée avec succès !
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Merci pour votre intérêt pour e-OSCS. Notre équipe vous contactera
              dans les plus brefs délais par téléphone ou WhatsApp.
            </p>
            <Button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  nom: "",
                  fonction: "",
                  typeStructure: "",
                  nomDirection: "",
                  region: "",
                  departement: "",
                  nbCollaborateurs: "",
                  telephone: "",
                  whatsapp: "",
                  email: "",
                  message: "",
                });
              }}
              variant="outline"
            >
              Envoyer une autre demande
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="demande"
      aria-label="Formulaire de demande"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Demande d&apos;abonnement
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Demander un abonnement{" "}
            <span className="text-primary">e-OSCS</span>
          </h2>
          <p className="text-lg text-slate-600">
            Remplissez ce formulaire et notre équipe vous recontactera sous 24h
            pour finaliser votre inscription.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10">
            {/* Informations personnelles */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Vos informations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    placeholder="Ex: Jean Kouadio"
                    required
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction">Fonction *</Label>
                  <Input
                    id="fonction"
                    placeholder="Ex: Directeur Régional"
                    required
                    value={formData.fonction}
                    onChange={(e) => handleChange("fonction", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="Ex: +225 07 00 00 00 00"
                    required
                    value={formData.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="Ex: +225 05 76 10 32 77"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ex: direction@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Informations structure */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Votre structure
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typeStructure">Type de structure *</Label>
                  <Select
                    value={formData.typeStructure}
                    onValueChange={(value) => handleChange("typeStructure", value)}
                    required
                  >
                    <SelectTrigger id="typeStructure">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr">Direction Régionale (DR)</SelectItem>
                      <SelectItem value="dd">Direction Départementale (DD)</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomDirection">Nom de la Direction *</Label>
                  <Input
                    id="nomDirection"
                    placeholder="Ex: DR des Lagunes"
                    required
                    value={formData.nomDirection}
                    onChange={(e) => handleChange("nomDirection", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleChange("region", value)}
                    required
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagunes">Lagunes</SelectItem>
                      <SelectItem value="district-abidjan">District d&apos;Abidjan</SelectItem>
                      <SelectItem value="comoe">Comoé</SelectItem>
                      <SelectItem value="denkiala">Dénkéla</SelectItem>
                      <SelectItem value="goh-djiboua">Gôh-Djiboua</SelectItem>
                      <SelectItem value="lac-lac">Lacs</SelectItem>
                      <SelectItem value="montagnes">Montagnes</SelectItem>
                      <SelectItem value="sassandra-marahoue">Sassandra-Marahoué</SelectItem>
                      <SelectItem value="vallee-bandama">Vallée du Bandama</SelectItem>
                      <SelectItem value="worodougou">Worodougou</SelectItem>
                      <SelectItem value="zanzan">Zanzan</SelectItem>
                      <SelectItem value="autr">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departement">Département</Label>
                  <Input
                    id="departement"
                    placeholder="Ex: Abidjan"
                    value={formData.departement}
                    onChange={(e) => handleChange("departement", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbCollaborateurs">
                    Nombre de collaborateurs *
                  </Label>
                  <Select
                    value={formData.nbCollaborateurs}
                    onValueChange={(value) =>
                      handleChange("nbCollaborateurs", value)
                    }
                    required
                  >
                    <SelectTrigger id="nbCollaborateurs">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1 à 5 personnes</SelectItem>
                      <SelectItem value="6-10">6 à 10 personnes</SelectItem>
                      <SelectItem value="11-20">11 à 20 personnes</SelectItem>
                      <SelectItem value="21-50">21 à 50 personnes</SelectItem>
                      <SelectItem value="50+">Plus de 50 personnes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Message (optionnel)
              </h3>
              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez vos besoins spécifiques, questions..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />
              </div>
            </div>

            {/* Bouton soumission */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-12 py-6 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Envoyer ma demande
                </>
              )}
            </Button>

            {/* Note confidentialité */}
            <p className="mt-4 text-xs text-slate-500 text-center md:text-left">
              * Champs obligatoires — Vos données sont traitées confidentiellement
              et ne seront jamais partagées avec des tiers.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RequestFormSection;
