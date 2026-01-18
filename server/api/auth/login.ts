interface ApiError {
  status?: number
  data?: {
    message?: string
  }
}

export default eventHandler(async (event): Promise<any> => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL

    const response = await $fetch(`${apiBaseURL}/api/auth/login`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const token = response.token

    setCookie(event, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    setCookie(event, 'is-loggedIn', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return { user: response.user }
  } catch (error) {
    const apiError = error as ApiError
    console.error(`[API] Login failed:`, error)

    // Handle different types of errors
    if (apiError.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: apiError.data?.message || 'Invalid credentials'
      })
    }

    if (apiError.status === 500) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Server error'
      })
    }

    // Network or other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Connection error'
    })
  }
})