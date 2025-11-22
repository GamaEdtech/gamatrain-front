/**
 * Composable for safe image loading with fallback handling
 * Helps prevent issues with case-sensitive file systems
 */

export const useSafeImage = () => {
  const validateImagePath = async (imagePath) => {
    if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return { isValid: true, path: imagePath }
    }

    try {
      // In development, try to validate the path
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch(imagePath, { method: 'HEAD' })
        if (!response.ok) {
          console.warn(`🚨 Image not found: ${imagePath}`)
          console.warn('💡 Check if file exists with exact case match')
          return { isValid: false, path: imagePath, error: 'File not found' }
        }
      }

      return { isValid: true, path: imagePath }
    }
    catch (error) {
      console.warn(`🚨 Error validating image path: ${imagePath}`, error)
      return { isValid: false, path: imagePath, error: error.message }
    }
  }

  const getSafeImagePath = (imagePath, fallbackPath = '/images/placeholder.png') => {
    // Basic path normalization
    if (!imagePath) return fallbackPath

    // Remove double slashes
    const normalizedPath = imagePath.replace(/\/+/g, '/')

    return normalizedPath
  }

  const createImageLoadHandler = (onError = null) => {
    return (event) => {
      const img = event.target
      const src = img.src

      console.warn(`🚨 Failed to load image: ${src}`)
      console.warn('💡 Possible case sensitivity issue - check file name case')

      if (onError) {
        onError(event)
      }
    }
  }

  return {
    validateImagePath,
    getSafeImagePath,
    createImageLoadHandler,
  }
}
