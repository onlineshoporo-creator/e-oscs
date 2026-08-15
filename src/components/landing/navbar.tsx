"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Fonctionnalités", href: "#fonctionnalites" },
  { name: "Reporting", href: "#reporting" },
  { name: "Comment ça marche", href: "#comment-ca-marche" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="e-OSCS - Accueil"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">e</span>
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled ? "text-slate-900" : "text-white"
              }`}
            >
              e-OSCS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6" role="list">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isScrolled ? "text-slate-600" : "text-white/90"
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 ml-4">
              <Link href="/connexion">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isScrolled
                      ? "text-slate-700 hover:text-primary"
                      : "text-white hover:bg-white/10"
                  }
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="#abonnement">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                >
                  Demander un abonnement
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
            <nav aria-label="Navigation mobile">
              <ul className="space-y-1" role="list">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Se connecter
                  </Button>
                </Link>
                <Link
                  href="#abonnement"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Demander un abonnement
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
