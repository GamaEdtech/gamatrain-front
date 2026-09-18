export const useHtmlSanitizer = () => {
  const blockedTags = [
    'base',
    'button',
    'embed',
    'form',
    'iframe',
    'input',
    'link',
    'math',
    'meta',
    'object',
    'option',
    'script',
    'select',
    'style',
    'svg',
    'textarea',
  ]

  const urlAttributes = [
    'action',
    'formaction',
    'href',
    'src',
    'xlink:href',
  ]

  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  const sanitizeTextForHtml = (value: string) => {
    return escapeHtml(value.trim())
  }

  const isUnsafeUrl = (value: string) => {
    const normalizedValue = Array.from(value.trim())
      .filter((character) => {
        const charCode = character.charCodeAt(0)
        return charCode > 31 && charCode !== 127 && !/\s/.test(character)
      })
      .join('')
      .toLowerCase()

    return normalizedValue.startsWith('javascript:')
      || normalizedValue.startsWith('vbscript:')
      || normalizedValue.startsWith('data:')
  }

  const sanitizeHtml = (html: string) => {
    if (!import.meta.client) {
      return sanitizeTextForHtml(html)
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    doc.querySelectorAll(blockedTags.join(',')).forEach((element) => {
      element.remove()
    })

    doc.body.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        const attributeName = attribute.name.toLowerCase()

        if (attributeName.startsWith('on') || attributeName === 'srcdoc') {
          element.removeAttribute(attribute.name)
          return
        }

        if (urlAttributes.includes(attributeName) && isUnsafeUrl(attribute.value)) {
          element.removeAttribute(attribute.name)
        }
      })
    })

    return doc.body.innerHTML.trim()
  }

  return {
    sanitizeHtml,
    sanitizeTextForHtml,
  }
}
