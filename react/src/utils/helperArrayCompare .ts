export const checkIfIncludeStrings = (
  arrayStrings: string[],
  comparisonArray: string[]
) => {
  let have = false

  if (!arrayStrings?.length || !comparisonArray?.length) return false

  comparisonArray?.forEach((item: string) => {
    arrayStrings?.forEach((itemOne: string) => {
      if (!have) {
        have = !!item?.includes(itemOne)
      }
    })
  })

  return have
}

export const checkIfStringsEqual = (
  arrayStrings: string[],
  masterArray: string[]
) => {
  let have = false

  if (!arrayStrings?.length || !masterArray?.length) return false

  if (arrayStrings.length !== masterArray.length) return false

  arrayStrings?.forEach((itemOne: string) => {
    have = masterArray.includes(itemOne)
  })

  return have
}
