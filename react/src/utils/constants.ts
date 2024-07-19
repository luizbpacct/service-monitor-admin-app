import type { DropDownOptions, GraphTime } from '../../typings/global'

export const GRAPH_TIME_OPTIONS: Array<DropDownOptions<GraphTime>> = [
  {
    value: 'dateAndHour',
    label: 'Date and Hour',
  },
  {
    value: 'date',
    label: 'Date',
  },
]

export const BUTTON_COPY_CONFIG = {
  defaultText: 'Copy',
  transitionTime: 1500,
}
