export const MS_PER_DAY = 86_400_000

export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDateLabel = (dateString) => {
  if (!dateString) {
    return null
  }

  const today = getLocalDateString()
  const tomorrow = getLocalDateString(new Date(Date.now() + MS_PER_DAY))

  if (dateString === today) {
    return 'Hoje'
  }

  if (dateString === tomorrow) {
    return 'Amanhã'
  }

  const [year, month, day] = dateString.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export const isWithinNextSevenDays = (dateString, reference = new Date()) => {
  if (!dateString) {
    return false
  }

  const referenceStr = getLocalDateString(reference)
  const [year, month, day] = dateString.split('-')
  const candidate = new Date(Number(year), Number(month) - 1, Number(day))

  const referenceDate = new Date(referenceStr)
  const maxDate = new Date(referenceDate)
  maxDate.setDate(referenceDate.getDate() + 7)

  return candidate >= referenceDate && candidate <= maxDate
}
