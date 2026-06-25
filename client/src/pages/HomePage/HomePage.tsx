import { useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { searchMovies } from '../../services/api'
import type { MovieSearchResult } from '../../services/api'

type MoviePosterProps = {
  src: string
  title: string
}

function MoviePoster({ src, title }: MoviePosterProps) {
  const [hasImageError, setHasImageError] = useState(false)

  if (!src || hasImageError) {
    return (
      <div className="movie-card-placeholder d-flex align-items-center justify-content-center">
        Nema postera
      </div>
    )
  }

  return (
    <Card.Img
      variant="top"
      src={src}
      alt={title}
      className="movie-card-poster"
      onError={() => setHasImageError(true)}
    />
  )
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState<MovieSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setMovies([])

      const results = await searchMovies(searchTerm)

      setMovies(results)
    } catch {
      setError('Nije pronađen nijedan film s tim naslovom.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="homepage">
      <Container className="py-5">
        <section className="homepage-hero text-center mx-auto mb-5">
          <h1 className="display-4 fw-bold mb-3">
            Pronađi film ili seriju
          </h1>

          <p className="homepage-description mb-4">
            Pretraži filmove i serije, pogledaj osnovne podatke i pročitaj
            komentare drugih korisnika.
          </p>

          <Form onSubmit={handleSearch} className="homepage-search mx-auto">
            <div className="d-flex flex-column flex-md-row gap-2">
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Npr. Interstellar"
                className="rounded-pill px-4 py-3"
              />

              <Button
                type="submit"
                variant="dark"
                className="rounded-pill px-4 fw-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Pretražujem...' : 'Pretraži'}
              </Button>
            </div>
          </Form>
        </section>

        {isLoading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="light" />
          </div>
        )}

        {error && (
          <p className="text-center text-light bg-dark bg-opacity-50 rounded-4 p-3 mx-auto homepage-message">
            {error}
          </p>
        )}

        {movies.length > 0 && (
          <Row className="g-4">
            {movies.map((movie) => (
              <Col key={movie.imdbId} xs={12} sm={6} lg={4} xl={3}>
                <Card className="movie-card h-100 border-0 rounded-4 overflow-hidden">
                  <MoviePoster src={movie.poster} title={movie.title} />

                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">
                      {movie.title}
                    </Card.Title>

                    <Card.Text className="text-muted mb-4">
                      {movie.year} · {movie.type}
                    </Card.Text>

                    <Button
                      type="button"
                      variant="dark"
                      className="rounded-pill mt-auto fw-semibold"
                      onClick={() => navigate(`/movie/${movie.imdbId}`)}
                    >
                      Otvori film
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}

export default HomePage