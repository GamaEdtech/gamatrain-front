import type { ProfileLevel, ProfileQuestCode } from '@/types'

/** Profile levels, lowest first, as the backend orders them (`UserRateLevel`). */
export const PROFILE_LEVELS: ProfileLevel[] = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Complete']

/** 1-based place of a level, for "Level 3 of 5". */
export const profileLevelNumber = (level: ProfileLevel) => PROFILE_LEVELS.indexOf(level) + 1

/** What each quest asks for. Written for students first; it reads fine for teachers too. */
export const PROFILE_QUESTS: Record<ProfileQuestCode, { title: string, hint: string }> = {
  avatar: { title: 'Add a profile photo', hint: 'A clear photo of you, so classmates and teachers know it\'s you' },
  firstName: { title: 'Add your first name', hint: 'Shown on your profile' },
  lastName: { title: 'Add your last name', hint: 'Shown on your profile' },
  currentStatusSentence: { title: 'Say what you\'re working towards', hint: 'One line, like "IGCSE in June, aiming for an A in Physics"' },
  biography: { title: 'Write a short bio', hint: '50 characters or more about you and what you like to study' },
  skills: { title: 'Add subjects you\'re good at', hint: 'Shown as skills on your profile' },
  experience: { title: 'Add a school you\'ve studied or worked at', hint: 'Your school history, with the years you were there' },
}
