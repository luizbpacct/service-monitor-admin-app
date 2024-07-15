import React, { useState } from 'react'
import { Spinner, Tab, Tabs } from 'vtex.styleguide'

import { useFormContext } from '../../contexts/FormGlobalContext'
import styles from './index.css'
import Dashboard from '../Dashboard'

const MainComponent = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const { loading, appSettings } = useFormContext()

  if (loading) {
    return (
      <div className={styles.loadSpinner}>
        <Spinner color="#3F3F40" />
      </div>
    )
  }

  if (!appSettings) {
    return (
      <div className={styles.loadSpinner}>
        <p>No records found</p>
      </div>
    )
  }

  const { apps } = appSettings

  return (
    <>
      <Tabs>
        {apps?.map((app, index) => {
          return (
            <Tab
              key={app.appName}
              label={app.appName}
              active={currentTab === index}
              onClick={() => setCurrentTab(index)}
            >
              <Dashboard entity={app.mdEntityLogs} routes={app.routes || []} />
            </Tab>
          )
        })}
      </Tabs>
    </>
  )
}

export default MainComponent
