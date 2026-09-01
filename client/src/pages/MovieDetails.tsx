import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Badge, Alert, Spinner} from "react-bootstrap";
import { getMovieDetails, getMovieDetailsByTmdbID } from '../services/api';
import CommentSection from '../components/CommentSection';
import noImageFallback from '../assets/noimage.svg';

function MovieDetails() {
  const { imdbID, tmdbID } = useParams()

  const [_, setLoading] = useState(true)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true)
        setError(null)
      
        let data: Movie
      
        if (tmdbID) {
          data = await getMovieDetailsByTmdbID(tmdbID)
        } else if (imdbID) {
          data = await getMovieDetails(imdbID)
        } else {
          throw new Error('ID filma nije pronađen')
        }
      
        setMovie(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }
  
    loadMovie()
  }, [imdbID, tmdbID])

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
      <Row className="g-4 g-lg-5 align-items-start">
        <Col md={4} lg={3}>
          <img
            src={movie.Poster ?? "/images/placeholder.png"}
            alt={movie.Title}
            className="img-fluid rounded-3 shadow w-100"
            onError={(e) => {
                e.currentTarget.src = noImageFallback;
              }}
          />
        </Col>
            
        <Col md={8} lg={9}>
          <div className="mb-4">
            <h1 className="display-5 fw-bold mb-2">
              {movie.Title}
            </h1>
            
            <div className="d-flex flex-wrap align-items-center gap-2 text-secondary mb-3 justify-content-md-center justify-content-lg-start">
              <span>{movie.Year}</span>
              <span>•</span>
              <span>{movie.Rated}</span>
              <span>•</span>
              <span>{movie.Runtime}</span>
              <span>•</span>
              <span>{movie.Released}</span>
            </div>
            
            <div className="d-flex flex-wrap gap-2 justify-content-md-center justify-content-lg-start">
              {movie.Genre.split(", ").map((genre) => (
                <Badge
                  bg="dark"
                  className="rounded-pill px-3 py-2 fw-normal"
                  key={genre}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
            
          <div className="d-flex flex-wrap gap-5 py-3 border-top border-bottom mb-4 justify-content-md-center justify-content-lg-start">
            <div>
              <div className="text-secondary small mb-1">
                IMDb rating
              </div>
            
              <div className="d-flex align-items-baseline gap-1">
                <span className="fs-3 fw-bold">
                  {movie.imdbRating}
                </span>
                <span className="text-secondary">
                  / 10
                </span>
              </div>
            
              <div className="small text-secondary">
                {movie.imdbVotes} votes
              </div>
            </div>
            
            <div>
              <div className="text-secondary small mb-1">
                Metascore
              </div>
            
              <div className="fs-3 fw-bold">
                {movie.Metascore}
              </div>
            </div>
          </div>
            
          <div className="mb-4">
            <h3 className="fw-bold mb-3">
              Plot
            </h3>
            
            <p className="fs-5 lh-base mb-0">
              {movie.Plot}
            </p>
          </div>
            
          <div className="bg-body-tertiary rounded-3 px-4">
            <Row className="py-3 border-bottom">
              <Col sm={3} className="text-secondary fw-semibold">
                Director
              </Col>
            
              <Col sm={9}>
                {movie.Director}
              </Col>
            </Row>
            
            <Row className="py-3 border-bottom">
              <Col sm={3} className="text-secondary fw-semibold">
                Writers
              </Col>
            
              <Col sm={9}>
                {movie.Writer}
              </Col>
            </Row>
            
            <Row className="py-3 border-bottom">
              <Col sm={3} className="text-secondary fw-semibold">
                Actors
              </Col>
            
              <Col sm={9}>
                {movie.Actors}
              </Col>
            </Row>
            
            <Row className="py-3">
              <Col sm={3} className="text-secondary fw-semibold">
                Box office
              </Col>
            
              <Col sm={9}>
                {movie.BoxOffice}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
            
      <div className="mt-5 pt-4 border-top">
        <CommentSection imdbID={movie.imdbID} title={movie.Title} />
      </div>
    </Container>
  )
}

export default MovieDetails;