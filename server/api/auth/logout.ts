export default defineEventHandler(async (event) => {
  deleteCookie(event, 'token')
  deleteCookie(event, 'is-loggedIn')
  return { success: true }
}) 