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
  Dropdown,
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
import { GRAPH_TIME_OPTIONS } from '../../utils/constants'
import type { DropDownOptions, GraphTime } from '../../../typings/global'
import { getAuthTypeGraphData } from '../../utils/performance/getAuthTypeGraphData'

type DashboardProps = {
  entity: string
  routes: string[]
}

const Dashboard = ({ entity, routes }: DashboardProps) => {
  const currentDate = new Date()

  const [selectRoutes, setSelectRoutes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>([])
  const [graphTime, setGraphTime] = useState<DropDownOptions<GraphTime>>(
    GRAPH_TIME_OPTIONS[0]
  )

  const [totalPerformanceData, setTotalPerformanceData] = useState<number>(0)
  const [routeSummaryData, setRouteSummaryData] = useState<any>(null)
  const [performanceRender, setPerformanceRender] = useState<any>(null)
  const [initialDate, setInitialDate] = useState<Date>(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  )

  const [finalDate, setFinalDate] = useState<Date>(currentDate)

  const getTableLogsData = () => {
    const dataTableLogs = [...performanceData]

    dataTableLogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return dataTableLogs
  }

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

        data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const routeSummary = getRouteSummary(data)
        const errorGraphByRouteData = getErrorGraphData({
          data,
          graphTime: graphTime.value,
        })

        const requestGraphByRouteData = getRequestGraphData({
          data,
          graphTime: graphTime.value,
        })

        const requestAuthTypeGraphData = getAuthTypeGraphData({
          data,
          graphTime: graphTime.value,
        })

        setRouteSummaryData(routeSummary)
        setPerformanceData(data)
        setPerformanceRender({
          errorGraphByRouteData,
          requestGraphByRouteData,
          requestAuthTypeGraphData,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [initialDate, finalDate, selectRoutes, pagination, entity])

  useEffect(() => {
    if (!performanceData) return

    const errorGraphByRouteData = getErrorGraphData({
      data: performanceData,
      graphTime: graphTime.value,
    })

    const requestGraphByRouteData = getRequestGraphData({
      data: performanceData,
      graphTime: graphTime.value,
    })

    const requestAuthTypeGraphData = getAuthTypeGraphData({
      data: performanceData,
      graphTime: graphTime.value,
    })

    setPerformanceRender({
      errorGraphByRouteData,
      requestGraphByRouteData,
      requestAuthTypeGraphData,
    })
  }, [graphTime])

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
              <div className={style.boxOne}>
                <DatePicker
                  label="Start date"
                  size="large"
                  value={initialDate}
                  onChange={(date: Date) => setInitialDate(date)}
                  locale="pt-BR"
                />
              </div>
              <div className={style.boxTwo}>
                <DatePicker
                  label="End date"
                  size="large"
                  value={finalDate}
                  onChange={(date: Date) => setFinalDate(date)}
                  locale="pt-BR"
                />
              </div>
            </div>
            <div>
              <PaginationLogs
                pagination={pagination}
                setPagination={setPagination}
                totalItems={totalPerformanceData}
              />
            </div>
            {!loading ? (
              <div className={style['dashboard-tab-body--boxData']}>
                <Box title="Summarized data">
                  <Table
                    onRowClick={() => {}}
                    schema={{
                      properties: {
                        route: {
                          title: 'Route',
                        },
                        'processTime(AVG)': {
                          title: 'ms (AVG)',
                          width: 100,
                        },
                        qtdErrors: {
                          title: 'Errors',
                          width: 70,
                        },
                        qtdRequest: {
                          title: 'Request',
                          width: 80,
                        },
                        'qtdRequestDay(AVG)': {
                          title: 'Request (Day)(AVG)',
                          width: 150,
                        },
                      },
                    }}
                    items={routeSummaryData || []}
                    fullWidth
                    density="medium"
                  />
                </Box>
                <div className={style['dashboard-tab-body--boxRoutesAndTime']}>
                  <div className={style.boxOne}>
                    <Select
                      multi
                      id="selectRoutes"
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
                      options={routes?.map((value) => ({
                        label: value,
                        value,
                      }))}
                      onChange={(values: any) => {
                        setSelectRoutes(values?.map((item: any) => item.value))
                      }}
                    />
                  </div>
                  <div className={style.boxTwo}>
                    <Dropdown
                      size="large"
                      label="Graph time"
                      options={GRAPH_TIME_OPTIONS}
                      value={graphTime.value}
                      onChange={(_: any, v: GraphTime) => {
                        setGraphTime({
                          label: v,
                          value: v,
                        })
                      }}
                    />
                  </div>
                </div>
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
                  <Box title="Auth">
                    <Chart
                      chartType="Line"
                      data={performanceRender?.requestAuthTypeGraphData || []}
                      width="100%"
                      height="400px"
                      legendToggle
                    />
                  </Box>
                </div>

                <Box title="Logs">
                  <TableLogs items={getTableLogsData()} />
                </Box>
              </div>
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
