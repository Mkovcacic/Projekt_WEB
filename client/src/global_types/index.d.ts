type Movie = {
  imdbID: string
  Title: string
  Year: string
  Genre: string
  Director: string
  Actors: string
  Plot: string
  imdbRating: string
  Poster: string
  Rated: string
  Runtime: string
  Released: string
  imdbVotes: string
  Metascore: string
  Writer: string
  BoxOffice: string
}

type TMDBMovie = {
  id: number
  title: string
  original_title: string
  original_language: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
}

type MovieSearchResult = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

type Review = {
  _id: string
  imdbID: string
  authorName: string
  rating: number
  text: string
  createdAt: string
}

type AuthResponse = {
  message: string
  token: string
}

type CreateReviewData = {
  imdbID: string
  rating: number
  text: string
}

type SignupData = {
  name: string
  username: string
  email: string
  password: string
  favGenre: string
}

type LoginData = {
  username: string
  password: string
}

type CurrentUser = {
  _id: string
  name: string
  username: string
  email: string
  favGenre: string
  createdAt: string
}

type UpdateUserData = {
  name: string
  username: string
  email: string
  favGenre: string
}