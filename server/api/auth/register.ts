export default eventHandler(async (event): Promise<any> => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL

    console.log(`[API] Registration attempt for email: ${body.email}`)

    const response = await $fetch(`${apiBaseURL}/api/auth/register`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log(`[API] Registration successful for email: ${body.email}`)

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
  } catch (error: any) {
    console.error(`[API] Registration failed:`, error)

    // Handle different types of errors
    if (error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.data?.message || 'Registration failed'
      })
    }

    if (error.status === 500) {
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