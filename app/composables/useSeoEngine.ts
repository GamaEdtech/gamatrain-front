export type SchemaNode = Record<string, unknown> | null | undefined

export type SchemaContext<TDto = unknown> = {
  dto: TDto
  url: string
  title: string
  description: string
  image?: string
  lang?: string
}

export interface BreadCrumb {
  text: string
  disabled: boolean
  href: string
}

export function useSeoSchema() {
  const SITE_URL = 'https://gamatrain.com'
  const LOGO = `${SITE_URL}/android-chrome-512x512-light.png`
  const NAME = 'GamaTrain'

  /**
   * ---------------------------
   * Organization
   * ---------------------------
   */
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': NAME,
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': LOGO,
    },
  }

  /**
   * ---------------------------
   * WebPage
   * ---------------------------
   */
  const createWebPageSchema = (ctx: SchemaContext) => ({
    '@type': 'WebPage',
    '@id': `${ctx.url}#webpage`,
    'url': ctx.url,
    'name': ctx.title,

    'isPartOf': {
      '@id': `${SITE_URL}/#website`,
    },

    'publisher': {
      '@id': `${SITE_URL}/#organization`,
    },

    'about': {
      '@id': `${ctx.url}#primary`,
    },
  })

  /**
   * ---------------------------
   * Article Schema
   * ---------------------------
   */
  const createArticleSchema = <TDto>(dto: TDto, ctx: SchemaContext<TDto>) => {
    const image
      = (dto as Record<string, unknown>)?.lesson_pic
        || (dto as Record<string, unknown>)?.thumb_pic
        || LOGO

    const up_date = (dto as Record<string, unknown>)?.up_date as
      | string
      | undefined

    return {
      '@type': 'Article',
      '@id': `${ctx.url}#article`,
      'headline': ctx.title,
      'description': ctx.description,
      'image': [image],

      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': ctx.url,
      },

      'publisher': {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
      },

      'datePublished': up_date ? new Date(up_date).toISOString() : undefined,

      'dateModified': up_date ? new Date(up_date).toISOString() : undefined,
    }
  }

  /**
   * ---------------------------
   * LearningResource
   * ---------------------------
   */
  const createLearningResourceSchema = <TDto>(
    dto: TDto,
    ctx: SchemaContext<TDto>,
  ) => {
    const content = (dto as Record<string, unknown>)?.content as
      | string
      | undefined

    return {
      '@type': 'LearningResource',
      '@id': `${ctx.url}#learning-resource`,
      'name': ctx.title,
      'url': ctx.url,
      'description': ctx.description,

      'educationalUse': 'Instruction',
      'learningResourceType': 'Lesson',

      'teaches': ctx.title,

      'body': content ? String(content).slice(0, 300) : undefined,

      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${ctx.url}#webpage`,
      },
    }
  }

  /**
   * ---------------------------
   * Breadcrumb Schema
   * ---------------------------
   */
  const createBreadcrumbSchema = (
    items: BreadCrumb[] | undefined,
    baseUrl: string,
  ) => {
    if (!items?.length) return null

    return {
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.text,
        'item': `${baseUrl}${item.href}`,
      })),
    }
  }

  /**
   * ---------------------------
   * SAFE GRAPH BUILDER
   * ---------------------------
   */
  const buildGraph = (...schemas: SchemaNode[]) => {
    return {
      '@context': 'https://schema.org',
      '@graph': schemas.filter(Boolean),
    }
  }

  /**
   * ---------------------------
   * AUTO SCHEMA ENGINE
   * ---------------------------
   */
  const buildSchema = <TDto>(options: {
    dto: TDto
    url: string
    title: string
    description: string
    breadcrumbs?: BreadCrumb[]
    types: Array<'article' | 'webpage' | 'learning' | 'breadcrumb'>
  }) => {
    const ctx: SchemaContext<TDto> = {
      dto: options.dto,
      url: options.url,
      title: options.title,
      description: options.description,
    }

    const schemas: SchemaNode[] = [organizationSchema] // Organization schema as default

    if (options.types.includes('webpage')) {
      schemas.push(createWebPageSchema(ctx))
    }

    if (options.types.includes('article')) {
      schemas.push(createArticleSchema(options.dto, ctx))
    }

    if (options.types.includes('learning')) {
      schemas.push(createLearningResourceSchema(options.dto, ctx))
    }

    if (options.types.includes('breadcrumb')) {
      schemas.push(createBreadcrumbSchema(options.breadcrumbs, options.url))
    }

    return buildGraph(...schemas)
  }

  return {
    organizationSchema,
    createArticleSchema,
    createWebPageSchema,
    createLearningResourceSchema,
    createBreadcrumbSchema,
    buildSchema,
  }
}
