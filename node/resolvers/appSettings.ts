export const appSettings = async (_: void, __: void, ctx: Context) => {
  try {
    const {
      clients: { apps },
    } = ctx

    const appId = process.env.VTEX_APP_ID as string

    const resAppSettings = await apps.getAppSettings(appId)

    return {
      ...(resAppSettings || {}),
    }
  } catch (err) {
    return err.message || err
  }
}
