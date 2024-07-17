/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-params */
import React, { useEffect, useState } from 'react'
import {
  Table,
  Box,
  Spinner,
  DatePicker,
  EXPERIMENTAL_Select as Select,
} from 'vtex.styleguide'
import Chart from 'react-google-charts'

import style from './index.css'
import { getPerformanceData } from '../../services/getPerformanceData'
import { getRouteSummary } from '../../utils/performance/getRouteSummary'
import { getErrorGraphData } from '../../utils/performance/getErrorGraphData'
import { getRequestGraphData } from '../../utils/performance/getRequestGraphData'
import type { PaginationType } from '../../../typings/dashboard'
import { TableLogs } from '../../../components/TableLogs'
import { PaginationLogs } from '../../../components/PaginationLogs'

type DashboardProps = {
  entity: string
  routes: string[]
}

const Dashboard = ({ entity, routes }: DashboardProps) => {
  console.log('TCL: Dashboard -> routes', routes)
  const currentDate = new Date()

  const [selectRoutes, setSelectRoutes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>([])
  const [totalPerformanceData, setTotalPerformanceData] = useState<number>(0)
  const [routeSummaryData, setRouteSummaryData] = useState<any>(null)
  const [performanceRender, setPerformanceRender] = useState<any>(null)
  const [initialDate, setInitialDate] = useState<Date>(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  )

  const [finalDate, setFinalDate] = useState<Date>(currentDate)

  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    pageSize: 100,
    currentItemFrom: 1,
    currentItemTo: 100,
  })

  useEffect(() => {
    setLoading(true)
    getPerformanceData({
      initialDate,
      finalDate,
      selectRoutes,
      entity,
      pagination: {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    })
      .then(({ data, pagination: rPagination }) => {
        if (rPagination) {
          setTotalPerformanceData(rPagination.total)
        }

        const dataInc = [...data]
        const dataDec = [...data]

        dataInc.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        dataDec.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        const routeSummary = getRouteSummary(dataInc)
        const errorGraphByRouteData = getErrorGraphData(dataInc)
        const requestGraphByRouteData = getRequestGraphData(dataInc)

        setRouteSummaryData(routeSummary)
        setPerformanceData(dataDec)
        setPerformanceRender({
          errorGraphByRouteData,
          requestGraphByRouteData,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [initialDate, finalDate, selectRoutes, pagination])

  return (
    <div className={style['dashboard-tab']}>
      <div className={style['dashboard-tab-head']}>
        <div className={style['dashboard-tab-head--box']}>
          {/* <span className={style['dashboard-tab-head--title']}>
            Logs & Alerts
          </span> */}
        </div>
        <div className={style['dashboard-tab-head--box-second']} />
      </div>
      <div className={style['dashboard-tab-body']}>
        <Box title="Performance and Logs Data">
          <div className={style['dashboard-tab-body--contentPerformData']}>
            <div className={style['dashboard-tab-body--boxDataPicker']}>
              <DatePicker
                label="Data Inicial"
                value={initialDate}
                onChange={(date: Date) => setInitialDate(date)}
                locale="pt-BR"
              />
              <DatePicker
                label="Data Final"
                value={finalDate}
                onChange={(date: Date) => setFinalDate(date)}
                locale="pt-BR"
              />
            </div>
            <div>
              <Select
                multi
                label="Routes"
                size="large"
                placeholder="Filter by route name"
                value={
                  selectRoutes?.map((value) => ({
                    label: value,
                    value,
                    __isNew__: true,
                  })) || []
                }
                options={routes}
                onChange={(values: any) => {
                  setSelectRoutes(values?.map((item: any) => item.value))
                }}
              />
            </div>
            <div>
              <PaginationLogs
                pagination={pagination}
                setPagination={setPagination}
                totalItems={totalPerformanceData}
              />
            </div>
            {!loading ? (
              <>
                <Box title="Summarized data">
                  <Table
                    schema={{
                      properties: {
                        route: {
                          title: 'Route',
                        },
                        'processTime(AVG)': {
                          title: 'Process time (ms)(AVG)',
                          width: 200,
                        },
                        qtdErrors: {
                          title: 'Qtd errors',
                          width: 100,
                        },
                        qtdRequest: {
                          title: 'Qtd Request',
                          width: 100,
                        },
                        'qtdRequestDay(AVG)': {
                          title: 'qtd Request (Day)(AVG)',
                          width: 200,
                        },
                      },
                    }}
                    items={routeSummaryData || []}
                    fullWidth
                    density="high"
                  />
                </Box>

                <div className={style['dashboard-tab-body--boxCharts']}>
                  <Box title="Errors">
                    <Chart
                      chartType="Line"
                      data={performanceRender?.errorGraphByRouteData || []}
                      width="100%"
                      height="400px"
                      legendToggle
                    />
                  </Box>
                  <Box title="Requests">
                    <Chart
                      chartType="Line"
                      data={performanceRender?.requestGraphByRouteData || []}
                      width="100%"
                      height="400px"
                      legendToggle
                    />
                  </Box>
                </div>

                <Box title="Full listing of events">
                  <TableLogs items={performanceData} />
                </Box>
              </>
            ) : (
              <div className={style['dashboard-loadSpinner']}>
                <Spinner color="#3F3F40" />
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard
