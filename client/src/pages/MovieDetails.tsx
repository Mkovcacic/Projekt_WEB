import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Badge, Alert, Spinner} from "react-bootstrap";
import { getMovieDetails } from '../services/api';
import CommentSection from '../components/CommentSection';

function MovieDetails() {
  const { imdbID } = useParams()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imdbID) {
      return
    }

    const loadMovie = async () => {
      try {
        const data = await getMovieDetails(imdbID)
        setMovie(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      }
    }

    loadMovie()
  }, [imdbID])

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    )
  }

  if (!movie) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="g-5">
        <Col md={4} lg={3}>
          <img
            src={movie.Poster ?? "/images/placeholder.png"}
            alt={movie.Title}
            className="img-fluid rounded shadow"
          />
        </Col>

        <Col md={8} lg={9}>
          <h1 className="fw-bold mb-2">
            {movie.Title}
          </h1>

          <div className="d-flex flex-wrap gap-3 text-secondary mb-3">
            <span>{movie.Year}</span>
            <span>{movie.Rated}</span>
            <span>{movie.Runtime}</span>
            <span>{movie.Released}</span>
          </div>

          <div className="mb-4">
            {movie.Genre.split(", ").map((genre) => (
              <Badge
                bg="secondary"
                className="me-2"
                key={genre}
              >
                {genre}
              </Badge>
            ))}
          </div>

          <div className="d-flex gap-4 mb-4">
            <div>
              <div className="text-secondary small">
                IMDb
              </div>
              <div className="fs-4 fw-bold">
                ⭐ {movie.imdbRating}
              </div>
              <div className="small text-secondary">
                {movie.imdbVotes} votes
              </div>
            </div>

            <div>
              <div className="text-secondary small">
                Metascore
              </div>
              <div className="fs-4 fw-bold">
                {movie.Metascore}
              </div>
            </div>
          </div>

          <h4>Plot</h4>
          <p className="lead">
            {movie.Plot}
          </p>

          <hr />

          <Row className="gy-3">
            <Col sm={6}>
              <strong>Director</strong>
              <div className="text-secondary">
                {movie.Director}
              </div>
            </Col>

            <Col sm={6}>
              <strong>Actors</strong>
              <div className="text-secondary">
                {movie.Actors}
              </div>
            </Col>

            <Col sm={6}>
              <strong>Writers</strong>
              <div className="text-secondary">
                {movie.Writer}
              </div>
            </Col>

            <Col sm={6}>
              <strong>Box office</strong>
              <div className="text-secondary">
                {movie.BoxOffice}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <CommentSection imdbID={movie.imdbID}/>
    </Container>
  );
}

export default MovieDetails;