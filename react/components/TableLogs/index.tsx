/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useState } from 'react'
import { FcInfo } from 'react-icons/fc'
import { Table, Tag } from 'vtex.styleguide'

import { ModalJsonView } from '../ModalJsonView/Index'
import styles from './index.css'
import { PaginationLogsType } from '../../typings/dashboard'

type TableLogsProps = {
  items: any
}

export const TableLogs = ({ items }: TableLogsProps) => {
  const tableLength = 15
  const emptyStateLabel = 'Nothing to show.'

  const [modalJsonView, setModalJsonView] = useState(false)
  const [currentJson, setCurrentJson] = useState<any>(null)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [paginationLogs, setPaginationLogs] = useState<PaginationLogsType>({
    tableLength,
    currentPage: 1,
    slicedData: items.slice(0, tableLength),
    currentItemFrom: 1,
    currentItemTo: tableLength,
    itemsLength: items.length,
    emptyStateLabel,
  })

  useEffect(() => {
    setPaginationLogs({
      tableLength,
      currentPage: 1,
      slicedData: items.slice(0, tableLength),
      currentItemFrom: 1,
      currentItemTo: tableLength,
      itemsLength: items.length,
      emptyStateLabel,
    })
  }, [items])

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
      itemsLength: items.length,
      emptyStateLabel,
    })
  }

  const handleNextClick = () => {
    const newPage = paginationLogs.currentPage + 1
    const itemFrom = paginationLogs.currentItemTo + 1
    const itemTo = tableLength * newPage
    const data = items.slice(itemFrom - 1, itemTo)
    goToPage(newPage, itemFrom, itemTo, data)
  }

  const handlePrevClick = () => {
    if (paginationLogs.currentPage === 0) return
    const newPage = paginationLogs.currentPage - 1
    const itemFrom = paginationLogs.currentItemFrom - tableLength
    const itemTo = paginationLogs.currentItemFrom - 1
    const data = items.slice(itemFrom - 1, itemTo)
    goToPage(newPage, itemFrom, itemTo, data)
  }

  return (
    <>
      <Table
        schema={{
          properties: {
            routeName: {
              title: 'Route',
            },
            date: {
              title: 'Date',
              cellRenderer: ({ cellData }: any) => {
                return <p>{new Date(cellData)?.toLocaleString()}</p>
              },
              width: 200,
            },
            processingTime: {
              title: 'Process time',
              width: 100,
            },
            isError: {
              title: 'Error',
              cellRenderer: ({ cellData }: any) => (
                <Tag type={`${cellData ? 'error' : 'success'}`}>
                  {cellData ? 'Error' : 'Success'}
                </Tag>
              ),
            },
            requestObject: {
              title: 'Request Object',
              cellRenderer: ({ cellData }: any) => (
                <div
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <FcInfo
                    className={`${styles['icon-info']} ${
                      !cellData || cellData === 'null' ? styles.disabled : ''
                    }`}
                    size={25}
                    onClick={() => {
                      if (!cellData || cellData === 'null') return

                      setCurrentJson(JSON.parse(cellData))
                      setModalJsonView(true)
                    }}
                  />
                </div>
              ),
            },
            objectReturn: {
              title: 'Object Return',
              cellRenderer: ({ cellData, rowData }: any) => {
                const noData =
                  (!cellData || cellData === 'null') && !rowData?.msg
                return (
                  <div
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      width: '100%',
                    }}
                  >
                    <FcInfo
                      className={`${styles['icon-info']} ${
                        noData ? styles.disabled : ''
                      }`}
                      size={25}
                      onClick={() => {
                        if (noData) return

                        setCurrentJson(cellData ? JSON.parse(cellData) : null)
                        setCurrentMessage(rowData?.msg || '')
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
        // items={performanceData || []}
        pagination={{
          onNextClick: handleNextClick,
          onPrevClick: handlePrevClick,
          currentItemFrom: paginationLogs.currentItemFrom,
          currentItemTo: paginationLogs.currentItemTo,
          textShowRows: 'Show rows',
          textOf: 'of',
          totalItems: items.length,
        }}
        fullWidth
        density="high"
      />
      <ModalJsonView
        isOpen={modalJsonView}
        onClose={() => {
          setModalJsonView(false)
          setCurrentMessage('')
        }}
        jsonData={currentJson}
        msg={currentMessage}
      />
    </>
  )
}
