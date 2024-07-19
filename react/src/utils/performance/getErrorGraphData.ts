import type { GraphTime } from '../../../typings/global'
import { getDataForGraph, getDateHourForGraph } from '../getDateHourForGraph'
import type { PerformanceObject } from './performance'

type GetErrorGraphDataProps = {
  data: PerformanceObject[] | null
  graphTime?: GraphTime
}

export const getErrorGraphData = ({
  data: pData,
  graphTime = 'dateAndHour',
}: GetErrorGraphDataProps) => {
  let graphHeader = ['Date', 'Empty']
  const graphDataDefault = [0, 0]

  if (!pData?.length) return [graphHeader, graphDataDefault]

  graphHeader = []

  const dataReturn = {} as any

  for (const item of pData) {
    const date =
      graphTime === 'dateAndHour'
        ? getDateHourForGraph(new Date(item.date))
        : getDataForGraph(new Date(item.date))

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
