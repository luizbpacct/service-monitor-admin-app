/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { EXPERIMENTAL_Select as Select, Input } from 'vtex.styleguide'

import type { OptionSelect } from '../../typings/global'
import {
  checkIfIncludeStrings,
  checkIfStringsEqual,
} from '../utils/helperArrayCompare '

type FilterStatement = {
  subject: string
  verb: '=' | '!=' | 'contains' | '>=' | '=<'
  object: string
  error: any
}

function useFilters<T>(items: T[] | any[]) {
  const [filteredItems, setFilteredItems] = useState<T[] | any[]>(items)
  const [filterStatement, setFilterStatement] = useState<FilterStatement[]>([])

  const [filterAuthOptions, setFilterAuthOptions] = useState<string[]>([])
  const authFilter = {
    process: (filter: FilterStatement, pItems: T[] | any[]) => {
      const filterString: OptionSelect[] = filter.object
        ? JSON.parse(filter.object)
        : []

      switch (filter.verb) {
        case 'contains':
          return pItems.filter((i) => {
            if (!i.authType) return false
            const authList = JSON.parse(i.authType)
            const filterList = filterString.map((f) => f.value)

            return checkIfIncludeStrings(authList, filterList)
          })

        case '=':
          return pItems.filter((i) => {
            if (!i.authType) return false
            const authList = JSON.parse(i.authType)
            const filterList = filterString.map((f) => f.value)

            return checkIfStringsEqual(authList, filterList)
          })

        default:
          return [...filteredItems]
      }
    },
    object: ({ value, onChange }: any) => {
      return (
        <Select
          multi
          clearable={false}
          value={value ? JSON.parse(value) : []}
          options={filterAuthOptions?.map((op) => ({
            label: op,
            value: op,
          }))}
          onChange={(values: any) => {
            if (!values?.length) {
              onChange('')

              return
            }

            onChange(JSON.stringify(values))
          }}
        />
      )
    },
    load: () => {
      const options: string[] = []

      items.forEach((item) => {
        if (!item.authType) return

        const authList = JSON.parse(item.authType)

        authList.forEach((auth: string) => {
          if (options.indexOf(auth) >= 0) return

          options.push(auth)
        })
      })

      setFilterAuthOptions([...options])
    },
  }

  const processingTimeFilter = {
    process: (filter: FilterStatement, pItems: T[] | any[]) => {
      switch (filter.verb) {
        case '>=':
          return pItems.filter((i) => i.processingTime >= Number(filter.object))

        case '=<':
          return pItems.filter((i) => i.processingTime <= Number(filter.object))

        default:
          return filteredItems
      }
    },
    object: ({ value, onChange }: any) => {
      return (
        <Input
          placeholder="ms"
          type="number"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
        />
      )
    },
  }

  useEffect(() => {
    let itemsFilter: T[] | any[] = [...items]

    filterStatement?.forEach((filter) => {
      if (filter.subject === 'auth') {
        itemsFilter = authFilter.process(filter, itemsFilter)
      } else if (filter.subject === 'processingTime') {
        itemsFilter = processingTimeFilter.process(filter, itemsFilter)
      }
    })

    setFilteredItems(itemsFilter)
  }, [filterStatement])

  useEffect(() => {
    authFilter.load()
  }, [])

  const filters = {
    auth: {
      renderFilterLabel: (st: FilterStatement) => {
        if (!st || !st.object) return 'Any'

        const object: OptionSelect[] = st.object ? JSON.parse(st.object) : []

        const optionsSelected = object.map((o) => o.label)

        return `${st.verb === '=' ? 'is' : 'contains'} ${optionsSelected.join(
          ','
        )}`
      },
      verbs: [
        {
          label: 'is',
          value: '=',
          object: authFilter.object,
        },
        {
          label: 'contains',
          value: 'contains',
          object: authFilter.object,
        },
      ],
    },
    processingTime: {
      renderFilterLabel: (st: FilterStatement) => {
        if (!st || !st.object) return 'Any'

        return `${st.verb === '>=' ? '=>' : '<='} ${st.object}`
      },
      verbs: [
        {
          label: '>=',
          value: '>=',
          object: processingTimeFilter.object,
        },
        {
          label: '<=',
          value: '<=',
          object: processingTimeFilter.object,
        },
      ],
    },
  }

  return {
    filters,
    filteredItems,
    filterStatement,
    setFilterStatement,
  }
}

export default useFilters
