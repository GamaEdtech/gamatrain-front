export const useSound = () => {
  const playSound = (soundPath: string, volume = 1.0) => {
    try {
      const audio = new Audio(soundPath)
      audio.volume = volume
      audio.play()
      return audio
    }
    catch (error) {
      console.error('Error playing sound:', error)
      return null
    }
  }

  return {
    playSound,
  }
}
