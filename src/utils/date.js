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

// Retorna o nome do dia em português
export const getDayName = (date) => {
  const today = getLocalDateString()
  const tomorrow = getLocalDateString(new Date(Date.now() + MS_PER_DAY))
  const dateStr = getLocalDateString(date)

  if (dateStr === today) {
    return 'Hoje'
  }

  if (dateStr === tomorrow) {
    return 'Amanhã'
  }

  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  return dayNames[date.getDay()]
}

// Formata cabeçalho da coluna: "Nov 3 · Hoje"
export const formatColumnHeader = (date) => {
  const dayName = getDayName(date)
  const formatted = date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  // Capitaliza primeira letra do mês
  const parts = formatted.split(' ')
  parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)

  return `${parts[1]} ${parts[0]} · ${dayName}`
}

// Retorna array de N dias a partir de uma data inicial
export const getWeekDays = (startDate = new Date(), count = 6) => {
  const days = []
  const current = new Date(startDate)

  // Normaliza para meia-noite
  current.setHours(0, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

// Adiciona/subtrai dias de uma data
export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
