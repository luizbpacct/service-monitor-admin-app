import { PerformanceObject } from './performance'

export const getErrorGraphData = (fullData: PerformanceObject[] | null) => {
  let graphHeader = ['Date', 'Empty']
  const graphDataDefault = [0, 0]

  if (!fullData?.length) return [graphHeader, graphDataDefault]

  graphHeader = []

  const dataReturn = {} as any

  for (const item of fullData) {
    const date = new Date(item.date).toLocaleDateString()

    if (!graphHeader.includes(item.routeName.trim())) {
      graphHeader.push(item.routeName.trim())
    }

    if (!dataReturn[date]) {
      dataReturn[date] = {}
    }

    if (!dataReturn[date][item.routeName]) {
      dataReturn[date][item.routeName] = {
        errors: 0,
      }
    }

    if (item.isError) {
      dataReturn[date][item.routeName].errors++
    }
  }

  // Formatar o resultado no formato desejado
  let result: any = []
  Object.entries(dataReturn).forEach(([date, routes]: any) => {
    const data = [date]
    graphHeader.forEach((header) => {
      if (!routes[header]) data.push(0)
      else data.push(routes[header].errors)
    })
    result.push(data)
  })

  result = [['Date', ...graphHeader], ...result]

  return result
}
