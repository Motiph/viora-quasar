import { parse, differenceInMinutes, format } from "date-fns"

/**
 * Devuelve la hora de inicio en formato 12h (ej. "6:00 PM")
 */
export const getStartTime = (start: string): string => {
  const startDate = parse(start, "HH:mm:ss", new Date())
  return format(startDate, "h:mm a")
}

/**
 * Devuelve la duración de la clase en minutos
 * Considera clases que cruzan medianoche
 */
export const getClassDuration = (start: string, end: string): number => {
  const startDate = parse(start, "HH:mm:ss", new Date())
  const endDate = parse(end, "HH:mm:ss", new Date())

  let duration = differenceInMinutes(endDate, startDate)

  if (duration < 0) {
    // Si cruza medianoche, sumamos 24 horas al endDate
    duration = differenceInMinutes(
      new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
      startDate
    )
  }

  return duration
}