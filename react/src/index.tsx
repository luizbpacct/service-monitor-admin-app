import React from 'react'
import { Layout, PageBlock } from 'vtex.styleguide'

import FormGlobalProvider from './contexts/FormGlobalContext'
import MainComponent from './components/MainComponent'
import styles from './index.css'

const AutoServiceApi = () => {
  return (
    <Layout>
      <FormGlobalProvider>
        <div className={styles['pageblock-container']}>
          <PageBlock
            title={
              <span className={styles['pageblock-title']}>Service Monitor</span>
            }
            subtitle={<span className={styles['pageblock-subtitle']} />}
            variation="full"
          >
            <MainComponent />
          </PageBlock>
        </div>
      </FormGlobalProvider>
    </Layout>
  )
}

export default AutoServiceApi
