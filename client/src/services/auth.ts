const TOKEN_KEY = 'cineforumToken'

export const saveToken = (token: string) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  const token = window.localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('Korisnik nije prijavljen')
  }

  return token
}

export function isLoggedIn() {
  try {
    return !!getToken()
  } catch (error) {
    return false
  }
}

export const logout = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}