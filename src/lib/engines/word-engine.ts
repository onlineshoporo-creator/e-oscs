/**
 * Moteur de génération de rapports Word (.docx) pour e-OSCS
 * 
 * Ce module permet de générer des documents Word professionnels avec :
 * - Page de garde institutionnelle
 * - Table des matières
 * - Résumé exécutif avec KPIs
 * - Tableaux d'activités
 * - Analyse budgétaire
 * - Indicateurs de performance
 * 
 * @module word-engine
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  ShadingType,
  TableOfContents,
} from 'docx'

import {
  RapportParams,
  EOSCS_COLORS,
  WORD_STYLES,
  GenerationResult,
} from './types'

import {
  formatMontantFCFA,
  formatDateFR,
  formatPourcentage,
  formatNombre,
  getLabelStatut,
  tronquerTexte,
  genererNomFichier,
} from './utils'

// ===========================================
// Constantes de style
// ===========================================

/** Bordures de tableau standard */
const STANDARD_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
  left: { style: BorderStyle.SINGLE, size: 1, colour: 'D1D5DB' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
}

/** Bordures en-tête tableau */
const HEADER_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 2, color: EOSCS_COLORS.ORANGE_CI },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: EOSCS_COLORS.ORANGE_CI },
  left: { style: BorderStyle.SINGLE, size: 1, color: EOSCS_COLORS.ORANGE_CI },
  right: { style: BorderStyle.SINGLE, size: 1, color: EOSCS_COLORS.ORANGE_CI },
}

/** Ombrage en-tête (orange clair) */
// @ts-ignore - Type assertion for docx library compatibility
const HEADER_SHADING = {
  fill: 'FFF7ED', // Orange très clair
  type: ShadingType.CLEAR,
}

/** Ombrage ligne alternée */
// @ts-ignore - Type assertion for docx library compatibility
const ALT_ROW_SHADING = {
  fill: 'F9FAFB',
  type: ShadingType.CLEAR,
}

// ===========================================
// Fonctions helpers de création d'éléments
// ===========================================

/**
 * Crée un paragraphe de titre principal
 */
function createTitle(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: WORD_STYLES.TITLE_SIZE,
        color: EOSCS_COLORS.ORANGE_CI,
        font: WORD_STYLES.FONT_MAIN,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  })
}

/**
 * Crée un paragraphe de heading H1
 */
function createH1(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: WORD_STYLES.H1_SIZE,
        color: EOSCS_COLORS.ORANGE_CI,
        font: WORD_STYLES.FONT_MAIN,
      }),
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  })
}

/**
 * Crée un paragraphe de heading H2
 */
function createH2(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: WORD_STYLES.H2_SIZE,
        color: EOSCS_COLORS.GRIS_FONCE,
        font: WORD_STYLES.FONT_MAIN,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  })
}

/**
 * Crée un paragraphe de heading H3
 */
function createH3(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: WORD_STYLES.H3_SIZE,
        color: EOSCS_COLORS.GRIS_MOYEN,
        font: WORD_STYLES.FONT_MAIN,
      }),
    ],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  })
}

/**
 * Crée un paragraphe de texte normal
 */
function createParagraph(
  text: string,
  options?: {
    bold?: boolean
    size?: number
    color?: string
    // @ts-ignore - AlignmentType from docx
    alignment?: any
    spacing?: { before?: number; after?: number }
  }
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: options?.bold || false,
        size: options?.size || WORD_STYLES.BODY_SIZE,
        color: options?.color || EOSCS_COLORS.GRIS_FONCE,
        font: WORD_STYLES.FONT_MAIN,
      }),
    ],
    alignment: options?.alignment || AlignmentType.LEFT,
    spacing: options?.spacing || { after: 120 },
  })
}

/**
 * Crée une ligne vide
 */
function createEmptyLine(count: number = 1): Paragraph[] {
  return Array(count).fill(null).map(
    () => new Paragraph({ children: [], spacing: { after: 100 } })
  )
}

/**
 * Crée une cellule d'en-tête de tableau
 */
function createHeaderCell(text: string, width?: number): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: WORD_STYLES.BODY_SIZE,
            color: EOSCS_COLORS.GRIS_FONCE,
            font: WORD_STYLES.FONT_MAIN,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: HEADER_SHADING,
    borders: HEADER_BORDERS,
  })
}

/**
 * Crée une cellule de données de tableau
 */
function createDataCell(
  text: string,
  options?: {
    width?: number
    // @ts-ignore - AlignmentType from docx
    alignment?: any
    bold?: boolean
    shading?: typeof ALT_ROW_SHADING
  }
): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: options?.bold || false,
            size: WORD_STYLES.BODY_SIZE,
            color: EOSCS_COLORS.GRIS_FONCE,
            font: WORD_STYLES.FONT_MAIN,
          }),
        ],
        alignment: options?.alignment || AlignmentType.LEFT,
      }),
    ],
    width: options?.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
    shading: options?.shading,
    borders: STANDARD_BORDERS,
  })
}

// ===========================================
// Sections du document
// ===========================================

/**
 * Génère la page de garde du rapport
 */
function generatePageDeGarde(params: RapportParams): Paragraph[] {
  const { organisation, periode, type } = params
  
  // Déterminer le titre selon le type
  const typeLabel = type === 'mensuel' ? 'MENSUEL' 
    : type === 'trimestriel' ? 'TRIMESTRIEL' 
    : 'ANNUEL'
  
  return [
    // Espacement avant le titre
    ...createEmptyLine(6),
    
    // Logo / Organisation
    new Paragraph({
      children: [
        new TextRun({
          text: 'MCNSLP',
          bold: true,
          size: 44,
          color: EOSCS_COLORS.VERT_CI,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'Ministère de la Cohésion Nationale, de la Solidarité Nationale et de la Lutte contre la Pauvreté',
          // @ts-ignore - italics property
          italics: true,
          size: 20,
          color: EOSCS_COLORS.GRIS_MOYEN,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    
    // Ligne décorative
    new Paragraph({
      children: [
        new TextRun({
          text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          color: EOSCS_COLORS.ORANGE_CI,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    
    // Titre principal
    new Paragraph({
      children: [
        new TextRun({
          text: `RAPPORT ${typeLabel}`,
          bold: true,
          size: 48,
          color: EOSCS_COLORS.ORANGE_CI,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: "D'ACTIVITÉS",
          bold: true,
          size: 40,
          color: EOSCS_COLORS.GRIS_FONCE,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    
    // Sous-titre e-OSCS
    new Paragraph({
      children: [
        new TextRun({
          text: 'e-OSCS • Espace Organisationnel de Suivi-Évaluation des Charges de Solidarité',
          bold: true,
          size: 24,
          color: EOSCS_COLORS.VERT_CI,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    
    // Informations organisation et période
    ...createEmptyLine(2),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Organisation : ${organisation.nom}`,
          size: WORD_STYLES.H2_SIZE,
          color: EOSCS_COLORS.GRIS_FONCE,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `${organisation.type_org} - ${organisation.region}`,
          size: 22,
          color: EOSCS_COLORS.GRIS_MOYEN,
          font: WORD_STYLES.FONT_MAIN,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Période : ${periode.label}`,
          size: WORD_STYLES.H2_SIZE,
          color: EOSCS_COLORS.ORANGE_CI,
          font: WORD_STYLES.FONT_MAIN,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    
    // Date de génération
    new Paragraph({
      children: [
        new TextRun({
          text: `Document généré le ${getDateActuelle()}`,
          size: 18,
          color: EOSCS_COLORS.GRIS_MOYEN,
          font: WORD_STYLES.FONT_MAIN,
          // @ts-ignore - italics property
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ]
}

/**
 * Retourne la date actuelle formatée
 */
function getDateActuelle(): string {
  return formatDateFR(new Date())
}

/**
 * Génère le résumé exécutif avec KPIs
 */
function generateResumeExecutif(params: RapportParams): (Paragraph | Table)[] {
  const { stats } = params
  
  const elements: (Paragraph | Table)[] = []
  
  // Titre de section
  elements.push(createH1('1. Résumé Exécutif'))
  
  // Introduction
  elements.push(
    createParagraph(
      `Ce rapport présente une synthèse des activités réalisées durant la période ${params.periode.label} ` +
      `par ${params.organisation.nom}. Les indicateurs ci-dessous donnent un aperçu des performances globales.`
    )
  )
  
  elements.push(...createEmptyLine(1))
  
  // Tableau des KPIs principaux
  elements.push(
    createH2('1.1 Indicateurs Clés de Performance (KPIs)')
  )
  
  // Tableau KPIs - 2x3 grid
  const kpiTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Ligne 1: Activités + Taux exécution
      new TableRow({
        children: [
          createKpiCell('Total Activités', formatNombre(stats.totalActivites), '📋'),
          createKpiCell('Taux d\'Exécution', formatPourcentage(stats.tauxExecution), '✅'),
        ],
      }),
      // Ligne 2: Budget
      new TableRow({
        children: [
          createKpiCell('Budget Alloué', formatMontantFCFA(stats.budgetTotal), '💰'),
          createKpiCell('Budget Utilisé', formatMontantFCFA(stats.budgetDepense), '💸'),
        ],
      }),
      // Ligne 3: Bénéficiaires
      new TableRow({
        children: [
          createKpiCell('Bénéficiaires Totaux', formatNombre(stats.beneficiairesTotal), '👥'),
          createKpiCell('Taux Budget Utilisé', formatPourcentage(stats.tauxBudgetUtilise), '📊'),
        ],
      }),
    ],
  })
  
  elements.push(kpiTable)
  elements.push(...createEmptyLine(1))
  
  // Détail par statut
  elements.push(createH2('1.2 Répartition par Statut'))
  
  const statutTable = new Table({
    width: { size: 80, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell('Statut', 50),
          createHeaderCell('Nombre', 25),
          createHeaderCell('%', 25),
        ],
      }),
      createStatutRow('Validées', stats.activitesValidees, stats.totalActivites),
      createStatutRow('En Cours', stats.activitesEnCours, stats.totalActivites),
      createStatutRow('Brouillons', stats.activitesBrouillon, stats.totalActivites),
      createStatutRow('TOTAL', stats.totalActivites, stats.totalActivites, true),
    ],
  })
  
  elements.push(statutTable)
  
  return elements
}

/**
 * Crée une cellule KPI stylisée
 */
function createKpiCell(label: string, value: string, icon: string): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: icon, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: value,
            bold: true,
            size: 28,
            color: EOSCS_COLORS.ORANGE_CI,
            font: WORD_STYLES.FONT_MAIN,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: label,
            size: 18,
            color: EOSCS_COLORS.GRIS_MOYEN,
            font: WORD_STYLES.FONT_MAIN,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 50 },
      }),
    ],
    shading: { fill: 'FFFBEB', type: ShadingType.CLEAR },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'FCD34D' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'FCD34D' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'FCD34D' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'FCD34D' },
    },
  })
}

/**
 * Crée une ligne de statistut pour le tableau
 */
function createStatutRow(
  label: string,
  valeur: number,
  total: number,
  isTotal: boolean = false
): TableRow {
  const pourcentage = total > 0 ? ((valeur / total) * 100).toFixed(1) : '0.0'
  
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: isTotal,
                size: WORD_STYLES.BODY_SIZE,
                color: isTotal ? EOSCS_COLORS.ORANGE_CI : EOSCS_COLORS.GRIS_FONCE,
                font: WORD_STYLES.FONT_MAIN,
              }),
            ],
          }),
        ],
        shading: isTotal ? HEADER_SHADING : undefined,
        borders: STANDARD_BORDERS,
      }),
      createDataCell(formatNombre(valeur), { 
        alignment: AlignmentType.CENTER,
        bold: isTotal,
      }),
      createDataCell(`${pourcentage}%`, { 
        alignment: AlignmentType.CENTER,
        bold: isTotal,
      }),
    ],
  })
}

/**
 * Génère la liste des activités sous forme de tableau
 */
function generateListeActivites(params: RapportParams): (Paragraph | Table)[] {
  const { activities } = params
  
  const elements: (Paragraph | Table)[] = []
  
  elements.push(createH1('2. Liste des Activités'))
  
  if (activities.length === 0) {
    elements.push(
      createParagraph('Aucune activité trouvée pour cette période.', {
        // @ts-ignore - italics property
          italics: true,
        color: EOSCS_COLORS.GRIS_MOYEN,
      })
    )
    return elements
  }
  
  elements.push(
    createParagraph(
      `Ce tableau présente l'ensemble des ${activities.length} activités recensées durant la période.`
    )
  )
  
  elements.push(...createEmptyLine(1))
  
  // Tableau des activités
  const tableRows: TableRow[] = [
    // En-tête
    new TableRow({
      children: [
        createHeaderCell('Titre', 30),
        createHeaderCell('Catégorie', 15),
        createHeaderCell('Statut', 12),
        createHeaderCell('Date début', 13),
        createHeaderCell('Budget alloué', 15),
        createHeaderCell('Bénéficiaires', 15),
      ],
    }),
  ]
  
  // Données
  activities.forEach((activity, index) => {
    tableRows.push(
      new TableRow({
        children: [
          createDataCell(tronquerTexte(activity.titre, 40), {
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(tronquerTexte(activity.categorie, 20), {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(getLabelStatut(activity.statut), {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(formatDateCourte(activity.date_debut), {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(formatMontantFCFA(activity.budget_alloue), {
            alignment: AlignmentType.RIGHT,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(formatNombre(activity.beneficiaires_count), {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
        ],
      })
    )
  })
  
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    })
  )
  
  return elements
}

/**
 * Formate une date courte pour les tableaux
 */
function formatDateCourte(dateStr: string | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

/**
 * Génère les fiches détaillées par activité
 */
function generateDetailsActivites(params: RapportParams): (Paragraph | Table)[] {
  const { activities } = params
  
  const elements: (Paragraph | Table)[] = []
  
  // Ne prendre que les activités validées ou significatives
  const activitesDetaillees = activities.filter(a => 
    ['VALIDE', 'CONSOLIDE', 'SOUMIS', 'EN_VERIFICATION'].includes(a.statut?.toUpperCase())
  )
  
  elements.push(createH1('3. Détails des Activités'))
  
  if (activitesDetaillees.length === 0) {
    elements.push(
      createParagraph('Aucune activité détaillée disponible.', {
        // @ts-ignore - italics property
          italics: true,
        color: EOSCS_COLORS.GRIS_MOYEN,
      })
    )
    return elements
  }
  
  elements.push(
    createParagraph(
      `Fiches détaillées des ${activitesDetaillees.length} principales activités de la période.`
    )
  )
  
  // Générer une fiche par activité
  activitesDetaillees.forEach((activity, index) => {
    elements.push(...createEmptyLine(1))
    elements.push(createH3(`3.${index + 1} ${activity.titre}`))
    
    // Tableau de détails
    const detailTable = new Table({
      width: { size: 90, type: WidthType.PERCENTAGE },
      rows: [
        createDetailRow('Description', activity.description || 'Aucune description fournie'),
        createDetailRow('Catégorie', activity.categorie),
        createDetailRow('Type', activity.type_activite),
        createDetailRow('Statut', getLabelStatut(activity.statut)),
        createDetailRow('Date de début', formatDateFR(activity.date_debut)),
        createDetailRow('Date de fin', activity.date_fin ? formatDateFR(activity.date_fin) : 'En cours'),
        createDetailRow('Lieu', activity.lieu || 'Non spécifié'),
        createDetailRow('Budget alloué', formatMontantFCFA(activity.budget_alloue)),
        createDetailRow('Budget dépensé', formatMontantFCFA(activity.budget_depense)),
        createDetailRow(
          'Taux d\'utilisation budget',
          activity.budget_alloue > 0 
            ? formatPourcentage((activity.budget_depense / activity.budget_alloue) * 100)
            : 'N/A'
        ),
        createDetailRow('Bénéficiaires totaux', formatNombre(activity.beneficiaires_count)),
        ...(activity.beneficiaires_hommes ? [createDetailRow('  Dont hommes', formatNombre(activity.beneficiaires_hommes))] : []),
        ...(activity.beneficiaires_femmes ? [createDetailRow('  Dont femmes', formatNombre(activity.beneficiaires_femmes))] : []),
        ...(activity.beneficiaires_jeunes ? [createDetailRow('  Dont jeunes', formatNombre(activity.beneficiaires_jeunes))] : []),
      ],
    })
    
    elements.push(detailTable)
  })
  
  return elements
}

/**
 * Crée une ligne de détail pour la fiche activité
 */
function createDetailRow(label: string, valeur: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: WORD_STYLES.BODY_SIZE,
                color: EOSCS_COLORS.GRIS_MOYEN,
                font: WORD_STYLES.FONT_MAIN,
              }),
            ],
          }),
        ],
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
        borders: STANDARD_BORDERS,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: valeur,
                size: WORD_STYLES.BODY_SIZE,
                color: EOSCS_COLORS.GRIS_FONCE,
                font: WORD_STYLES.FONT_MAIN,
              }),
            ],
          }),
        ],
        width: { size: 65, type: WidthType.PERCENTAGE },
        borders: STANDARD_BORDERS,
      }),
    ],
  })
}

/**
 * Génère l'analyse budgétaire
 */
function generateAnalyseBudgetaire(params: RapportParams): (Paragraph | Table)[] {
  const { stats } = params
  
  const elements: (Paragraph | Table)[] = []
  
  elements.push(createH1('4. Analyse Budgétaire'))
  
  elements.push(
    createParagraph(
      "Cette section présente l'analyse détaillée de l'exécution budgétaire pour la période considérée."
    )
  )
  
  elements.push(...createEmptyLine(1))
  elements.push(createH2('4.1 Synthèse Budgétaire'))
  
  // Tableau de synthèse
  const syntheseTable = new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createHeaderCell('Indicateur', 60),
          createHeaderCell('Montant', 40),
        ],
      }),
      createBudgetRow('Budget Total Alloué', formatMontantFCFA(stats.budgetTotal)),
      createBudgetRow('Budget Dépensé', formatMontantFCFA(stats.budgetDepense)),
      createBudgetRow('Budget Restant', formatMontantFCFA(stats.budgetRestant)),
      createBudgetRow("Taux d'Utilisation", formatPourcentage(stats.tauxBudgetUtilise), true),
    ],
  })
  
  elements.push(syntheseTable)
  elements.push(...createEmptyLine(1))
  
  // Barre de progression textuelle
  elements.push(createH2('4.2 Visualisation de l\'Exécution Budgétaire'))
  
  const progressBarLength = 50
  const filledLength = Math.round((stats.tauxBudgetUtilise / 100) * progressBarLength)
  const emptyLength = progressBarLength - filledLength
  
  const barColor = stats.tauxBudgetUtilise >= 90 ? EOSCS_COLORS.VERT_CI 
    : stats.tauxBudgetUtilise >= 50 ? EOSCS_COLORS.ORANGE_CI 
    : EOSCS_COLORS.ROUGE
  
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '█'.repeat(filledLength) + '░'.repeat(emptyLength),
          size: 20,
          color: barColor,
          font: 'Courier New',
        }),
      ],
      spacing: { after: 100 },
    })
  )
  
  elements.push(
    createParagraph(`${formatPourcentage(stats.tauxBudgetUtilise)} du budget utilisé`, {
      alignment: AlignmentType.CENTER,
      color: EOSCS_COLORS.GRIS_MOYEN,
    })
  )
  
  // Analyse par catégorie si disponible
  if (Object.keys(stats.parCategorie).length > 0) {
    elements.push(...createEmptyLine(1))
    elements.push(createH2('4.3 Répartition par Catégorie'))
    
    const categorieRows: TableRow[] = [
      new TableRow({
        children: [
          createHeaderCell('Catégorie', 60),
          createHeaderCell('Nb Activités', 40),
        ],
      }),
    ]
    
    Object.entries(stats.parCategorie).forEach(([cat, count], index) => {
      categorieRows.push(
        new TableRow({
          children: [
            createDataCell(cat, {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatNombre(count), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
          ],
        })
      )
    })
    
    elements.push(new Table({
      width: { size: 60, type: WidthType.PERCENTAGE },
      rows: categorieRows,
    }))
  }
  
  return elements
}

/**
 * Crée une ligne de budget
 */
function createBudgetRow(label: string, valeur: string, highlight: boolean = false): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: highlight,
                size: WORD_STYLES.BODY_SIZE,
                color: highlight ? EOSCS_COLORS.ORANGE_CI : EOSCS_COLORS.GRIS_FONCE,
                font: WORD_STYLES.FONT_MAIN,
              }),
            ],
          }),
        ],
        shading: highlight ? HEADER_SHADING : undefined,
        borders: STANDARD_BORDERS,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: valeur,
                bold: highlight,
                size: WORD_STYLES.BODY_SIZE,
                color: highlight ? EOSCS_COLORS.ORANGE_CI : EOSCS_COLORS.GRIS_FONCE,
                font: WORD_STYLES.FONT_MAIN,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
        shading: highlight ? HEADER_SHADING : undefined,
        borders: STANDARD_BORDERS,
      }),
    ],
  })
}

/**
 * Génère la section des indicateurs de performance
 */
function generateIndicateurs(params: RapportParams): (Paragraph | Table)[] {
  const { indicators } = params
  
  const elements: (Paragraph | Table)[] = []
  
  elements.push(createH1('5. Indicateurs de Performance'))
  
  if (!indicators || indicators.length === 0) {
    elements.push(
      createParagraph('Aucun indicateur de performance configuré pour cette période.', {
        // @ts-ignore - italics property
          italics: true,
        color: EOSCS_COLORS.GRIS_MOYEN,
      })
    )
    return elements
  }
  
  elements.push(
    createParagraph(
      `Le tableau suivant présente les ${indicators.length} indicateurs de performance suivis.`
    )
  )
  
  elements.push(...createEmptyLine(1))
  
  const indicatorRows: TableRow[] = [
    new TableRow({
      children: [
        createHeaderCell('Code', 15),
        createHeaderCell('Indicateur', 35),
        createHeaderCell('Type', 15),
        createHeaderCell('Valeur', 15),
        createHeaderCell('Objectif', 20),
      ],
    }),
  ]
  
  indicators.forEach((ind, index) => {
    indicatorRows.push(
      new TableRow({
        children: [
          createDataCell(ind.code, {
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(ind.nom, {
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(ind.kind === 'QUANTITATIF' ? 'Quant.' : 'Qual.', {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(ind.valeur !== undefined ? `${ind.valeur} ${ind.unite || ''}` : '-', {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
          createDataCell(ind.objectif !== undefined ? `${ind.objectif} ${ind.unite || ''}` : '-', {
            alignment: AlignmentType.CENTER,
            shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
          }),
        ],
      })
    )
  })
  
  elements.push(new Table({
    width: { size: 90, type: WidthType.PERCENTAGE },
    rows: indicatorRows,
  }))
  
  return elements
}

/**
 * Génère la section spécifique au rapport trimestriel
 */
function generateSectionTrimestrielle(params: RapportParams): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  elements.push(createH1('6. Synthèse Trimestrielle'))
  
  // Information sur le trimestre
  const trimestreLabel = params.periode.trimestre 
    ? `T${params.periode.trimestre}` 
    : ''
  
  elements.push(
    createParagraph(
      `Cette section présente une vue consolidée du trimestre ${trimestreLabel} ${params.periode.annee}.`
    )
  )
  
  // Évolution mensuelle si disponible
  if (params.stats.evolutionMensuelle && params.stats.evolutionMensuelle.length > 0) {
    elements.push(...createEmptyLine(1))
    elements.push(createH2('6.1 Évolution Mensuelle'))
    
    const evoRows: TableRow[] = [
      new TableRow({
        children: [
          createHeaderCell('Mois', 25),
          createHeaderCell('Activités', 15),
          createHeaderCell('Budget Alloué', 25),
          createHeaderCell('Budget Dépensé', 25),
          createHeaderCell('Bénéficiaires', 10),
        ],
      }),
    ]
    
    params.stats.evolutionMensuelle.forEach((mois, index) => {
      evoRows.push(
        new TableRow({
          children: [
            createDataCell(mois.mois, {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatNombre(mois.nbActivites), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatMontantFCFA(mois.budgetAlloue), {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatMontantFCFA(mois.budgetDepense), {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatNombre(mois.beneficiaires), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
          ],
        })
      )
    })
    
    elements.push(new Table({
      width: { size: 95, type: WidthType.PERCENTAGE },
      rows: evoRows,
    }))
  }
  
  // Recommandations
  elements.push(...createEmptyLine(1))
  elements.push(createH2('6.2 Recommandations'))
  
  const recommandations = genererRecommandations(params)
  recommandations.forEach(rec => {
    elements.push(
      createParagraph(`• ${rec}`, { spacing: { after: 80 } })
    )
  })
  
  return elements
}

/**
 * Génère la section spécifique au rapport annuel
 */
function generateSectionAnnuelle(params: RapportParams): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  elements.push(createH1('6. Bilan Annuel'))
  
  elements.push(
    createParagraph(
      `Ce bilan annuel présente une rétrospective complète de l'année ${params.periode.annee} ` +
      `pour ${params.organisation.nom}.`
    )
  )
  
  // Résumé des accomplissements
  elements.push(...createEmptyLine(1))
  elements.push(createH2('6.1 Accomplissements Majeurs'))
  
  const accomplishments = [
    `Réalisation de ${params.stats.totalActivites} activités sur l'année`,
    `Validation de ${params.stats.activitesValidees} activités (${formatPourcentage(params.stats.tauxExecution)} de taux d'exécution)`,
    `Mobilisation d'un budget total de ${formatMontantFCFA(params.stats.budgetTotal)}`,
    `Accompagnement de ${formatNombre(params.stats.beneficiairesTotal)} bénéficiaires`,
    `Taux d'utilisation budgétaire de ${formatPourcentage(params.stats.tauxBudgetUtilise)}`,
  ]
  
  accomplishments.forEach(acc => {
    elements.push(createParagraph(`✓ ${acc}`, { spacing: { after: 80 } }))
  })
  
  // Évolution mensuelle
  if (params.stats.evolutionMensuelle && params.stats.evolutionMensuelle.length > 0) {
    elements.push(...createEmptyLine(1))
    elements.push(createH2('6.2 Évolution Mensuelle Annuelle'))
    
    const evoRows: TableRow[] = [
      new TableRow({
        children: [
          createHeaderCell('Mois', 20),
          createHeaderCell('Activités', 12),
          createHeaderCell('Budget Alloué', 22),
          createHeaderCell('Budget Dépensé', 22),
          createHeaderCell('Bénéf.', 12),
          createHeaderCell('Exécution %', 12),
        ],
      }),
    ]
    
    params.stats.evolutionMensuelle.forEach((mois, index) => {
      const tauxExecMois = mois.nbActivites > 0 ? 100 : 0 // Simplifié
      
      evoRows.push(
        new TableRow({
          children: [
            createDataCell(mois.mois.substring(0, 3), { // Abrégé
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatNombre(mois.nbActivites), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatMontantFCFA(mois.budgetAlloue), {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatMontantFCFA(mois.budgetDepense), {
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatNombre(mois.beneficiaires), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
            createDataCell(formatPourcentage(tauxExecMois, 0), {
              alignment: AlignmentType.CENTER,
              shading: index % 2 === 1 ? ALT_ROW_SHADING : undefined,
            }),
          ],
        })
      )
    })
    
    elements.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: evoRows,
    }))
  }
  
  // Perspectives
  elements.push(...createEmptyLine(1))
  elements.push(createH2('6.3 Perspectives et Objectifs'))
  
  const perspectives = [
    'Maintenir le niveau d\'exécution des activités',
    'Optimiser l\'utilisation des budgets alloués',
    'Renforcer le suivi des indicateurs de performance',
    'Étendre le champ d\'action aux zones non couvertes',
    'Améliorer la qualité des données collectées',
  ]
  
  perspectives.forEach(pers => {
    elements.push(createParagraph(`→ ${pers}`, { spacing: { after: 80 } }))
  })
  
  return elements
}

/**
 * Génère des recommandations basées sur les statistiques
 */
function genererRecommandations(params: RapportParams): string[] {
  const recs: string[] = []
  const { stats } = params
  
  // Recommandations sur le taux d'exécution
  if (stats.tauxExecution < 50) {
    recs.push('Le taux d\'exécution est faible. Il est recommandé d\'accélérer la validation et la réalisation des activités planifiées.')
  } else if (stats.tauxExecution < 75) {
    recs.push('Le taux d\'exécution est moyen. Un effort supplémentaire permettrait d\'atteindre les objectifs fixés.')
  } else {
    recs.push('Bon taux d\'exécution. Poursuivre les efforts actuels pour maintenir cette performance.')
  }
  
  // Recommandations sur le budget
  if (stats.tauxBudgetUtilise > 95) {
    recsAttention('Attention : le budget est presque entièrement consommé. Prévoir des demandes de complément si nécessaire.')
  } else if (stats.tauxBudgetUtilise < 50) {
    recs.push('Sous-utilisation du budget. Vérifier les raisons et accélérer les dépenses programmées.')
  }
  
  // Recommandations sur les bénéficiaires
  if (stats.beneficiairesTotal > 0 && stats.beneficiairesFemmes > 0) {
    const ratioFemmes = (stats.beneficiairesFemmes / stats.beneficiairesTotal) * 100
    if (ratioFemmes < 30) {
      recs.push('Renforcer la participation féminine dans les activités.')
    }
  }
  
  // Recommandation générique
  if (recs.length < 3) {
    recs.push('Assurer un suivi régulier des indicateurs de performance.')
  }
  
  return recs
}

/**
 * Ajoute une recommandation d'attention (helper)
 */
function recsAttention(text: string): void {
  // Utilisé dans genererRecommandations
}

// ===========================================
// Fonction principale de génération
// ===========================================

/**
 * Génère un rapport Word mensuel complet
 * 
 * @param params - Paramètres du rapport
 * @returns Buffer du document Word généré
 * 
 * @example
 * ```typescript
 * const buffer = await generateRapportMensuelWord({
 *   organisation: { nom: 'DR Abidjan', type_org: 'DR', region: 'Abidjan' },
 *   periode: { debut: '2026-01-01', fin: '2026-01-31', label: 'Janvier 2026', annee: 2026, mois: 1 },
 *   activities: [...],
 *   stats: {...},
 *   type: 'mensuel'
 * })
 * ```
 */
export async function generateRapportMensuelWord(params: RapportParams): Promise<Buffer> {
  const doc = new Document({
    creator: 'e-OSCS - MCNSLP',
    description: `Rapport mensuel d'activités - ${params.organisation.nom} - ${params.periode.label}`,
    title: `Rapport Mensuel - ${params.organisation.nom} - ${params.periode.label}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: WORD_STYLES.MARGINS.top,
              bottom: WORD_STYLES.MARGINS.bottom,
              left: WORD_STYLES.MARGINS.left,
              right: WORD_STYLES.MARGINS.right,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `MCNSLP - ${params.organisation.nom}`,
                    size: 18,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: `  |  ${params.periode.label}`,
                    size: 18,
                    color: EOSCS_COLORS.ORANGE_CI,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'e-OSCS v1.0 | Document généré automatiquement | Page ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: ' sur ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Page de garde
          ...generatePageDeGarde(params),
          
          // Saut de page après la garde
          new Paragraph({ children: [], pageBreakBefore: true }),
          
          // Table des matières
          createH1('Table des Matières'),
          new TableOfContents('Sommaire', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),
          
          // Saut de page avant contenu
          new Paragraph({ children: [], pageBreakBefore: true }),
          
          // Contenu principal
          ...generateResumeExecutif(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateListeActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateDetailsActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateAnalyseBudgetaire(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateIndicateurs(params),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}

/**
 * Génère un rapport Word trimestriel complet
 * 
 * @param params - Paramètres du rapport
 * @returns Buffer du document Word généré
 */
export async function generateRapportTrimestrielWord(params: RapportParams): Promise<Buffer> {
  const doc = new Document({
    creator: 'e-OSCS - MCNSLP',
    description: `Rapport trimestriel d'activités - ${params.organisation.nom} - ${params.periode.label}`,
    title: `Rapport Trimestriel - ${params.organisation.nom} - ${params.periode.label}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: WORD_STYLES.MARGINS.top,
              bottom: WORD_STYLES.MARGINS.bottom,
              left: WORD_STYLES.MARGINS.left,
              right: WORD_STYLES.MARGINS.right,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `MCNSLP - ${params.organisation.nom}`,
                    size: 18,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: `  |  ${params.periode.label}`,
                    size: 18,
                    color: EOSCS_COLORS.ORANGE_CI,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'e-OSCS v1.0 | Document généré automatiquement | Page ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: ' sur ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Page de garde
          ...generatePageDeGarde(params),
          
          // Saut de page
          new Paragraph({ children: [], pageBreakBefore: true }),
          
          // Table des matières
          createH1('Table des Matières'),
          new TableOfContents('Sommaire', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),
          
          // Contenu principal
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateResumeExecutif(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateListeActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateDetailsActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateAnalyseBudgetaire(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateIndicateurs(params),
          
          // Section spécifique trimestrielle
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateSectionTrimestrielle(params),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}

/**
 * Génère un rapport Word annuel complet
 * 
 * @param params - Paramètres du rapport
 * @returns Buffer du document Word généré
 */
export async function generateRapportAnnuelWord(params: RapportParams): Promise<Buffer> {
  const doc = new Document({
    creator: 'e-OSCS - MCNSLP',
    description: `Rapport annuel d'activités - ${params.organisation.nom} - ${params.periode.label}`,
    title: `Rapport Annuel - ${params.organisation.nom} - ${params.periode.label}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: WORD_STYLES.MARGINS.top,
              bottom: WORD_STYLES.MARGINS.bottom,
              left: WORD_STYLES.MARGINS.left,
              right: WORD_STYLES.MARGINS.right,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `MCNSLP - ${params.organisation.nom}`,
                    size: 18,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: `  |  ${params.periode.label}`,
                    size: 18,
                    color: EOSCS_COLORS.ORANGE_CI,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'e-OSCS v1.0 | Document généré automatiquement | Page ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    text: ' sur ',
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: EOSCS_COLORS.GRIS_MOYEN,
                    font: WORD_STYLES.FONT_MAIN,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Page de garde
          ...generatePageDeGarde(params),
          
          // Saut de page
          new Paragraph({ children: [], pageBreakBefore: true }),
          
          // Table des matières
          createH1('Table des Matières'),
          new TableOfContents('Sommaire', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),
          
          // Contenu principal
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateResumeExecutif(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateListeActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateDetailsActivites(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateAnalyseBudgetaire(params),
          
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateIndicateurs(params),
          
          // Section spécifique annuelle
          new Paragraph({ children: [], pageBreakBefore: true }),
          ...generateSectionAnnuelle(params),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}

/**
 * Fonction générique de génération de rapport Word
 * Dispatch vers la bonne fonction selon le type
 * 
 * @param params - Paramètres du rapport
 * @returns Resultat de génération avec buffer et métadonnées
 */
export async function generateWordReport(params: RapportParams): Promise<GenerationResult> {
  try {
    let buffer: Buffer
    
    switch (params.type) {
      case 'mensuel':
        buffer = await generateRapportMensuelWord(params)
        break
      case 'trimestriel':
        buffer = await generateRapportTrimestrielWord(params)
        break
      case 'annuel':
        buffer = await generateRapportAnnuelWord(params)
        break
      default:
        throw new Error(`Type de rapport non supporté: ${params.type}`)
    }
    
    const filename = genererNomFichier(
      params.type,
      'docx',
      params.organisation.nom,
      params.periode.label
    )
    
    return {
      success: true,
      buffer,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: buffer.length,
    }
  } catch (error) {
    console.error('Erreur lors de la génération Word:', error)
    return {
      success: false,
      filename: '',
      mimeType: '',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}
