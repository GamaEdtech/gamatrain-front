import sanitizeHtml from 'sanitize-html'
import type { IOptions } from 'sanitize-html'

/**
 * Defence in depth for the many `v-html` sinks: the backend now cleans user HTML when it is saved, but content stored
 * before that (and anything else that reaches a `v-html`) is cleaned again here at render time. Same whitelist idea as
 * the backend `HtmlSanitization`: formatting, tables, images, inline SVG diagrams and the `math-tex` formula marker stay;
 * scripts, frames, forms, event handlers, `javascript:` URLs and overlay CSS go.
 *
 * It runs on the server render too (a stored payload must not execute from the server-rendered HTML), so it is pure JS
 * with no DOM, and results are cached because the same post is rendered again and again.
 */

const SVG_TAGS = ['svg', 'g', 'defs', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'title', 'desc']

// The parser lowercases attribute names, so these are lowercase (a browser maps `viewbox` back to `viewBox`).
const SVG_ATTRIBUTES = [
  'viewbox', 'preserveaspectratio', 'xmlns', 'x', 'y', 'dx', 'dy', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry',
  'x1', 'y1', 'x2', 'y2', 'points', 'd', 'transform', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width',
  'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-opacity', 'opacity', 'font-size', 'font-family',
  'font-style', 'font-weight', 'text-anchor', 'dominant-baseline', 'letter-spacing',
]

const SAFE_CSS_VALUE = /^(?!.*(?:url\(|expression|javascript:|@import|behavior|binding)).*$/i

// Layout and typography only: no position/z-index/animation, which could paint a fake overlay over the page.
const ALLOWED_STYLES = [
  'color', 'background', 'background-color', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-color', 'border-style', 'border-width', 'border-collapse', 'border-spacing', 'border-radius',
  'border-top-width', 'border-top-style', 'border-top-color', 'border-left-width', 'border-left-style', 'border-left-color',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right',
  'padding-bottom', 'padding-left', 'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height', 'display',
  'font', 'font-family', 'font-size', 'font-style', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
  'text-decoration', 'text-indent', 'vertical-align', 'white-space', 'word-break', 'overflow-x', 'overflow-y', 'float',
  'list-style-type', 'table-layout', 'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
]

const DATA_IMAGE = /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp);base64,[a-z0-9+/=\s]+$/i

const options: IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img', 'figure', 'figcaption', 'span', 'div', 'u', 's', 'sub', 'sup', 'mark', 'small', 'hr', 'pre', 'code',
    'caption', 'colgroup', 'col', 'oembed', ...SVG_TAGS,
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'colspan', 'rowspan', 'align', 'valign', 'title', 'lang', 'dir', 'scope'],
    'a': ['href', 'rel', 'title'],
    'img': ['src', 'alt', 'width', 'height', 'title'],
    'oembed': ['url'],
    'svg': SVG_ATTRIBUTES,
    'g': SVG_ATTRIBUTES,
    'rect': SVG_ATTRIBUTES,
    'circle': SVG_ATTRIBUTES,
    'ellipse': SVG_ATTRIBUTES,
    'line': SVG_ATTRIBUTES,
    'polyline': SVG_ATTRIBUTES,
    'polygon': SVG_ATTRIBUTES,
    'path': SVG_ATTRIBUTES,
    'text': SVG_ATTRIBUTES,
    'tspan': SVG_ATTRIBUTES,
  },
  allowedStyles: {
    '*': Object.fromEntries(ALLOWED_STYLES.map(property => [property, [SAFE_CSS_VALUE]])),
  },
  // Only what the editor itself produces, plus the formula marker the post page typesets.
  allowedClasses: {
    '*': [
      'math-tex', 'table', 'media', 'image', 'image_resized', 'image-style-*', 'text-tiny', 'text-small', 'text-big',
      'text-huge', 'marker-*', 'pen-*', 'language-*',
    ],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowedSchemesAppliedToAttributes: ['href', 'src', 'url'],
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  // `data:` is allowed on <img> only, and only for raster images (data:image/svg+xml can carry script).
  transformTags: {
    img: (tagName, attribs) => {
      if (attribs.src?.startsWith('data:') && !DATA_IMAGE.test(attribs.src)) {
        delete attribs.src
      }
      return { tagName, attribs }
    },
  },
}

const CACHE_LIMIT = 200
const cache = new Map<string, string>()

export function sanitizeUserHtml(html: string | null | undefined): string {
  if (!html) {
    return ''
  }
  // No '<' means no tag can be in there: skip parsing entirely.
  if (!html.includes('<')) {
    return html
  }

  const cached = cache.get(html)
  if (cached !== undefined) {
    return cached
  }

  const clean = sanitizeHtml(html, options)
  if (cache.size >= CACHE_LIMIT) {
    // Maps iterate in insertion order, so this drops the oldest entry.
    cache.delete(cache.keys().next().value as string)
  }
  cache.set(html, clean)
  return clean
}
