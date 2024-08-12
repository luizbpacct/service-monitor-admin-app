/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useState } from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { FcSearch } from 'react-icons/fc'
import { Table } from 'vtex.styleguide'

import { ModalJsonView } from '../ModalJsonView/Index'
import styles from './index.css'
import useFilters from '../../hook/useFilters'
import type { PerformanceObject } from '../../utils/performance/performance'
import type { PaginationLogsType } from '../../../typings/dashboard'

type TableLogsProps = {
  items: PerformanceObject[]
}

type JsonModalData = {
  title: string
  msg?: string
  json: any
  authType?: string[]
}

export const TableLogs = ({ items }: TableLogsProps) => {
  const tableLength = 15
  const emptyStateLabel = 'Nothing to show.'

  const { filterStatement, filteredItems, filters, setFilterStatement } =
    useFilters<PerformanceObject>(items)

  const [modalJsonView, setModalJsonView] = useState(false)
  const [modalJsonData, setModalJsonData] = useState<JsonModalData>({
    json: null,
    msg: '',
    title: '',
    authType: [],
  })

  const [paginationLogs, setPaginationLogs] = useState<PaginationLogsType>({
    tableLength,
    currentPage: 1,
    slicedData: filteredItems.slice(0, tableLength),
    currentItemFrom: 1,
    currentItemTo: tableLength,
    itemsLength: filteredItems.length,
    emptyStateLabel,
  })

  useEffect(() => {
    setPaginationLogs({
      tableLength,
      currentPage: 1,
      slicedData: filteredItems.slice(0, tableLength),
      currentItemFrom: 1,
      currentItemTo: tableLength,
      itemsLength: filteredItems.length,
      emptyStateLabel,
    })
  }, [filteredItems])

  const goToPage = (
    currentPage: any,
    currentItemFrom: any,
    currentItemTo: any,
    slicedData: any
  ) => {
    setPaginationLogs({
      tableLength,
      currentPage,
      slicedData,
      currentItemFrom,
      currentItemTo,
      itemsLength: filteredItems.length,
      emptyStateLabel,
    })
  }

  const handleNextClick = () => {
    const newPage = paginationLogs.currentPage + 1
    const itemFrom = paginationLogs.currentItemTo + 1
    const itemTo = tableLength * newPage
    const data = filteredItems.slice(itemFrom - 1, itemTo)

    goToPage(newPage, itemFrom, itemTo, data)
  }

  const handlePrevClick = () => {
    if (paginationLogs.currentPage === 0) return
    const newPage = paginationLogs.currentPage - 1
    const itemFrom = paginationLogs.currentItemFrom - tableLength
    const itemTo = paginationLogs.currentItemFrom - 1
    const data = filteredItems.slice(itemFrom - 1, itemTo)

    goToPage(newPage, itemFrom, itemTo, data)
  }

  const getStatusComponent = (value: boolean) => {
    if (value) return <IoCloseCircle size={25} color="red" />

    return <IoCheckmarkCircle size={25} color="green" />
  }

  return (
    <>
      <Table
        containerHeight={516}
        onRowClick={() => {}}
        filters={{
          alwaysVisibleFilters: ['auth', 'processingTime'],
          statements: filterStatement,
          onChangeStatements: (statements: any) => {
            setFilterStatement(statements)
          },
          clearAllFiltersButtonLabel: 'Clear Filters',
          collapseLeft: true,
          options: {
            auth: {
              label: 'Authentications',
              ...filters.auth,
            },
            processingTime: {
              label: 'Processing Time',
              ...filters.processingTime,
            },
          },
        }}
        schema={{
          properties: {
            routeName: {
              title: 'Route',
              width: 300,
            },
            date: {
              title: 'Date',
              cellRenderer: ({ cellData }: any) => {
                return <p>{new Date(cellData)?.toLocaleString()}</p>
              },
              width: 180,
            },
            processingTime: {
              title: 'ms',
              width: 50,
            },
            isError: {
              title: 'Status',
              cellRenderer: ({ cellData }: any) => (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  {getStatusComponent(cellData)}
                </div>
              ),
              width: 60,
            },
            requestObject: {
              title: 'Request',
              width: 70,
              cellRenderer: ({ cellData, rowData }: any) => (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <FcSearch
                    className={`${styles['icon-info']} ${
                      !cellData || cellData === 'null' ? styles.disabled : ''
                    }`}
                    size={25}
                    onClick={() => {
                      if (!cellData || cellData === 'null') return

                      let authType = []

                      try {
                        if (rowData?.authType) {
                          authType.push(...JSON.parse(rowData.authType))
                        }
                      } catch {
                        authType = []
                      }

                      setModalJsonData({
                        title: 'Request',
                        authType,
                        json: JSON.parse(cellData),
                      })
                      setModalJsonView(true)
                    }}
                  />
                </div>
              ),
            },
            returnObject: {
              title: 'Response',
              width: 80,
              cellRenderer: ({ cellData, rowData }: any) => {
                const noData =
                  (!cellData || cellData === 'null') && !rowData?.msg

                return (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <FcSearch
                      className={`${styles['icon-info']} ${
                        noData ? styles.disabled : ''
                      }`}
                      size={25}
                      onClick={() => {
                        if (noData) return

                        setModalJsonData({
                          title: 'Response',
                          msg: rowData?.msg || '',
                          json: cellData ? JSON.parse(cellData) : null,
                        })
                        setModalJsonView(true)
                      }}
                    />
                  </div>
                )
              },
            },
          },
        }}
        items={paginationLogs.slicedData}
        pagination={{
          onNextClick: handleNextClick,
          onPrevClick: handlePrevClick,
          currentItemFrom: paginationLogs.currentItemFrom,
          currentItemTo: paginationLogs.currentItemTo,
          textShowRows: 'Show rows',
          textOf: 'of',
          totalItems: filteredItems.length,
        }}
        fullWidth
        density="medium"
      />
      <ModalJsonView
        isOpen={modalJsonView}
        onClose={() => {
          setModalJsonView(false)
        }}
        authType={modalJsonData.authType}
        jsonData={modalJsonData.json}
        msg={modalJsonData.msg}
        title={modalJsonData.title}
      />
    </>
  )
}
