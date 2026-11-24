import type { CampaignTheme } from '@/types'

/**
 * How each sale campaign theme looks and talks (docs/business/campaigns.md in gamatrain-back). The backend only says which
 * theme; everything visual is here. Text is written for students: short, a little cheeky, never childish.
 */
export interface CampaignThemeStyle {
  label: string
  /** Chip above the hero title. */
  badge: string
  /** Hero title: first line, then the accented line. `{percent}` is replaced. */
  titleLines: [string, string]
  /** Hero line under the title. `{percent}` is replaced. */
  lead: string
  /** Accent for prices, buttons and badges on light surfaces (≥ 4.5:1 on white). */
  accent: string
  /** Text on the accent. */
  onAccent: string
  /** The plans dialog's strip. */
  stripBackground: string
  stripText: string
  /** The interactive bit in the hero, if any. */
  play: 'snow' | 'fireworks' | null
  /** Hint shown under the buttons for the interactive bit. */
  playHint: string | null
}

export const CAMPAIGN_THEMES: Record<CampaignTheme, CampaignThemeStyle> = {
  BlackFriday: {
    label: 'Black Friday',
    badge: 'Black Friday week',
    titleLines: ['BLACK FRIDAY', '{percent}% off your first payment'],
    lead: 'The only Black Friday deal that raises your grades. Every plan, this week only.',
    accent: '#946200',
    onAccent: '#FFFFFF',
    stripBackground: '#0B0B0F',
    stripText: '#FFFFFF',
    play: null,
    playHint: null,
  },
  Christmas: {
    label: 'Christmas',
    badge: 'Christmas sale',
    titleLines: ['Exams don\'t take a holiday.', 'Your wallet can.'],
    lead: '{percent}% off your first payment on every plan, until the holidays end.',
    accent: '#C42B31',
    onAccent: '#FFFFFF',
    stripBackground: '#1E2A44',
    stripText: '#FFFFFF',
    play: 'snow',
    playHint: 'Tap the snow',
  },
  NewYear: {
    label: 'New Year',
    badge: 'New Year sale',
    titleLines: ['New year. Same syllabus.', 'Better grades.'],
    lead: '{percent}% off your first payment on every plan. Start the year ahead.',
    accent: '#0F766E',
    onAccent: '#FFFFFF',
    stripBackground: '#0D1226',
    stripText: '#FFFFFF',
    play: 'fireworks',
    playHint: 'Tap the sky',
  },
  Generic: {
    label: 'Sale',
    badge: '{title}',
    titleLines: ['Ace your next exam', 'for {percent}% less'],
    lead: '{percent}% off your first payment on every plan, for a limited time.',
    accent: '#946200',
    onAccent: '#FFFFFF',
    stripBackground: '#FFB300',
    stripText: '#1E2A44',
    play: null,
    playHint: null,
  },
}

export const campaignThemeName = (theme: CampaignTheme | { name: CampaignTheme } | null | undefined): CampaignTheme => {
  const name = typeof theme === 'string' ? theme : theme?.name
  return name && name in CAMPAIGN_THEMES ? name : 'Generic'
}
