import { jwtDecode } from "jwt-decode"

interface User {
  id: string
  email: string
  createdAt: string
}

interface JWTPayLoad {
  id: string
  email: string
  exp: number
  iat: number
}

const TOKEN_COOKIE_NAME = 'is-loggedIn'
const TOKEN_COOKIE_OPTIONS = {
  httpOnly: false, // disable client side reading cookie
  secure: true, // only sent over https
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = useCookie(TOKEN_COOKIE_NAME, TOKEN_COOKIE_OPTIONS)

  return {
    isLoggedIn
  }
})