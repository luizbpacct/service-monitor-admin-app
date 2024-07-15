/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { Pagination } from 'vtex.styleguide'

import { PaginationType } from '../../typings/dashboard'

type PaginationLogsProps = {
  pagination: PaginationType
  setPagination: (p: PaginationType) => void
  totalItems: number
}

export const PaginationLogs = ({
  pagination,
  setPagination,
  totalItems,
}: PaginationLogsProps) => {
  const goToPage = (
    currentPage: any,
    currentItemFrom: any,
    currentItemTo: any
  ) => {
    setPagination({
      ...pagination,
      currentPage,
      currentItemFrom,
      currentItemTo,
    })
  }

  const handleNextClick = () => {
    const newPage = pagination.currentPage + 1
    const itemFrom = pagination.currentItemTo + 1
    const itemTo = pagination.pageSize * newPage
    goToPage(newPage, itemFrom, itemTo)
  }

  const handlePrevClick = () => {
    if (pagination.currentPage === 0) return
    const newPage = pagination.currentPage - 1
    const itemFrom = pagination.currentItemFrom - pagination.pageSize
    const itemTo = pagination.currentItemFrom - 1
    goToPage(newPage, itemFrom, itemTo)
  }

  return (
    <Pagination
      rowsOptions={[100, 500, 1000]}
      onRowsChange={(_: any, rows: string) =>
        setPagination({
          ...pagination,
          pageSize: parseInt(rows, 10),
          currentItemTo: parseInt(rows, 10),
          currentItemFrom: 1,
          currentPage: 1,
        })
      }
      onNextClick={handleNextClick}
      onPrevClick={handlePrevClick}
      currentItemFrom={pagination.currentItemFrom}
      currentItemTo={pagination.currentItemTo}
      textOf="of"
      textShowRows="show registers"
      totalItems={totalItems}
    />
  )
}
