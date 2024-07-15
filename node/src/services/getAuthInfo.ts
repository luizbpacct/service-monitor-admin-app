/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {
  AccessType,
  AuthenticatedUser,
} from '../../typings/authenticatedUser'
import { errorDefault } from '../utils/errorDefault'

export async function getAuthInfo(ctx: Context, next?: () => Promise<unknown>) {
  const {
    clients: { vtexid },
    vtex: { storeUserAuthToken, adminUserAuthToken },
  } = ctx

  try {
    let authenticatedStoreUser: AuthenticatedUser | undefined
    let authenticatedAdminUser: AuthenticatedUser | undefined
    const vtexCredentialsAuth = false
    let permissions: AccessType[] = []

    if (storeUserAuthToken) {
      authenticatedStoreUser = await vtexid.getAuthenticatedUser(
        storeUserAuthToken
      )
    }

    if (adminUserAuthToken) {
      authenticatedAdminUser = await vtexid.getAuthenticatedUser(
        adminUserAuthToken
      )
    }

    permissions = ['ADMIN', 'STORE'].filter((pAccessType) => {
      switch (pAccessType) {
        case 'ADMIN':
          return !!authenticatedAdminUser

        case 'STORE':
          return !!authenticatedStoreUser

        default:
          return false
      }
    }) as AccessType[]

    ctx.state.authenticatedUser =
      authenticatedStoreUser || authenticatedAdminUser || vtexCredentialsAuth
        ? {
            user: authenticatedStoreUser
              ? authenticatedStoreUser.user
              : authenticatedAdminUser?.user || '',
            userId: authenticatedStoreUser
              ? authenticatedStoreUser.userId
              : authenticatedAdminUser?.userId || '',
            permissions,
          }
        : undefined

    if (next) {
      await next()
    }
  } catch (err) {
    errorDefault(ctx, err)
  }
}
