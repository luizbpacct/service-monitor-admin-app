export const controlState = ({ data, setData }: any) => {
  return {
    save: (fieldName: string, fieldValue: any) => {
      setData({
        ...data,
        [fieldName]: fieldValue,
      })
    },
    get: (fieldName: string) => {
      return data[fieldName]
    },
    load: (pData: any) => {
      setData(pData)
    },
    getAll: () => data,
  }
}
