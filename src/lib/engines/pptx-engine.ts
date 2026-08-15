/**
 * Moteur de génération de présentations PowerPoint (.pptx) pour e-OSCS
 * 
 * Ce module permet de générer des présentations professionnelles avec :
 * - Slide titre avec dégradé institutionnel
 * - Agenda/Sommaire
 * - KPIs en cartes visuelles
 * - Taux d'exécution avec barre de progression
 * - Tableaux d'activités
 * - Graphiques budgétaires
 * - Répartition bénéficiaires
 * - Recommandations et perspectives
 * 
 * @module pptx-engine
 */

// @ts-ignore - pptxgenjs types may not be perfect
import PptxGenJS from 'pptxgenjs'

import {
  PresentationParams,
  EOSCS_COLORS,
  PPTX_STYLES,
  GenerationResult,
} from './types'

import {
  formatMontantFCFA,
  formatPourcentage,
  formatNombre,
  getLabelStatut,
  tronquerTexte,
  genererNomFichier,
} from './utils'

// ===========================================
// Types internes (contournement des types pptxgenjs)
// ===========================================

/** Type slide retourné par addSlide */
interface SlideType {
  addText(text: string | string[], options: Record<string, any>): void
  addShape(type: string, options: Record<string, any>): void
  addChart(chartType: any, data: any[] | any, options?: Record<string, any>): void
  addTable(table: any[], options?: Record<string, any>): void
}

/** Type principal PptxGenJS */
interface PptxInstance {
  defineLayout(layout: Record<string, any>): void
  setLayout(name: string): void
  setAuthor(author: string): void
  setCompany(company: string): void
  setSubject(subject: string): void
  addSlide(): SlideType
  write(options: { outputType: string }): Promise<ArrayBuffer | Buffer | Blob>
  charts: {
    BAR: string
    LINE: string
    PIE: string
    DOUGHNUT: string
    AREA: string
  }
}

// ===========================================
// Constantes de style
// ===========================================

/** Configuration des slides */
const SLIDE_CONFIG = {
  width: PPTX_STYLES.SLIDE_WIDTH,   // 10 inches
  height: PPTX_STYLES.SLIDE_HEIGHT, // 7.5 inches
}

/** Positions et tailles standard */
const POSITIONS = {
  // Titres
  title: { x: 0.5, y: 0.3, w: 9, h: 0.8 },
  subtitle: { x: 0.5, y: 1.1, w: 9, h: 0.5 },
  
  // Contenu
  content: { x: 0.5, y: 1.8, w: 9, h: 5.2 },
  
  // KPIs (4 colonnes)
  kpi: { x: 0.4, y: 1.8, w: 2.2, h: 2 },
  
  // Tableaux
  table: { x: 0.4, y: 1.6, w: 9.2, h: 5 },
  
  // Footer
  footer: { x: 0.3, y: 7, w: 9.4, h: 0.4 },
}

// ===========================================
// Fonctions helpers
// ===========================================

/**
 * Crée une nouvelle instance PptxGenJS configurée
 */
function createPresentation(): PptxInstance {
  const pptx = new (PptxGenJS as any)() as PptxInstance
  
  // Configuration générale
  pptx.defineLayout({ name: 'EOSCS_LAYOUT', width: SLIDE_CONFIG.width, height: SLIDE_CONFIG.height })
  pptx.setLayout('EOSCS_LAYOUT')
  
  // Propriétés du document
  pptx.setAuthor('e-OSCS - MCNSLP')
  pptx.setCompany('MCNSLP - Côte d\'Ivoire')
  pptx.setSubject('Rapport d\'activités')
  
  return pptx
}

/**
 * Ajoute un footer commun à toutes les slides
 */
function addFooter(slide: SlideType, params: PresentationParams): void {
  slide.addText(
    `e-OSCS v1.0 | ${params.organisation.nom} | ${params.periode.label}`,
    {
      x: POSITIONS.footer.x,
      y: POSITIONS.footer.y,
      w: POSITIONS.footer.w,
      h: POSITIONS.footer.h,
      fontSize: 9,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
    }
  )
}

/**
 * Crée le slide de titre principal
 */
function createTitleSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  
  // Fond dégradé (simulé avec forme rectangulaire)
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_CONFIG.width,
    h: SLIDE_CONFIG.height,
    fill: { color: EOSCS_COLORS.GRIS_FONCE },
  })
  
  // Bandeau supérieur orange
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_CONFIG.width,
    h: 0.15,
    fill: { color: EOSCS_COLORS.ORANGE_CI },
  })
  
  // Bandeau inférieur vert
  slide.addShape('rect', {
    x: 0,
    y: SLIDE_CONFIG.height - 0.15,
    w: SLIDE_CONFIG.width,
    h: 0.15,
    fill: { color: EOSCS_COLORS.VERT_CI },
  })
  
  // Logo / Organisation
  slide.addText('MCNSLP', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.7,
    fontSize: 36,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.VERT_CI,
    bold: true,
    align: 'center',
  })
  
  slide.addText(
    'Ministère de la Cohésion Nationale, de la Solidarité Nationale\net de la Lutte contre la Pauvreté',
    {
      x: 0.5,
      y: 2.1,
      w: 9,
      h: 0.6,
      fontSize: 12,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
      italic: true,
    }
  )
  
  // Titre du rapport
  const typeLabel = params.type === 'mensuel' ? 'MENSUEL'
    : params.type === 'trimestriel' ? 'TRIMESTRIEL'
    : 'ANNUEL'
  
  slide.addText(`RAPPORT ${typeLabel}`, {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.8,
    fontSize: 40,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.ORANGE_CI,
    bold: true,
    align: 'center',
  })
  
  slide.addText("D'ACTIVITÉS", {
    x: 0.5,
    y: 3.7,
    w: 9,
    h: 0.6,
    fontSize: 32,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.BLANC,
    bold: true,
    align: 'center',
  })
  
  // e-OSCS branding
  slide.addText('e-OSCS', {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.VERT_CI,
    bold: true,
    align: 'center',
  })
  
  // Organisation et période
  slide.addText(`${params.organisation.nom}`, {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 0.4,
    fontSize: 18,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.BLANC,
    align: 'center',
  })
  
  slide.addText(`${params.organisation.type_org} • ${params.organisation.region}`, {
    x: 0.5,
    y: 5.55,
    w: 9,
    h: 0.35,
    fontSize: 14,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.GRIS_MOYEN,
    align: 'center',
  })
  
  // Période dans un encadré
  slide.addShape('roundRect', {
    x: 3,
    y: 6,
    w: 4,
    h: 0.6,
    fill: { color: EOSCS_COLORS.ORANGE_CI },
    line: { color: EOSCS_COLORS.ORANGE_CI },
  })
  
  slide.addText(params.periode.label, {
    x: 3,
    y: 6,
    w: 4,
    h: 0.6,
    fontSize: 16,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.BLANC,
    bold: true,
    align: 'center',
    valign: 'middle',
  })
}

/**
 * Crée le slide agenda/sommaire
 */
function createAgendaSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, 'Sommaire', params)
  
  const items = [
    { num: '01', text: 'Indicateurs Clés de Performance' },
    { num: '02', text: "Taux d'Exécution" },
    { num: '03', text: 'Activités Réalisées' },
    { num: '04', text: 'Analyse Budgétaire' },
    { num: '05', text: 'Bénéficiaires' },
    { num: '06', text: 'Répartition par Catégorie' },
    { num: '07', text: 'Perspectives & Recommandations' },
  ]
  
  items.forEach((item, index) => {
    const yPos = 1.8 + (index * 0.7)
    
    // Numéro
    slide.addText(item.num, {
      x: 0.8,
      y: yPos,
      w: 0.6,
      h: 0.55,
      fontSize: 18,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.ORANGE_CI,
      bold: true,
      align: 'center',
      valign: 'middle',
    })
    
    // Texte
    slide.addText(item.text, {
      x: 1.6,
      y: yPos,
      w: 7,
      h: 0.55,
      fontSize: 16,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_FONCE,
      valign: 'middle',
    })
    
    // Ligne séparatrice
    if (index < items.length - 1) {
      slide.addShape('line', {
        x: 1.6,
        y: yPos + 0.6,
        w: 7.5,
        h: 0,
        line: { color: EOSCS_COLORS.GRIS_CLAIR, width: 0.5 },
      })
    }
  })
  
  addFooter(slide, params)
}

/**
 * Ajoute un header standard aux slides de contenu
 */
function addSlideHeader(slide: SlideType, title: string, params: PresentationParams): void {
  // Bandeau supérieur orange
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_CONFIG.width,
    h: 0.08,
    fill: { color: EOSCS_COLORS.ORANGE_CI },
  })
  
  // Titre
  slide.addText(title, {
    x: POSITIONS.title.x,
    y: POSITIONS.title.y,
    w: POSITIONS.title.w,
    h: POSITIONS.title.h,
    fontSize: 28,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.GRIS_FONCE,
    bold: true,
  })
  
  // Ligne sous le titre
  slide.addShape('line', {
    x: 0.5,
    y: 1.15,
    w: 9,
    h: 0,
    line: { color: EOSCS_COLORS.ORANGE_CI, width: 2 },
  })
}

/**
 * Crée le slide KPIs
 */
function createKpiSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '📊 Indicateurs Clés de Performance', params)
  
  const { stats } = params
  
  // KPI Cards - 2x3 grid
  const kpis = [
    { label: 'Total Activités', value: formatNombre(stats.totalActivites), icon: '📋', color: EOSCS_COLORS.VERT_CI },
    { label: "Taux d'Exécution", value: formatPourcentage(stats.tauxExecution), icon: '✅', color: EOSCS_COLORS.ORANGE_CI },
    { label: 'Budget Alloué', value: formatMontantFCFA(stats.budgetTotal), icon: '💰', color: EOSCS_COLORS.BLEU },
    { label: 'Budget Utilisé', value: formatMontantFCFA(stats.budgetDepense), icon: '💸', color: EOSCS_COLORS.VERT_CI },
    { label: 'Bénéficiaires', value: formatNombre(stats.beneficiairesTotal), icon: '👥', color: EOSCS_COLORS.ORANGE_CI },
    { label: 'Taux Budget', value: formatPourcentage(stats.tauxBudgetUtilise), icon: '📈', color: EOSCS_COLORS.BLEU },
  ]
  
  kpis.forEach((kpi, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    const xPos = 0.5 + (col * 3.1)
    const yPos = 1.6 + (row * 2.6)
    
    // Carte KPI
    slide.addShape('roundRect', {
      x: xPos,
      y: yPos,
      w: 2.9,
      h: 2.3,
      fill: { color: EOSCS_COLORS.BLANC },
      line: { color: EOSCS_COLORS.GRIS_CLAIR, width: 1 },
    })
    
    // Icône
    slide.addText(kpi.icon, {
      x: xPos,
      y: yPos + 0.15,
      w: 2.9,
      h: 0.5,
      fontSize: 24,
      align: 'center',
    })
    
    // Valeur
    slide.addText(kpi.value, {
      x: xPos + 0.1,
      y: yPos + 0.75,
      w: 2.7,
      h: 0.9,
      fontSize: kpi.value.length > 12 ? 18 : 22,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: kpi.color,
      bold: true,
      align: 'center',
      valign: 'middle',
    })
    
    // Label
    slide.addText(kpi.label, {
      x: xPos + 0.1,
      y: yPos + 1.7,
      w: 2.7,
      h: 0.45,
      fontSize: 11,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
    })
  })
  
  addFooter(slide, params)
}

/**
 * Crée le slide taux d'exécution
 */
function createExecutionSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '🎯 Taux d\'Exécution Global', params)
  
  const { stats } = params
  
  // Grande valeur centrale
  const mainValue = formatPourcentage(stats.tauxExecution)
  
  // Cercle de progression (simulé avec forme)
  slide.addShape('ellipse', {
    x: 3.25,
    y: 2,
    w: 3.5,
    h: 3.5,
    fill: { color: EOSCS_COLORS.GRIS_CLAIR },
    line: { color: getExecutionColor(stats.tauxExecution), width: 4 },
  })
  
  slide.addText(mainValue, {
    x: 3.25,
    y: 2.9,
    w: 3.5,
    h: 1.2,
    fontSize: 36,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: getExecutionColor(stats.tauxExecution),
    bold: true,
    align: 'center',
    valign: 'middle',
  })
  
  slide.addText("Taux d'Exécution", {
    x: 3.25,
    y: 4,
    w: 3.5,
    h: 0.5,
    fontSize: 14,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.GRIS_MOYEN,
    align: 'center',
  })
  
  // Détails à gauche
  const leftStats = [
    { label: 'Activités Validées', value: `${stats.activitesValidees}/${stats.totalActivites}` },
    { label: 'En Cours', value: `${stats.activitesEnCours}` },
    { label: 'Brouillons', value: `${stats.activitesBrouillon}` },
  ]
  
  leftStats.forEach((stat, i) => {
    const yPos = 2 + (i * 0.9)
    slide.addText(stat.label, {
      x: 0.5,
      y: yPos,
      w: 2.5,
      h: 0.35,
      fontSize: 12,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
    })
    slide.addText(stat.value, {
      x: 0.5,
      y: yPos + 0.35,
      w: 2.5,
      h: 0.45,
      fontSize: 20,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_FONCE,
      bold: true,
    })
  })
  
  // Barre de progression horizontale
  const barY = 5.8
  const barWidth = 7
  const barHeight = 0.4
  const barX = 1.5
  
  // Fond de la barre
  slide.addShape('roundRect', {
    x: barX,
    y: barY,
    w: barWidth,
    h: barHeight,
    fill: { color: EOSCS_COLORS.GRIS_CLAIR },
    line: { color: EOSCS_COLORS.GRIS_CLAIR },
  })
  
  // Partie remplie
  const filledWidth = (stats.tauxExecution / 100) * barWidth
  if (filledWidth > 0) {
    slide.addShape('roundRect', {
      x: barX,
      y: barY,
      w: Math.max(filledWidth, 0.3),
      h: barHeight,
      fill: { color: getExecutionColor(stats.tauxExecution) },
      line: { color: getExecutionColor(stats.tauxExecution) },
    })
  }
  
  // Pourcentage sur la barre
  slide.addText(mainValue, {
    x: barX,
    y: barY,
    w: barWidth,
    h: barHeight,
    fontSize: 14,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.BLANC,
    bold: true,
    align: 'center',
    valign: 'middle',
  })
  
  addFooter(slide, params)
}

/**
 * Retourne la couleur selon le taux d'exécution
 */
function getExecutionColor(taux: number): string {
  if (taux >= 75) return EOSCS_COLORS.VERT_CI
  if (taux >= 50) return EOSCS_COLORS.ORANGE_CI
  return EOSCS_COLORS.ROUGE
}

/**
 * Crée le slide liste des activités
 */
function createActivitiesSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '📋 Activités Réalisées', params)
  
  const { activities } = params
  
  if (activities.length === 0) {
    slide.addText('Aucune activité trouvée pour cette période.', {
      x: 1,
      y: 3,
      w: 8,
      h: 1,
      fontSize: 16,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
      italic: true,
    })
    addFooter(slide, params)
    return
  }
  
  // Prendre les 8 premières activités max
  const displayedActivities = activities.slice(0, 8)
  
  // Préparer les données du tableau
  const tableData: any[][] = [
    [
      { text: 'Titre', options: { bold: true, fill: { color: EOSCS_COLORS.ORANGE_CI }, color: EOSCS_COLORS.BLANC } },
      { text: 'Statut', options: { bold: true, fill: { color: EOSCS_COLORS.ORANGE_CI }, color: EOSCS_COLORS.BLANC } },
      { text: 'Budget', options: { bold: true, fill: { color: EOSCS_COLORS.ORANGE_CI }, color: EOSCS_COLORS.BLANC } },
      { text: 'Bénéf.', options: { bold: true, fill: { color: EOSCS_COLORS.ORANGE_CI }, color: EOSCS_COLORS.BLANC } },
    ],
  ]
  
  displayedActivities.forEach((act, idx) => {
    tableData.push([
      { text: tronquerTexte(act.titre, 35), options: { fill: { color: idx % 2 === 0 ? EOSCS_COLORS.BLANC : EOSCS_COLORS.GRIS_CLAIR } } },
      { text: getLabelStatut(act.statut), options: { fill: { color: idx % 2 === 0 ? EOSCS_COLORS.BLANC : EOSCS_COLORS.GRIS_CLAIR }, fontSize: 10 } },
      { text: formatMontantFCFA(act.budget_alloue), options: { fill: { color: idx % 2 === 0 ? EOSCS_COLORS.BLANC : EOSCS_COLORS.GRIS_CLAIR }, fontSize: 10 } },
      { text: formatNombre(act.beneficiaires_count), options: { fill: { color: idx % 2 === 0 ? EOSCS_COLORS.BLANC : EOSCS_COLORS.GRIS_CLAIR }, align: 'center' } },
    ])
  })
  
  slide.addTable(tableData, {
    x: POSITIONS.table.x,
    y: POSITIONS.table.y,
    w: POSITIONS.table.w,
    h: POSITIONS.table.h,
    colW: [4.5, 1.8, 1.8, 1.1],
    border: { pt: 0.5, color: EOSCS_COLORS.GRIS_CLAIR },
    fontFace: PPTX_STYLES.FONT_MAIN,
    fontSize: 11,
    valign: 'middle',
  })
  
  // Note si plus d'activités
  if (activities.length > 8) {
    slide.addText(`... et ${activities.length - 8} autre(s) activité(s)`, {
      x: 0.5,
      y: 6.5,
      w: 9,
      h: 0.3,
      fontSize: 10,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      italic: true,
      align: 'right',
    })
  }
  
  addFooter(slide, params)
}

/**
 * Crée le slide analyse budgétaire avec graphique
 */
function createBudgetSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '💰 Analyse Budgétaire', params)
  
  const { stats } = params
  
  // Graphique barres - Budget alloué vs dépensé
  try {
    slide.addChart((pptx as any).charts.BAR, [
      {
        name: 'Alloué',
        labels: ['Budget'],
        values: [stats.budgetTotal],
      },
      {
        name: 'Dépensé',
        labels: ['Budget'],
        values: [stats.budgetDepense],
      },
    ], {
      x: 0.5,
      y: 1.6,
      w: 5,
      h: 3.5,
      barDir: 'bar',
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFontSize: 11,
      dataLabelFontBold: true,
      chartColors: [EOSCS_COLORS.ORANGE_CI, EOSCS_COLORS.VERT_CI],
      showLegend: true,
      legendPos: 'b',
      catGridLine: { style: 'none' },
      valGridLine: { color: EOSCS_COLORS.GRIS_CLAIR, style: 'dash' },
    })
  } catch (e) {
    // Si le graphique échoue, afficher un texte simple
    slide.addText(`Alloué: ${formatMontantFCFA(stats.budgetTotal)}\nDépensé: ${formatMontantFCFA(stats.budgetDepense)}`, {
      x: 0.5,
      y: 2,
      w: 5,
      h: 2,
      fontSize: 16,
      fontFace: PPTX_STYLES.FONT_MAIN,
    })
  }
  
  // Cartes résumé à droite
  const budgetCards = [
    { label: 'Total Alloué', value: formatMontantFCFA(stats.budgetTotal), bgColor: 'FFF7ED', borderColor: EOSCS_COLORS.ORANGE_CI },
    { label: 'Total Dépensé', value: formatMontantFCFA(stats.budgetDepense), bgColor: 'F0FDF4', borderColor: EOSCS_COLORS.VERT_CI },
    { label: 'Restant', value: formatMontantFCFA(stats.budgetRestant), bgColor: 'EFF6FF', borderColor: EOSCS_COLORS.BLEU },
    { label: 'Taux Utilisation', value: formatPourcentage(stats.tauxBudgetUtilise), bgColor: 'FEF3C7', borderColor: '#F59E0B' },
  ]
  
  budgetCards.forEach((card, i) => {
    const yPos = 1.6 + (i * 1.25)
    
    slide.addShape('roundRect', {
      x: 5.8,
      y: yPos,
      w: 3.8,
      h: 1.1,
      fill: { color: card.bgColor },
      line: { color: card.borderColor, width: 1 },
    })
    
    slide.addText(card.label, {
      x: 6,
      y: yPos + 0.1,
      w: 3.4,
      h: 0.35,
      fontSize: 11,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
    })
    
    slide.addText(card.value, {
      x: 6,
      y: yPos + 0.45,
      w: 3.4,
      h: 0.55,
      fontSize: card.value.length > 15 ? 14 : 17,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_FONCE,
      bold: true,
    })
  })
  
  addFooter(slide, params)
}

/**
 * Crée le slide bénéficiaires
 */
function createBeneficiairesSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '👥 Bénéficiaires', params)
  
  const { stats } = params
  
  // Valeur totale grande
  slide.addText(formatNombre(stats.beneficiairesTotal), {
    x: 0.5,
    y: 1.8,
    w: 4,
    h: 1.2,
    fontSize: 48,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.ORANGE_CI,
    bold: true,
    align: 'center',
  })
  
  slide.addText('Bénéficiaires Totaux', {
    x: 0.5,
    y: 3,
    w: 4,
    h: 0.4,
    fontSize: 14,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.GRIS_MOYEN,
    align: 'center',
  })
  
  // Graphique camembert si données genre disponibles
  if (stats.beneficiairesHommes > 0 || stats.beneficiairesFemmes > 0) {
    const pieData: number[] = []
    const pieLabels: string[] = []
    const pieColors: string[] = []
    
    if (stats.beneficiairesHommes > 0) {
      pieData.push(stats.beneficiairesHommes)
      pieLabels.push(`Hommes (${formatNombre(stats.beneficiairesHommes)})`)
      pieColors.push('#3B82F6')
    }
    
    if (stats.beneficiairesFemmes > 0) {
      pieData.push(stats.beneficiairesFemmes)
      pieLabels.push(`Femmes (${formatNombre(stats.beneficiairesFemmes)})`)
      pieColors.push('#EC4899')
    }
    
    if (pieData.length > 0) {
      try {
        slide.addChart((pptx as any).charts.DOUGHNUT, [{
          name: 'Répartition',
          labels: pieLabels,
          values: pieData,
        }], {
          x: 4.8,
          y: 1.6,
          w: 4.8,
          h: 4,
          showSize: 80,
          holeSize: 50,
          showLegend: true,
          legendPos: 'b',
          chartColors: pieColors,
          showPercent: true,
          showValue: false,
          dataLabelFontSize: 10,
        })
      } catch (e) {
        // Fallback si erreur graphique
      }
    }
  } else {
    // Afficher les stats simples
    const simpleStats = [
      { label: 'Hommes', value: stats.beneficiairesHommes || 0, color: '#3B82F6' },
      { label: 'Femmes', value: stats.beneficiairesFemmes || 0, color: '#EC4899' },
      { label: 'Jeunes', value: stats.beneficiairesJeunes || 0, color: EOSCS_COLORS.VERT_CI },
    ]
    
    simpleStats.forEach((stat, i) => {
      const yPos = 2 + (i * 1.4)
      
      slide.addShape('roundRect', {
        x: 5,
        y: yPos,
        w: 4.5,
        h: 1.2,
        fill: { color: EOSCS_COLORS.BLANC },
        line: { color: stat.color, width: 2 },
      })
      
      slide.addText(formatNombre(stat.value), {
        x: 5.2,
        y: yPos + 0.15,
        w: 2,
        h: 0.9,
        fontSize: 28,
        fontFace: PPTX_STYLES.FONT_MAIN,
        color: stat.color,
        bold: true,
        valign: 'middle',
      })
      
      slide.addText(stat.label, {
        x: 2.8,
        y: yPos + 0.35,
        w: 2,
        h: 0.5,
        fontSize: 16,
        fontFace: PPTX_STYLES.FONT_MAIN,
        color: EOSCS_COLORS.GRIS_FONCE,
      })
    })
  }
  
  addFooter(slide, params)
}

/**
 * Crée le slide répartition par catégorie
 */
function createCategorieSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '📁 Répartition par Catégorie', params)
  
  const { stats } = params
  const categories = Object.entries(stats.parCategorie)
  
  if (categories.length === 0) {
    slide.addText('Aucune donnée de catégorie disponible.', {
      x: 1,
      y: 3,
      w: 8,
      h: 1,
      fontSize: 16,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
      italic: true,
    })
    addFooter(slide, params)
    return
  }
  
  // Préparer les données pour le graphique
  const labels = categories.map(([cat]) => tronquerTexte(cat, 20))
  const values = categories.map(([, count]) => count)
  
  // Couleurs alternées
  const colors = [EOSCS_COLORS.ORANGE_CI, EOSCS_COLORS.VERT_CI, EOSCS_COLORS.BLEU, '#8B5CF6', '#EC4899', '#F59E0B']
  
  // Graphique horizontal bar
  try {
    slide.addChart((pptx as any).charts.BAR, [{
      name: 'Activités',
      labels: labels,
      values: values,
    }], {
      x: 0.5,
      y: 1.6,
      w: 9,
      h: 5,
      barDir: 'bar',
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFontSize: 11,
      dataLabelFontBold: true,
      chartColors: colors.slice(0, Math.min(categories.length, colors.length)),
      showLegend: false,
      catGridLine: { style: 'none' },
      valGridLine: { color: EOSCS_COLORS.GRIS_CLAIR, style: 'dash' },
      barGapWidthPct: 30,
    })
  } catch (e) {
    // Afficher en texte si erreur
    categories.forEach(([cat, count], i) => {
      slide.addText(`${cat}: ${count}`, {
        x: 1,
        y: 2 + (i * 0.5),
        w: 8,
        h: 0.4,
        fontSize: 14,
        fontFace: PPTX_STYLES.FONT_MAIN,
      })
    })
  }
  
  addFooter(slide, params)
}

/**
 * Crée le slide perspectives et recommandations
 */
function createPerspectivesSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  addSlideHeader(slide, '🔮 Perspectives & Recommandations', params)
  
  const { stats } = params
  
  // Générer les recommandations
  const recommandations = generateRecommendations(stats)
  
  // Section Recommandations
  slide.addText('Recommandations', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.ORANGE_CI,
    bold: true,
  })
  
  recommandations.forEach((rec, i) => {
    const yPos = 2 + (i * 0.65)
    
    // Bullet point
    slide.addShape('oval', {
      x: 0.6,
      y: yPos + 0.15,
      w: 0.15,
      h: 0.15,
      fill: { color: EOSCS_COLORS.VERT_CI },
    })
    
    slide.addText(rec, {
      x: 0.95,
      y: yPos,
      w: 8.5,
      h: 0.55,
      fontSize: 13,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_FONCE,
      valign: 'top',
    })
  })
  
  // Section Prochains objectifs
  const objectifs = getNextObjectives(params.type)
  
  slide.addText('Prochains Objectifs', {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.VERT_CI,
    bold: true,
  })
  
  objectifs.forEach((obj, i) => {
    const xPos = 0.5 + (i * 3.15)
    
    slide.addShape('roundRect', {
      x: xPos,
      y: 5.45,
      w: 3,
      h: 1.3,
      fill: { color: i % 2 === 0 ? 'F0FDF4' : 'FFF7ED' },
      line: { color: i % 2 === 0 ? EOSCS_COLORS.VERT_CI : EOSCS_COLORS.ORANGE_CI, width: 1 },
    })
    
    slide.addText(obj, {
      x: xPos + 0.15,
      y: 5.55,
      w: 2.7,
      h: 1.1,
      fontSize: 11,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_FONCE,
      valign: 'middle',
    })
  })
  
  addFooter(slide, params)
}

/**
 * Génère les recommandations basées sur les statistiques
 */
function generateRecommendations(stats: { tauxExecution: number; tauxBudgetUtilise: number; beneficiairesTotal: number; beneficiairesFemmes: number }): string[] {
  const recs: string[] = []
  
  // Sur l'exécution
  if (stats.tauxExecution < 50) {
    recs.push("Accélérer la validation et la réalisation des activités planifiées pour améliorer significativement le taux d'exécution.")
  } else if (stats.tauxExecution < 75) {
    recs.push("Maintenir l'effort actuel pour atteindre l'objectif de 75% d'exécution minimum.")
  } else {
    recs.push("Excellent taux d'exécution ! Maintenir ce niveau de performance pour les périodes futures.")
  }
  
  // Sur le budget
  if (stats.tauxBudgetUtilise > 95) {
    recs.push("Le budget est presque entièrement consommé. Anticiper les demandes de complément budgétaire si nécessaire.")
  } else if (stats.tauxBudgetUtilise < 50) {
    recs.push("Optimiser l'utilisation du budget alloué en accélérant les dépenses programmées.")
  }
  
  // Sur les bénéficiaires
  if (stats.beneficiairesTotal > 0 && stats.beneficiairesFemmes > 0) {
    const ratioF = (stats.beneficiairesFemmes / stats.beneficiairesTotal) * 100
    if (ratioF < 30) {
      recs.push("Renforcer spécifiquement la participation féminine dans les activités à venir.")
    }
  }
  
  // Recommandation générique si pas assez
  if (recs.length < 3) {
    recs.push("Assurer un suivi régulier et rigoureux des indicateurs de performance définis.")
  }
  
  return recs.slice(0, 4) // Max 4 recommandations
}

/**
 * Retourne les prochains objectifs selon le type de rapport
 */
function getNextObjectives(type: string): string[] {
  switch (type) {
    case 'mensuel':
      return [
        '✓ Finaliser activités en cours',
        '✓ Soumettre nouvelles activités',
        '✓ Mettre à jour indicateurs',
      ]
    case 'trimestriel':
      return [
        '✓ Bilan trimestre suivant',
        '✓ Planifier Q+1',
        '✓ Ajuster budgets',
      ]
    case 'annuel':
      return [
        '✓ Définir objectifs N+1',
        '✓ Planifier budget annuel',
        '✓ Former les équipes',
      ]
    default:
      return [
        'Objectif 1',
        'Objectif 2',
        'Objectif 3',
      ]
  }
}

/**
 * Crée le slide de remerciements/fin
 */
function createThankYouSlide(pptx: PptxInstance, params: PresentationParams): void {
  const slide = pptx.addSlide()
  
  // Fond
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_CONFIG.width,
    h: SLIDE_CONFIG.height,
    fill: { color: EOSCS_COLORS.GRIS_FONCE },
  })
  
  // Bandeau supérieur orange
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_CONFIG.width,
    h: 0.15,
    fill: { color: EOSCS_COLORS.ORANGE_CI },
  })
  
  // Bandeau inférieur vert
  slide.addShape('rect', {
    x: 0,
    y: SLIDE_CONFIG.height - 0.15,
    w: SLIDE_CONFIG.width,
    h: 0.15,
    fill: { color: EOSCS_COLORS.VERT_CI },
  })
  
  // Merci
  slide.addText('Merci !', {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 1,
    fontSize: 56,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.ORANGE_CI,
    bold: true,
    align: 'center',
  })
  
  // Sous-titre
  slide.addText('MCNSLP • e-OSCS', {
    x: 0.5,
    y: 3.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.VERT_CI,
    align: 'center',
  })
  
  // Organisation
  slide.addText(params.organisation.nom, {
    x: 0.5,
    y: 4.1,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.BLANC,
    align: 'center',
  })
  
  // Période
  slide.addText(params.periode.label, {
    x: 0.5,
    y: 4.6,
    w: 9,
    h: 0.4,
    fontSize: 14,
    fontFace: PPTX_STYLES.FONT_MAIN,
    color: EOSCS_COLORS.GRIS_MOYEN,
    align: 'center',
  })
  
  // Contact info
  slide.addText(
    'Ministère de la Cohésion Nationale, de la Solidarité Nationale\net de la Lutte contre la Pauvreté\nCôte d\'Ivoire',
    {
      x: 0.5,
      y: 5.3,
      w: 9,
      h: 1,
      fontSize: 11,
      fontFace: PPTX_STYLES.FONT_MAIN,
      color: EOSCS_COLORS.GRIS_MOYEN,
      align: 'center',
      italic: true,
    }
  )
}

// ===========================================
// Fonction principale de génération
// ===========================================

/**
 * Génère une présentation PowerPoint complète
 * 
 * @param params - Paramètres de la présentation
 * @returns Buffer de la présentation générée
 * 
 * @example
 * ```typescript
 * const buffer = await generatePresentationRapport({
 *   organisation: { nom: 'DR Abidjan', type_org: 'DR', region: 'Abidjan' },
 *   periode: { debut: '2026-01-01', fin: '2026-01-31', label: 'Janvier 2026', annee: 2026, mois: 1 },
 *   activities: [...],
 *   stats: {...},
 *   type: 'mensuel'
 * })
 * ```
 */
export async function generatePresentationRapport(params: PresentationParams): Promise<Buffer> {
  const pptx = createPresentation()
  
  // 1. Slide titre
  createTitleSlide(pptx, params)
  
  // 2. Slide agenda
  createAgendaSlide(pptx, params)
  
  // 3. Slide KPIs
  createKpiSlide(pptx, params)
  
  // 4. Slide exécution
  createExecutionSlide(pptx, params)
  
  // 5. Slide activités
  createActivitiesSlide(pptx, params)
  
  // 6. Slide budget
  createBudgetSlide(pptx, params)
  
  // 7. Slide bénéficiaires
  createBeneficiairesSlide(pptx, params)
  
  // 8. Slide catégories
  createCategorieSlide(pptx, params)
  
  // 9. Slide perspectives
  createPerspectivesSlide(pptx, params)
  
  // 10. Slide remerciements
  createThankYouSlide(pptx, params)
  
  // Générer le buffer
  const result = await pptx.write({ outputType: 'arraybuffer' })
  return Buffer.from(result as ArrayBuffer)
}

/**
 * Fonction générique de génération de présentation PowerPoint
 * 
 * @param params - Paramètres de la présentation
 * @returns Resultat de génération avec buffer et métadonnées
 */
export async function generatePowerPointReport(params: PresentationParams): Promise<GenerationResult> {
  try {
    const buffer = await generatePresentationRapport(params)
    
    const filename = genererNomFichier(
      params.type,
      'pptx',
      params.organisation.nom,
      params.periode.label
    )
    
    return {
      success: true,
      buffer,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: buffer.length,
    }
  } catch (error) {
    console.error('Erreur lors de la génération PowerPoint:', error)
    return {
      success: false,
      filename: '',
      mimeType: '',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}
