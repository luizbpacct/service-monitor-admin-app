/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext } from 'react'
import { ApolloError } from 'apollo-client'

import useSettings, { SettingsType } from '../hook/useSettings'

interface TypeFormGlobalContext {
  appSettings: SettingsType | undefined
  loading: boolean
  error: ApolloError | undefined
}

const FormGlobalContext = createContext<TypeFormGlobalContext | null>(null)

const FormGlobalProvider: React.FunctionComponent = ({ children }) => {
  const { loading, appSettings, error } = useSettings()

  return (
    <FormGlobalContext.Provider
      value={{
        loading,
        appSettings,
        error,
      }}
    >
      {children}
    </FormGlobalContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormGlobalContext)

  if (!context) {
    throw new Error('useFormContext must be used within a FormGlobalProvider')
  }

  return context
}

export default FormGlobalProvider
