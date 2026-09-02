import { getToken } from './auth'
const API_URL = import.meta.env.VITE_API_URL

// Auth routes

export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Greska kod registracije')
  }

  return responseData
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Greska kod prijave')
  }

  return responseData
}


// Movie routes

export async function getNewMovies(): Promise<TMDBMovie[]> {
  const response = await fetch(`${API_URL}/api/movie/new`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja novih filmova')
  }

  return data
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  const response = await fetch(`${API_URL}/api/movie/popular`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja popularnih filmova')
  }

  return data
}

export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  const response = await fetch(`${API_URL}/api/movie/top-rated`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja najbolje ocijenjenih filmova')
  }

  return data
}

export async function getMovieDetailsByTmdbID(tmdbID: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/api/movie/tmdb/${tmdbID}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja filma')
  }

  return data
}

export async function searchMovies(title: string): Promise<Movie[]> {
  const response = await fetch(
    `${API_URL}/api/movie/search?title=${encodeURIComponent(title)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod pretrage filmova')
  }

  return data
}

export async function getMovieDetails(imdbID: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/api/movie/${imdbID}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja filma')
  }

  return data
}


// Review routes

export async function getUserReviews(userID: string): Promise<Review[]> {
  const response = await fetch(
    `${API_URL}/api/reviews/user/${encodeURIComponent(userID)}`
  )

  const data = await response.json()
  

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja recenzija')
  }

  return data
}

export async function getMovieReviews(imdbID: string): Promise<Review[]> {
  const response = await fetch(`${API_URL}/api/reviews/movie/${imdbID}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja recenzija')
  }

  return data
}

export async function downloadReviews(): Promise<void> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/reviews/download`, {
    headers: { authorization: token || '' }
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Greška kod preuzimanja recenzija')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'reviews.json'

  document.body.appendChild(link)
  link.click()
  link.remove()

  window.URL.revokeObjectURL(url)
}

export async function createReview(review: CreateReviewData): Promise<Review> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/reviews/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify(review)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Greška kod spremanja recenzije')
  }

  return data
}

export async function updateReview(id: string, rating: number, text: string): Promise<Review> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/reviews/update/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({ rating, text })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Greška kod uređivanja recenzije')
  }

  return data
}

export async function deleteReview(id: string): Promise<void> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/reviews/delete/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { authorization: token }
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || data.message || 'Greška kod brisanja recenzije')
  }
}


// User routes

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/user/me`, {
    headers: { authorization: token }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Greška kod dohvaćanja korisničkog profila')
  }

  return data
}

export async function getUserById(id: string): Promise<PublicUser> {
  const response = await fetch(`${API_URL}/api/user/${encodeURIComponent(id)}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja korisnika')
  }

  return data
}

export async function updateCurrentUser(data: UpdateUserData): Promise<CurrentUser> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/user/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify(data)
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Greška kod ažuriranja profila')
  }

  return responseData
}

export async function deleteCurrentUser(): Promise<void> {
  const token = getToken()

  const response = await fetch(`${API_URL}/api/user/delete`, {
    method: 'DELETE',
    headers: { authorization: token }
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || data.message || 'Greška kod brisanja korisničkog računa')
  }
}

// File upload
export async function uploadImage(file: File): Promise<Image> {
  const token = getToken()

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/api/files/upload`, {
    method: 'POST',
    headers: {
      authorization: token || ''
    },
    body: formData
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod uploada slike')
  }

  return data
}

export async function getUserImages(userID: string): Promise<Image[]> {
  const response = await fetch(
    `${API_URL}/api/files/user/${encodeURIComponent(userID)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja slika')
  }

  return data
}

export function getImageURL(imageID: string): string {
  return `${API_URL}/api/files/${imageID}`
}