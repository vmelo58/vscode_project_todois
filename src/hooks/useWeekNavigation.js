import { useCallback, useMemo, useState } from 'react'
import { addDays, getLocalDateString, getWeekDays } from '../utils/date.js'

export const useWeekNavigation = (daysCount = 6) => {
  // Estado: data inicial da semana (começa com hoje)
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  // Calcula os dias da semana atual
  const weekDays = useMemo(() => {
    return getWeekDays(weekStart, daysCount)
  }, [weekStart, daysCount])

  // Vai para próxima semana
  const nextWeek = useCallback(() => {
    setWeekStart((current) => addDays(current, 7))
  }, [])

  // Vai para semana anterior
  const prevWeek = useCallback(() => {
    setWeekStart((current) => addDays(current, -7))
  }, [])

  // Volta para semana atual (hoje)
  const goToToday = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setWeekStart(today)
  }, [])

  // Verifica se está na semana atual
  const isCurrentWeek = useMemo(() => {
    const today = getLocalDateString()
    const weekStartStr = getLocalDateString(weekStart)
    const weekEndStr = getLocalDateString(addDays(weekStart, daysCount - 1))

    return today >= weekStartStr && today <= weekEndStr
  }, [weekStart, daysCount])

  return {
    weekDays,
    weekStart,
    nextWeek,
    prevWeek,
    goToToday,
    isCurrentWeek,
  }
}
