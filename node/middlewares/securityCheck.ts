import { errorDefault } from '../src/utils/errorDefault'
import type { AccessType } from '../typings/authenticatedUser'

type SecurityCheckParams = {
  ctx: Context
  accessType: AccessType[]
}

export const securityCheck = async ({
  ctx,
  accessType,
}: SecurityCheckParams): Promise<boolean> => {
  try {
    const permissionsUser = ctx.state.authenticatedUser?.permissions

    return !!accessType?.find((pAccessType) => {
      return permissionsUser?.includes(pAccessType)
    })
  } catch (error) {
    errorDefault(ctx, error)
  }

  return false
}
