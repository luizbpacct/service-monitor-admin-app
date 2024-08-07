import type {
  ServiceContext,
  RecorderState,
  ClientsConfig,
  ParamsContext,
} from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { appSettings } from './resolvers/appSettings'
import type {
  AuthenticatedUser,
  UserPermissions,
} from './typings/authenticatedUser'
import { getAuthInfo } from './src/services/getAuthInfo'
import { getPerformanceDataController } from './src/controllers/getPerformanceDataController'

const TIMEOUT_MS = 800
const THREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
    events: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 3,
      timeout: THREE_SECONDS_MS,
      concurrency: CONCURRENCY,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    code: number
    authenticatedUser: (AuthenticatedUser & UserPermissions) | undefined
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  routes: {
    performance: method({
      GET: [getAuthInfo, getPerformanceDataController],
    }),
  },
  graphql: {
    resolvers: {
      Query: {
        appSettings,
      },
    },
  },
})
