export default eventHandler(async (event): Promise<any> => {
  try {
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL
    const token = getCookie(event, 'token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No token provided'
      })
    }

    console.log(`[API] Fetching notes`)

    const response = await $fetch(`${apiBaseURL}/api/notes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    console.error(`[API] Fetch notes failed:`, error)

    if (error.name === 'FetchError') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Backend service unavailable'
      })
    }

    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notes'
    })
  }
}) 