export type LogsAndAlertSettings = {
  mdAccountAlerts: string
  mdEntityAlerts: string
  mdEntityLogs: string
  alertAllowedTypes: string[]
}

export type PaginationType = {
  currentPage: number
  pageSize: number
  currentItemFrom: number
  currentItemTo: number
}

export type PaginationLogsType = {
  tableLength: any | null
  currentPage: any | null
  slicedData: any | null
  currentItemFrom: any | null
  currentItemTo: any | null
  itemsLength: any | null
  emptyStateLabel: any | null
}
