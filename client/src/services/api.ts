import { getToken } from './auth'
const API_URL = 'http://localhost:3100'

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

export async function getReviewsByAuthor(authorName: string): Promise<Review[]> {
  const response = await fetch(
    `${API_URL}/api/reviews/user?authorName=${encodeURIComponent(authorName)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja komentara korisnika')
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

export async function updateReview(id: string, rating: number, text: string): Promise<void> {
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

export async function updateCurrentUser(data: UpdateUserData): Promise<void> {
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