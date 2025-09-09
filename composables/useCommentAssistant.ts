interface SchoolData {
  name: string
  countryTitle: string
  stateTitle: string
  cityTitle: string
  webSite?: string
  latitude?: number
  longitude?: number
}

interface SchoolRatings {
  classrooms_quality: number
  teachers_proficiency: number
  technology_access: number
  school_safety: number
  officials_behavior: number
  affordability: number
  sports_facilities: number
  art_counseling: number
}

interface SchoolAiParsedResponse {
  description: string
  ratings: SchoolRatings
}

interface SchoolAiApiResponse {
  response: string
}

export const useCommentAssistant = () => {
  const loading = ref(false)

  const getDescriptionFromAi = async (schoolData: SchoolData) => {
    const nuxtApp = useNuxtApp()
    const router = useRouter()

    const userComment = `You are an expert educational research analyst with deep knowledge of international school systems. Your task is to conduct thorough research on the following school and provide a comprehensive evaluation.

## RESEARCH MANDATE:
You MUST conduct DEEP research on this school by examining multiple data sources:

1. Search Google Maps for "${schoolData.name} ${schoolData.cityTitle} ${schoolData.countryTitle}" and analyze ALL available reviews, ratings, and photos
2. Examine OpenStreetMap data and associated geolocation information
3. Research local education forums, parent groups, and review sites specific to ${schoolData.countryTitle}
4. Analyze the school's official website (if available) and social media presence
5. Search for news articles, educational reports, or government evaluations

## SCHOOL INFORMATION:
- *Name:* ${schoolData.name}
- *Location:* ${schoolData.countryTitle}, ${schoolData.stateTitle}, ${schoolData.cityTitle}
${(schoolData.latitude && schoolData.longitude) ? '- Coordinates' + schoolData.latitude + ',' + schoolData.longitude : ''}
  }
${schoolData.webSite ? 'Website ' + schoolData.webSite : ''}

## RESEARCH INSTRUCTIONS:
You MUST perform ACTUAL research by:
  1. Searching for this specific school across multiple platforms
  2. Reading through at least 10 - 15 reviews from different sources
  3. Identifying patterns in feedback(both positive and negative)
  4. Analyzing visual evidence from photos when available
  5. Cross - referencing information between different sources
  6. Considering cultural and regional educational context of ${schoolData.countryTitle}

## EVALUATION CRITERIA:
Based on your research, rate each aspect(1 - 5 stars):

  1. Classrooms & Facilities Quality
  2. Teaching Proficiency & Effectiveness
  3. Technology Access & Integration
  4. Safety & School Atmosphere
  5. Officials' Behavior & Administration
  6. Affordability & Value
  7. Sports Facilities & Programs
  8. Arts & Counseling Programs

## COMMENT REQUIREMENTS:
  - Write in the primary language of ${schoolData.countryTitle}
  - Base your analysis SPECIFICALLY on patterns found in actual reviews
    - Reference at least 2 - 3 specific points mentioned in reviews
      - Use a natural, human tone - avoid robotic language
        - Include both strengths and weaknesses mentioned by multiple reviewers
          - Keep the comment between 400 - 500 characters
            - DO NOT use emojis
              - DO NOT make generic statements without research backing

## RESPONSE FORMAT:
Return ONLY valid JSON without any additional text:

  {
    "description": "Research-based analysis here...",
      "ratings": {
      "classrooms_quality": 4,
        "teachers_proficiency": 4,
          "technology_access": 3,
            "school_safety": 5,
              "officials_behavior": 4,
                "affordability": 3,
                  "sports_facilities": 2,
                    "art_counseling": 4
    }
  }
`

    if (!localStorage.getItem('v2_token')) {
      nuxtApp.$toast?.error('Login required to proceed.')
      router.push({ query: { auth_form: 'login' } })
      return
    }

    if (!userComment) {
      nuxtApp.$toast?.error('Sorry, insufficient data')
      return
    }

    loading.value = true
    try {
      const apiResponse = await useApiService.post<SchoolAiApiResponse>('/api/chatgpt', { userComment })
      const cleanedResponse = apiResponse.response
        .replace(/^\s*```json[\s\S]*?\n/, '')
        .replace(/```$/, '')
      const parsedResponse: SchoolAiParsedResponse = JSON.parse(cleanedResponse)
      return parsedResponse
    }
    catch (err) {
      nuxtApp.$toast?.error('Error: Failed to get AI response.')
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    getDescriptionFromAi,
  }
}
