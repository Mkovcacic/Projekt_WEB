const TOKEN_KEY = 'cineforumToken'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  const token = getToken()

  if (!token) {
    return false
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))

    if (!payload.exp) {
      return false
    }

    if (payload.exp * 1000 <= Date.now()) {
      removeToken()
      return false
    }

    return true
  } catch {
    removeToken()
    return false
  }
}

export function logout() {
  removeToken()
}