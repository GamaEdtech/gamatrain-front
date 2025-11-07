export const useFormatNumber = () => {
  const formatNumber = (value) => {
    if (!value) return '0'
    return new Intl.NumberFormat().format(value)
  }

  return {
    formatNumber,
  }
}
