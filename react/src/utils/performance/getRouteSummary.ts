/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { PerformanceObject } from './performance'

export type GetRouteSummaryReturn = {
  route: string
  'processTime(AVG)': string
  qtdErrors: string
  qtdRequest: string
  'qtdRequestDay(AVG)': string
}

export const getRouteSummary = (fullData: PerformanceObject[] | null) => {
  if (!fullData) return []
  const dataReturn = {} as any
  const dates = new Set()

  for (const item of fullData) {
    if (!dataReturn[item.routeName]) {
      dataReturn[item.routeName] = {
        processTimeSeconds: 0,
        qtdErrors: 0,
        qtdRequest: 0,
        qtdRequestDay: 0,
      }
    }

    dataReturn[item.routeName].processTimeSeconds += item.processingTime
    if (item.isError) {
      dataReturn[item.routeName].qtdErrors++
    }
    dataReturn[item.routeName].qtdRequestDay++
    dataReturn[item.routeName].qtdRequest++
    dates.add(new Date(item.date).toLocaleDateString())
  }

  // Calcular médias
  for (const route in dataReturn) {
    const totalRequests = dataReturn[route].qtdRequest

    dataReturn[route].qtdRequestDay = Math.round(totalRequests / dates.size)

    dataReturn[route].processTimeSeconds = Math.round(
      dataReturn[route].processTimeSeconds / totalRequests
    )
  }

  const result = Object.entries(dataReturn).map(([route, data]: any) => ({
    route,
    'processTime(AVG)': data.processTimeSeconds.toString(),
    qtdErrors: data.qtdErrors.toString(),
    qtdRequest: data.qtdRequest.toString(),
    'qtdRequestDay(AVG)': data.qtdRequestDay.toString(),
  }))

  return result as GetRouteSummaryReturn[]
}
