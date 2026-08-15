import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// ============================================
// API ROUTE - Contact / Demande d'accès e-OSCS
// ============================================

// Types
interface ContactDemande {
  id: string;
  nom: string;
  email: string;
  direction: string;
  message?: string;
  createdAt: string;
  ip?: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  errors?: string[];
  demande?: ContactDemande;
}

// Configuration
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'demandes.json');
const MAX_REQUESTS_PER_IP = 5; // Max requests per IP per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// Stockage simple en mémoire pour rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>{}]/g, '') // Remove potential HTML/JS injection characters
    .slice(0, 500); // Limit length
}

function generateId(): string {
  return `demande_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - record.count };
}

// File operations
async function readDemandes(): Promise<ContactDemande[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data) as ContactDemande[];
  } catch {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

async function writeDemandes(demandes: ContactDemande[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(demandes, null, 2), 'utf-8');
}

// POST handler - Créer une nouvelle demande
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Trop de demandes. Veuillez réessayer plus tard.',
          errors: ['Rate limit exceeded']
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime)
          }
        }
      );
    }

    // Parse body
    let body: { nom?: string; email?: string; direction?: string; message?: string };
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Format de requête invalide',
          errors: ['Le corps de la requête doit être au format JSON']
        },
        { status: 400 }
      );
    }

    const { nom, email, direction, message } = body;

    // Validation des champs
    const errors: string[] = [];

    // Nom validation
    if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    } else if (nom.trim().length > 100) {
      errors.push('Le nom ne peut pas dépasser 100 caractères');
    }

    // Email validation
    if (!email || typeof email !== 'string') {
      errors.push("L'email est obligatoire");
    } else if (!validateEmail(email.trim())) {
      errors.push("L'format de l'email est invalide");
    }

    // Direction validation
    if (!direction || typeof direction !== 'string' || direction.trim().length === 0) {
      errors.push('La direction est obligatoire');
    } else if (!['direction-regionale', 'direction-departementale', 'direction-centrale', 'autre'].includes(direction)) {
      errors.push('La direction sélectionnée est invalide');
    }

    // Message validation (optionnel mais avec limite)
    if (message && typeof message === 'string' && message.length > 2000) {
      errors.push('Le message ne peut pas dépasser 2000 caractères');
    }

    // Return errors if any
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Erreur de validation',
          errors
        },
        { status: 400 }
      );
    }

    // Create demande object
    const nouvelleDemande: ContactDemande = {
      id: generateId(),
      nom: sanitizeString(nom),
      email: sanitizeString(email).toLowerCase(),
      direction: direction as ContactDemande['direction'],
      message: message ? sanitizeString(message) : undefined,
      createdAt: new Date().toISOString(),
      ip: ip === 'unknown' ? undefined : ip
    };

    // Save to file
    try {
      const demandes = await readDemandes();
      demandes.unshift(nouvelleDemande); // Add at beginning (newest first)
      await writeDemandes(demandes);
    } catch (fileError) {
      console.error('Erreur sauvegarde demande:', fileError);
      return NextResponse.json(
        {
          success: false,
          message: "Erreur lors de l'enregistrement de la demande",
          errors: ["Impossible d'enregistrer la demande pour le moment"]
        },
        { status: 500 }
      );
    }

    // Log la demande pour suivi
    console.log(`\n📧 Nouvelle demande d'accès e-OSCS:
   ID: ${nouvelleDemande.id}
   Nom: ${nouvelleDemande.nom}
   Email: ${nouvelleDemande.email}
   Direction: ${nouvelleDemande.direction}
   Message: ${nouvelleDemande.message || 'N/A'}
   Date: ${nouvelleDemande.createdAt}
   IP: ${nouvelleDemande.ip || 'N/A'}
`);

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Demande reçue avec succès',
        demande: {
          ...nouvelleDemande,
          ip: undefined // Ne pas retourner l'IP au client
        }
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining)
        }
      }
    );

  } catch (error) {
    console.error('Erreur inattendue API contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur serveur',
        errors: ['Une erreur inattendue est survenue']
      },
      { status: 500 }
    );
  }
}

// GET handler - Récupérer les demandes (admin/debug)
export async function GET(): Promise<NextResponse> {
  try {
    const demandes = await readDemandes();
    
    return NextResponse.json({
      success: true,
      count: demandes.length,
      data: demandes.map(({ ip, ...rest }) => rest) // Masquer les IPs
    });
  } catch (error) {
    console.error('Erreur lecture demandes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la lecture des demandes'
      },
      { status: 500 }
    );
  }
}
