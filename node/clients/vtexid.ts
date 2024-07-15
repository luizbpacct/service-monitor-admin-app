import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { AuthenticatedUser } from '../typings/authenticatedUser'
import { UserCache } from '../src/utils/userCache'

export default class VtexId extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://vtexid.vtex.com.br/api/', context, options)
  }

  public async getAuthenticatedUser(
    authToken: string
  ): Promise<AuthenticatedUser> {
    return UserCache.getOrSet(authToken, () =>
      this.http
        .get('vtexid/pub/authenticated/user/', {
          params: { authToken },
          metric: 'authenticated-user-get',
        })
        .then((res) => {
          return {
            value: res,
            maxAge: 1000 * 60 * 5,
          }
        })
    ) as Promise<AuthenticatedUser>
  }
}
