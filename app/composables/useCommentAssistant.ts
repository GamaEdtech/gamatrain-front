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

    const userComment = `You are an educational review assistant. Your task is to evaluate the following school and return a structured JSON response.

        ### **School Information:**
        - **Name:** ${schoolData.name}
        - **Location:** ${schoolData.countryTitle}, ${schoolData.stateTitle}, ${schoolData.cityTitle}
        ${schoolData.webSite ? `- **Website:** ${schoolData.webSite}` : ''}

        ### **Evaluation Criteria:**
        Rate each of the following aspects on a scale of 1 to 5 stars (as numbers) using insights from sources like OpenStreetMap, Google Maps, and the school's official website. Then write a short, bold, and slightly provocative comment about the school.

        1. Quality of classrooms and educational facilities
        2. Teachers' proficiency and teaching effectiveness
        3. Access to and use of computers and technology
        4. Safety and overall atmosphere of the school
        5. Behavior of school officials towards students
        6. Affordability relative to the services provided
        7. Availability of suitable sports facilities
        8. Presence of art classes or counseling programs

        ### **Comment Rules:**
        - Write the **comment in the primary language used in** \`${schoolData.countryTitle}\`. For example, use Persian for Iran, Italian for Italy, and French for France. **Do not use the user's IP address, browser language, or environment to determine the language.**
        - Mention at least **one clear strength and one clear weakness** of the school.
        - Use a **natural, human tone** with a **touch of challenge or controversy** to encourage discussion (e.g., “some parents might disagree…” or “not everyone would be happy with…”).
        - Keep the comment **short, engaging, and between 350 and 400 characters**.
        - The comment should **not repeat the school name or location**.
        - If it's a **kindergarten**, write like a thoughtful parent.
          If it's an **educational group**, use inclusive and general language.
        - Always **end the comment with at least one emoji** to feel more personal and real.

        ### **Response Format (JSON):**
        Return a structured JSON object like this, with exactly 8 rating fields (1 to 5) and the comment:

        \`\`\`json
        {
          "description": "🏫 Cornerstone Preparatory School offers a great learning environment with skilled teachers and strong safety measures. However, technology access and arts programs could be improved.",
          "ratings": {
            "classrooms_quality": 4,
            "teachers_proficiency": 5,
            "technology_access": 2,
            "school_safety": 4,
            "officials_behavior": 3,
            "affordability": 4,
            "sports_facilities": 3,
            "art_counseling": 2
          }
        }
        \`\`\`
        `

    if (!localStorage.getItem('token')) {
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
