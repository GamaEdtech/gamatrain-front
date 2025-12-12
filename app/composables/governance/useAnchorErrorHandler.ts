const anchorErrorMessages: Record<number, string> = {
  6000: 'You are not authorized to perform this action.',
  6001: 'You have already voted on this proposal.',
  6002: 'This proposal has expired and can no longer be voted on.',
  6003: 'Holders of $GET tokens can participate in voting—grab some $GET to have your say!',
  6007: 'Insufficient staked tokens. Please stake more tokens to perform this action.',
  6008: 'You must stake tokens to participate in governance. Please stake some $GET tokens first.',
  6010: 'Cooldown period is still active. Please wait before claiming your unstaked tokens.',
  6011: 'Nothing to claim. No pending unstake found.',
  6012: 'You already have a pending unstake request. Please claim your tokens first before unstaking again.',
}

export const useAnchorErrorHandler = () => {
  const parseAnchorError = (err: unknown) => {
    let raw = ''

    if (typeof err === 'string') {
      raw = err
    }
    else if (err instanceof Error && typeof err.message === 'string') {
      raw = err.message
    }
    else if (err && typeof err === 'object') {
      try {
        raw = err.toString?.() || ''
      }
      catch {
        raw = ''
      }
    }

    if (!raw) {
      return {
        errorCode: null,
        errorNumber: null,
      }
    }

    const codeMatch = raw.match(/Error Code: ([A-Za-z0-9_]+)/)
    const errorCode = codeMatch ? codeMatch[1] : null

    const numMatch = raw.match(/Error Number: (\d+)/)
    const errorNumber = numMatch ? Number(numMatch[1]) : null

    return {
      errorCode,
      errorNumber,
    }
  }

  const handleAnchorError = (err: unknown): string => {
    const parsed = parseAnchorError(err)

    if (!parsed.errorCode && !parsed.errorNumber) {
      return 'An unexpected error occurred. Please try again.'
    }

    if (parsed.errorNumber && anchorErrorMessages[parsed.errorNumber]) {
      return anchorErrorMessages[parsed.errorNumber] as string
    }

    return 'An unknown error occurred.'
  }

  return { handleAnchorError }
}
