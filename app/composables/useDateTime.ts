type DateInput = string | number | Date | null | undefined

const BACKEND_UTC_DATE_PATTERNS = [
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/,
  /^(?<month>\d{2})\/(?<day>\d{2})\/(?<year>\d{4}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/,
]

export function useDateTime() {
  const { $dayjs } = useNuxtApp()

  const parseBackendUtcDate = (date: string) => {
    for (const pattern of BACKEND_UTC_DATE_PATTERNS) {
      const groups = pattern.exec(date)?.groups

      if (!groups) continue

      const year = Number(groups.year)
      const month = Number(groups.month)
      const day = Number(groups.day)
      const hour = Number(groups.hour)
      const minute = Number(groups.minute)
      const second = Number(groups.second)
      const parsedDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

      if (
        parsedDate.getUTCFullYear() === year
        && parsedDate.getUTCMonth() === month - 1
        && parsedDate.getUTCDate() === day
        && parsedDate.getUTCHours() === hour
        && parsedDate.getUTCMinutes() === minute
        && parsedDate.getUTCSeconds() === second
      ) {
        return parsedDate
      }
    }

    return null
  }

  const local = (date?: DateInput) => {
    if (!date) return null

    if (typeof date === 'string') {
      const parsedDate = parseBackendUtcDate(date)

      if (parsedDate) {
        return $dayjs(parsedDate)
      }
    }

    return $dayjs.utc(date).local()
  }

  const formatLocal = (date?: DateInput, format = 'DD/MM/YYYY HH:mm') => {
    return local(date)?.format(format) ?? ''
  }

  // For values that are already a calendar day (e.g. a "YYYY-MM-DD" bucket the backend computed in the
  // viewer's own time zone) - formatted as-is, with no UTC-to-local shift.
  const formatCalendarDate = (date?: DateInput, format = 'DD/MM/YYYY') => {
    return date ? $dayjs(date).format(format) : ''
  }

  // IANA id of the viewer's own time zone (e.g. "Asia/Tehran"), for endpoints that bucket or filter by
  // the viewer's calendar days. Same lookup dayjs.tz.guess() does, without loading the timezone plugin.
  const localTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

  const fromNowLocal = (date?: DateInput) => {
    return local(date)?.fromNow() ?? ''
  }

  return {
    local,
    formatLocal,
    formatCalendarDate,
    localTimeZone,
    fromNowLocal,
  }
}
