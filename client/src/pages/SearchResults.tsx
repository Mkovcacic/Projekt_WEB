import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert, Container, Spinner } from 'react-bootstrap'
import { searchMovies } from '../services/api'
import MovieList from '../components/MovieList'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title') || ''

  const [movies, setMovies] = useState<MovieSearchResult[]>([])
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
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
  
        <h1 className="fw-semibold mb-2">
          Results for "{title}"
        </h1>
      </div>
  
      {error && (
        <Alert variant="danger" className="rounded-3 border-0">
          {error}
        </Alert>
      )}
  
      {!error && movies.length === 0 && (
        <div className="bg-body-tertiary rounded-4 text-center py-5 px-4">
          <h4 className="fw-semibold mb-2">
            No movies found
          </h4>
      
          <p className="text-secondary mb-0">
            Try searching with a different movie title.
          </p>
        </div>
      )}
  
      {movies.length > 0 && (
        <MovieList movies={movies} />
      )}
    </Container>
  )
}

export default SearchResults