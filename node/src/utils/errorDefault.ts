export const errorDefault = (ctx: Context, error: any) => {
  console.error('TCL: errorDefault -> error => ', error)
  console.error(
    'TCL: errorDefault -> error?.response?.data?.error = >',
    error?.response?.data?.error
  )

  console.error(
    'TCL: errorDefault -> error?.response?.data?.details = >',
    error?.response?.data?.details
  )

  ctx.status = 500
  ctx.body = ``
}
