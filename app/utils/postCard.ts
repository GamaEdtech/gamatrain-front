// Helpers shared by the blog list cards (featured slider and list items).

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: '\'',
  nbsp: ' ',
}

// Summaries are stored as editor HTML. Cards show them as text, so tags go and
// entities (`&amp;`, `&nbsp;`, `&#39;`) become the characters they stand for.
// Pure string work so it runs the same on the server render.
export const htmlToText = (html: string | null | undefined) => (html ?? '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return NAMED_ENTITIES[code.toLowerCase()] ?? entity
    const point = code[1]?.toLowerCase() === 'x' ? Number.parseInt(code.slice(2), 16) : Number(code.slice(1))
    return Number.isInteger(point) && point > 0 && point <= 0x10FFFF ? String.fromCodePoint(point) : entity
  })
  .replace(/\s+/g, ' ')
  .trim()

export const truncateText = (text: string, length: number) => text.length > length
  ? `${text.slice(0, length).trimEnd()}...`
  : text

// Some post images are stored with http URLs, which the https site would block.
export const secureImageUrl = (url: string | null | undefined) => (url ?? '').replace(/^http:\/\//, 'https://')
