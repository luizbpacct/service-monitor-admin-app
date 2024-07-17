import type { PerformanceObject } from '../utils/performance/performance'

type GetPerformanceDataProps = {
  initialDate: Date
  finalDate: Date
  selectRoutes: string[]
  pagination?: {
    page: number
    pageSize: number
  }
  entity: string
}

type GetPerformanceDataResponse = {
  data: PerformanceObject[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const getPerformanceData = async ({
  finalDate,
  initialDate,
  selectRoutes,
  pagination,
  entity,
}: GetPerformanceDataProps): Promise<GetPerformanceDataResponse> => {
  finalDate.setHours(23, 59, 59)
  initialDate.setHours(0, 0, 0)

  let path = `?entity=${entity}&startDate=${initialDate.toISOString()}&endDate=${finalDate.toISOString()}&routes=${selectRoutes.join(
    ','
  )}`

  if (pagination) {
    path += `&page=${pagination.page}&pageSize=${pagination.pageSize}`
  }

  const result = await fetch(
    `/api/io/v1/servicemonitor/status/performance${path}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )

  return result.json()
}
