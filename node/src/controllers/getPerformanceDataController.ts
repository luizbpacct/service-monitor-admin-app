import { ServiceMonitorClass } from '@lcbp/smonitorpkg'

import { securityCheck } from '../../middlewares/securityCheck'
import { errorDefault } from '../utils/errorDefault'

const getPerformanceDataController = async (ctx: Context) => {
  try {
    const isUserValid = await securityCheck({
      ctx,
      accessType: ['ADMIN'],
    })

    if (!isUserValid) {
      errorDefault(ctx, 'User not access')

      return
    }

    const startDate = ctx.query?.startDate as string
    const entity = ctx.query?.entity as string
    const endDate = ctx.query?.endDate as string
    const routes = ctx.query?.routes as string
    const page = ctx.query?.page ? parseInt(ctx.query.page as string, 10) : 1
    const pageSize = ctx.query?.pageSize
      ? parseInt(ctx.query?.pageSize as string, 10)
      : 100

    if (!startDate || !endDate) {
      ctx.status = 400
      ctx.body = {
        msg: 'The start date or end date is invalid',
      }

      return
    }

    const performanceObject = new ServiceMonitorClass()

    ctx.body = await performanceObject.getData({
      ctx,
      entity,
      data: {
        startDate,
        endDate,
        routes: routes ? routes.split(',') : [],
        pagination: {
          page,
          pageSize,
        },
        sort: 'date DESC',
      },
    })
  } catch (err) {
    errorDefault(ctx, err)
  }
}

export { getPerformanceDataController }
