import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router'
import AddReviewModal from '../../components/AddReviewModal'
import {getMovieDetails,getMovieReviews} from '../../services/api'
import type { MovieDetails, Review } from '../../services/api'

function MoviePoster({ src, title }: { src: string; title: string }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className="movie-page-poster-placeholder d-flex align-items-center justify-content-center rounded-4">
        Nema postera
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title}
      className="movie-page-poster rounded-4"
      onError={() => setHasError(true)}
    />
  )
}

function MoviePage() {
  const { imdbId } = useParams()

  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  useEffect(() => {
    async function loadMoviePage() {
      if (!imdbId) {
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const [movieData, reviewsData] = await Promise.all([
          getMovieDetails(imdbId),
          getMovieReviews(imdbId),
        ])

        setMovie(movieData)
        setReviews(reviewsData)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Greška kod dohvaćanja podataka o filmu.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMoviePage()
  }, [imdbId])

  if (isLoading) {
    return (
      <main className="movie-page">
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="light" />
        </Container>
      </main>
    )
  }

  if (error || !movie) {
    return (
      <main className="movie-page">
        <Container className="py-5">
          <p className="text-light bg-dark bg-opacity-50 rounded-4 p-3">
            {error || 'Film nije pronađen.'}
          </p>
        </Container>
      </main>
    )
  }

  return (
    <main className="movie-page">
      <Container className="py-5">
        <Card className="movie-details-card border-0 rounded-4 p-4 mb-4">
          <Row className="g-4">
            <Col xs={12} md={4} lg={3}>
              <MoviePoster src={movie.poster} title={movie.title} />
            </Col>

            <Col xs={12} md={8} lg={9}>
              <div className="d-flex flex-column h-100">
                <div>
                  <h1 className="fw-bold mb-2">
                    {movie.title}
                  </h1>

                  <p className="text-muted mb-3">
                    {movie.year} · {movie.genre}
                  </p>

                  <p className="mb-2">
                    <strong>Redatelj:</strong> {movie.director}
                  </p>

                  <p className="mb-2">
                    <strong>Glumci:</strong> {movie.actors}
                  </p>

                  <p className="mb-2">
                    <strong>IMDb ocjena:</strong> {movie.imdbRating}
                  </p>

                  <p className="mt-3 mb-0">
                    {movie.plot}
                  </p>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="dark"
                    className="rounded-pill px-4 fw-semibold"
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    Dodaj komentar
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="text-light mb-0">
              Komentari
            </h2>

            <span className="badge rounded-pill bg-light text-dark">
              {reviews.length}
            </span>
          </div>

          {reviews.length === 0 ? (
            <p className="text-light bg-dark bg-opacity-50 rounded-4 p-3">
              Još nema komentara za ovaj film.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((review) => (
                <Card key={review._id} className="border-0 rounded-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between gap-3 mb-2">
                      <div>
                        <h3 className="h5 mb-1">
                          {review.authorName}
                        </h3>
                        <p className="text-muted small mb-0">
                          {new Date(review.createdAt).toLocaleDateString('hr-HR')}
                        </p>
                      </div>

                      <span className="badge rounded-pill bg-dark align-self-start">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="mb-0">
                      {review.text}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </section>

        {movie && (
          <AddReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            movie={movie}
            onReviewCreated={(newReview) => {
              setReviews((currentReviews) => [newReview, ...currentReviews])
            }}
          />
        )}
      </Container>
    </main>
  )
}

export default MoviePage