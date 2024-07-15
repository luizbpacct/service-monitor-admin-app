import type { EventContext, IOClients } from '@vtex/api'

type PerformanceLogClassConstructor = {
  ctx: Context | EventContext<IOClients>
  entity?: string
}

type GetDataProps = {
  startDate: string
  endDate: string
  pagination?: {
    page: number
    pageSize: number
  }
  routes: string[]
}

export class PerformanceLogClass {
  private ctx: Context | EventContext<IOClients>
  private entity: string

  constructor({ entity = 'DA', ctx }: PerformanceLogClassConstructor) {
    this.ctx = ctx
    this.entity = entity
  }

  public async getData({
    startDate,
    endDate,
    pagination,
    routes,
  }: GetDataProps) {
    if (!startDate || !endDate) {
      throw new Error(`Invalid startDate or endDate`)
    }

    if (!this.ctx) {
      throw new Error('The ctx has not been informed')
    }

    let where = `date between ${startDate} AND ${endDate}`

    if (routes?.length) {
      let addString = ''

      routes.forEach((route, index) => {
        addString += `routeName=${route}`
        if (routes.length !== index + 1) {
          addString += ` OR `
        }
      })
      where = `${where} AND (${addString})`
    }

    return this.ctx.clients.masterdata.searchDocumentsWithPaginationInfo({
      dataEntity: this.entity,
      fields: [
        'date',
        'isError',
        'msg',
        'objectReturn',
        'requestObject',
        'processingTime',
        'routeName',
      ],
      pagination: {
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 100,
      },
      where,
    })
  }
}
