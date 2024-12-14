export function toISODateWithTime(date) {
  date = new Date(date)
  // Получаем компоненты года, месяца и дня
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const day = String(date.getDate()).padStart(2, '0')

  // Формируем строку ISO с фиктивным временем
  return `${year}-${month}-${day}`
}