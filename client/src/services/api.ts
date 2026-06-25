const API_URL = 'http://localhost:3100'

export type MovieSearchResult = {
  imdbId: string
  title: string
  year: string
  type: string
  poster: string
}

export type MovieDetails = {
  imdbId: string
  title: string
  year: string
  genre: string
  director: string
  actors: string
  plot: string
  imdbRating: string
  poster: string
}

export type Review = {
  _id: string
  imdbId: string
  movieTitle: string
  movieYear: string
  moviePoster: string
  movieGenre: string
  imdbRating: string
  authorName: string
  rating: number
  text: string
  createdAt: string
}

export type CreateReviewData = {
  imdbId: string
  movieTitle: string
  movieYear: string
  moviePoster: string
  movieGenre: string
  imdbRating: string
  authorName: string
  rating: number
  text: string
}

export async function searchMovies(title: string): Promise<MovieSearchResult[]> {
  const response = await fetch(
    `${API_URL}/api/movies/search?title=${encodeURIComponent(title)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod pretrage filmova')
  }

  return data
}

export async function getMovieDetails(imdbId: string): Promise<MovieDetails> {
  const response = await fetch(`${API_URL}/api/movies/${imdbId}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja filma')
  }

  return data
}

export async function getMovieReviews(imdbId: string): Promise<Review[]> {
  const response = await fetch(`${API_URL}/api/reviews/movie/${imdbId}`)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod dohvaćanja recenzija')
  }

  return data
}

export async function createReview(review: CreateReviewData): Promise<Review> {
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Greška kod spremanja recenzije')
  }

  return data
}