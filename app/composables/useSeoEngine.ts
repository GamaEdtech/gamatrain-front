export type SchemaNode = Record<string, unknown> | null | undefined

export type SchemaContext<TDto = unknown> = {
  dto: TDto
  url: string
  title: string
  description: string
  image?: string
  lang?: string
  body?: string
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
   * Organization Schema
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
   * WebPage Schema
   * ---------------------------
   */
  const ABOUT_MAP = {
    'article': '#article',
    'learning': '#learning-resource',
    'article-learning': '#learning-resource',
    'quiz': '#quiz',
    'webpage': '#primary',
  } as const
  const TYPE_PRIORITY = [
    'article-learning',
    'article',
    'learning',
    'quiz',
    'webpage',
  ] as const

  const getAboutFragment = (types: string[]) => {
    for (const type of TYPE_PRIORITY) {
      if (types.includes(type)) {
        return ABOUT_MAP[type]
      }
    }

    return '#primary'
  }

  const createWebPageSchema = (
    ctx: SchemaContext,
    aboutFragment: string,
  ) => ({
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
      '@id': `${ctx.url}${aboutFragment}`,
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
        '@id': `${ctx.url}`,
      },

      'publisher': {
        '@id': `${SITE_URL}/#organization`,
      },

      'datePublished': up_date || undefined,

      'dateModified': up_date || undefined,
    }
  }

  /**
   * ---------------------------
   * LearningResource Schema
   * ---------------------------
   */
  const createLearningResourceSchema = <TDto>(
    dto: TDto,
    ctx: SchemaContext<TDto>,
  ) => {
    const up_date = (dto as Record<string, unknown>)?.up_date as
      | string
      | undefined

    const course = (dto as Record<string, unknown>)?.course as
      | string
      | undefined

    const headline = (dto as Record<string, unknown>)?.title as
      | string
      | undefined

    return {
      '@type': 'LearningResource',
      '@id': `${ctx.url}#learning-resource`,
      'name': ctx.title,
      'url': ctx.url,
      'description': ctx.description,

      'body': ctx.body || undefined,

      'educationalUse': 'Instruction',
      'learningResourceType': 'Lesson',
      'educationalLevel': course && course !== '0' ? course : undefined,
      'teaches': headline,
      'datePublished': up_date || undefined,
      'inLanguage': ctx.lang || 'en',

      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${ctx.url}`,
      },

      'publisher': {
        '@id': `${SITE_URL}/#organization`,
      },
    }
  }

  /**
   * ---------------------------
   * Article - LearningResource Schema
   * ---------------------------
   */
  const createArticleLearningResourceSchema = <TDto>(
    dto: TDto,
    ctx: SchemaContext<TDto>,
  ) => {
    const article = createArticleSchema(dto, ctx)
    const learning = createLearningResourceSchema(dto, ctx)

    const {
      '@type': _articleType,
      '@id': _articleId,
    } = article

    const {
      '@type': _learningType,
      '@id': _learningId,
      body: _body,
      mainEntityOfPage: _mainEntityOfPage,
      publisher: _publisher,
      ...learningProps
    } = learning

    return {
      '@type': ['Article', 'LearningResource'],
      '@id': `${ctx.url}#learning-resource`,

      'articleBody': learning.body,

      ...learningProps,
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
   * Quiz Schema
   * ---------------------------
   */
  const createQuizSchema = (dto: unknown, ctx: SchemaContext) => {
    const data = dto as Record<string, unknown>

    const question = data.question
    if (typeof question !== 'string') {
      return null
    }

    const answers = [data.answer_a, data.answer_b, data.answer_c, data.answer_d]
      .filter((a): a is string => typeof a === 'string' && a.length > 0)
      .map((text, index) => ({
        '@type': 'Answer',
        'position': index + 1,
        'encodingFormat': 'text/html',
        text,
      }))

    const correctIndex = Number(data.true_answer) - 1
    const acceptedAnswer = answers[correctIndex]

    return {
      '@type': 'Quiz',
      '@id': `${ctx.url}#quiz`,
      'inLanguage': ctx.lang || 'en',
      'learningResourceType': 'Assessment',

      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${ctx.url}`,
      },

      'publisher': {
        '@id': `${SITE_URL}/#organization`,
      },

      'hasPart': {
        '@type': 'Question',
        'eduQuestionType': 'Multiple choice',
        'learningResourceType': 'Practice Problem',
        'encodingFormat': 'text/html',

        'image': typeof data.q_file === 'string' ? data.q_file : undefined,
        'text': question,
        'suggestedAnswer': answers,
        acceptedAnswer,
      },
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
      '@graph': schemas.filter((s): s is Record<string, unknown> => Boolean(s)),
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
    body?: string
    breadcrumbs?: BreadCrumb[]
    types: Array<
      | 'webpage'
      | 'article'
      | 'learning'
      | 'article-learning'
      | 'breadcrumb'
      | 'quiz'
    >
  }) => {
    const ctx: SchemaContext<TDto> = {
      dto: options.dto,
      url: options.url,
      title: options.title,
      description: options.description,
      body: options.body,
    }

    const schemas: SchemaNode[] = [organizationSchema] // Organization schema as default

    const aboutFragment = getAboutFragment(options.types)

    if (options.types.includes('webpage')) {
      schemas.push(createWebPageSchema(ctx, aboutFragment))
    }

    if (options.types.includes('article')) {
      schemas.push(createArticleSchema(options.dto, ctx))
    }

    if (options.types.includes('learning')) {
      schemas.push(createLearningResourceSchema(options.dto, ctx))
    }

    if (options.types.includes('article-learning')) {
      schemas.push(createArticleLearningResourceSchema(options.dto, ctx))
    }

    if (options.types.includes('breadcrumb')) {
      schemas.push(createBreadcrumbSchema(options.breadcrumbs, options.url))
    }

    if (options.types.includes('quiz')) {
      schemas.push(createQuizSchema(options.dto, ctx))
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
