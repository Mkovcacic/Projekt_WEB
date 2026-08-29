import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert, Container, Spinner } from 'react-bootstrap'
import { searchMovies } from '../services/api'
import MovieList from '../components/MovieList'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title') || ''

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovies = async () => {
      if (!title.trim()) {
        setMovies([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await searchMovies(title)
        setMovies(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [title])

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">
        Search results for "{title}"
      </h2>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!error && movies.length === 0 && (
        <Alert variant="secondary">
          No movies found
        </Alert>
      )}

      {movies.length > 0 && (
        <MovieList movies={movies} />
      )}
    </Container>
  )
}

export default SearchResults