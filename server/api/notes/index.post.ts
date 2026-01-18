export default eventHandler(async (event): Promise<any> => {
  try {
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL
    const body = await readBody(event)

    const token = getCookie(event, 'token')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No token provided'
      })
    }

    console.log(`[API] Creating new note: ${body.title}`)

    const response = await $fetch(`${apiBaseURL}/api/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body
    })

    return response
  } catch (error: any) {
    console.error(`[API] Create note failed:`, error)

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

    if (error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.data?.message || 'Invalid note data'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create note'
    })
  }
}) 