/**
 * Dark theme for user HTML (post bodies) that carries its own inline colours.
 *
 * Posts are written for a white page: grey text, pale callout boxes, dark table headers with white text. On the dark
 * theme a dark text colour or a light background/border colour keeps its hue and gets the opposite lightness, so a pale
 * amber box becomes a dark amber box and its brown text turns light amber. Text only ever gets lighter and backgrounds
 * only darker, so colours that already suit a dark page (white text, a dark table header) stay as they are and no pair
 * can end up unreadable. Only colours in `style` attributes change; images, videos and SVG diagrams are left alone.
 *
 * Pure string work (no DOM) so the server render already sends the dark version.
 */

// Lightness range the flipped colours land in, so white backgrounds end near the dark surface instead of pure black
// and black text ends near the theme's light text instead of pure white.
const MIN_LIGHTNESS = 0.08
const MAX_LIGHTNESS = 0.94

const BACKGROUND_PROPERTIES = /^(?:background|background-color|border(?:-(?:top|right|bottom|left))?(?:-color)?)$/i
const COLOR_TOKEN = /#[\da-f]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/gi
const STYLE_ATTRIBUTE = /\sstyle="([^"]*)"/gi
// SVG diagrams paint with fill/stroke attributes (only SVG tags keep them through the sanitizer).
const SVG_PAINT_ATTRIBUTE = /\s(fill|stroke)="([^"]*)"/gi

// text: flipped only when dark. background: flipped only when light. flip: always (SVG diagrams, whose box behind
// them darkens, so the whole drawing flips with it).
type Mode = 'text' | 'background' | 'flip'

type Rgba = [number, number, number, number]

const parseColor = (token: string): Rgba | null => {
  const value = token.toLowerCase()
  if (value === 'white') return [255, 255, 255, 1]
  if (value === 'black') return [0, 0, 0, 1]

  if (value.startsWith('#')) {
    let hex = value.slice(1)
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map(char => char + char).join('')
    if (hex.length !== 6 && hex.length !== 8) return null
    const channel = (index: number) => Number.parseInt(hex.slice(index, index + 2), 16)
    return [channel(0), channel(2), channel(4), hex.length === 8 ? channel(6) / 255 : 1]
  }

  const parts = value.slice(value.indexOf('(') + 1, -1).split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3 || parts.some(part => part.endsWith('%'))) return null
  const [red, green, blue, alpha = '1'] = parts.map(Number)
  if ([red, green, blue, alpha].some(Number.isNaN)) return null
  return [red!, green!, blue!, Number(alpha)]
}

const adaptColor = ([red, green, blue, alpha]: Rgba, mode: Mode) => {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  const delta = max - min
  if ((mode === 'background' && lightness <= 0.5) || (mode === 'text' && lightness >= 0.5)) return null

  let hue = 0
  if (delta > 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
    hue *= 60
  }

  const flipped = MIN_LIGHTNESS + (1 - lightness) * (MAX_LIGHTNESS - MIN_LIGHTNESS)
  // Keep the colour's strength (chroma), not its HSL saturation: a pale tint like #fff7e6 is 100% saturated in HSL and
  // would turn into a loud brown at low lightness.
  const chroma = Math.min(delta, 1 - Math.abs(2 * flipped - 1))
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = flipped - chroma / 2
  const sector = Math.floor((((hue % 360) + 360) % 360) / 60)
  const [r1, g1, b1] = [
    [chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x],
  ][sector]!
  const toByte = (value: number) => Math.round((value + m) * 255)

  return alpha < 1
    ? `rgba(${toByte(r1!)}, ${toByte(g1!)}, ${toByte(b1!)}, ${alpha})`
    : `rgb(${toByte(r1!)}, ${toByte(g1!)}, ${toByte(b1!)})`
}

const adaptColors = (value: string, mode: Mode) => value.replace(COLOR_TOKEN, (token) => {
  const color = parseColor(token)
  return (color && adaptColor(color, mode)) ?? token
})

const darkenDeclaration = (declaration: string) => {
  const colon = declaration.indexOf(':')
  if (colon < 0) return declaration
  const property = declaration.slice(0, colon).trim()
  const isBackground = BACKGROUND_PROPERTIES.test(property)
  if (!isBackground && property.toLowerCase() !== 'color') return declaration

  return `${declaration.slice(0, colon + 1)}${adaptColors(declaration.slice(colon + 1), isBackground ? 'background' : 'text')}`
}

const cache = new Map<string, string>()
const CACHE_LIMIT = 50

export function darkHtmlColors(html: string | null | undefined): string {
  if (!html) return ''

  const cached = cache.get(html)
  if (cached !== undefined) return cached

  const result = html
    .replace(STYLE_ATTRIBUTE, (_, style: string) => ` style="${style.split(';').map(darkenDeclaration).join(';')}"`)
    .replace(SVG_PAINT_ATTRIBUTE, (_, name: string, value: string) => ` ${name}="${adaptColors(value, 'flip')}"`)

  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string)
  cache.set(html, result)
  return result
}
