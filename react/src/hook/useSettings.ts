import { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'

import GET_SETTINGS_VTEX from '../../graphql/query/GET_SETTINGS_VTEX.gql'

export type SettingsType = {
  apps: Array<{
    appName: string
    mdEntityLogs: string
    routes: string[]
  }>
}

export type AppSettingsQueryData = {
  appSettings: SettingsType
}

function useSettings() {
  const { data, loading, error } = useQuery<AppSettingsQueryData>(
    GET_SETTINGS_VTEX,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const [appSettings, setAppSettings] = useState<SettingsType>()

  useEffect(() => {
    if (!data) {
      return
    }

    setAppSettings(data.appSettings)
  }, [data])

  return { appSettings, loading, error }
}

export default useSettings
