export const getDataForGraph = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day}/${month}`
}

export const getDateHourForGraph = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')

  return `${day}/${month} às ${hour}h`
}

export const getHourForGraph = (date: Date) => {
  const hours = date.getHours()
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedTime = `${hours % 12 || 12}:00 ${period}`

  return formattedTime
}
