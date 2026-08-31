import { Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function TMDbMovieCard({ movie }: { movie: TMDBMovie }) {
  return (
    <Link to={`/movie/tmdb/${movie.id}`} className="text-decoration-none text-dark">
      <Card className="border-0 bg-transparent h-100">
        <Card.Img
          variant="top"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/images/placeholder.png'
          }
          alt={movie.title}
          className="rounded img-fluid"
        />

        <Card.Body className="px-0 py-2">
          <Card.Title className="fs-6 fw-semibold mb-1 text-truncate">
            {movie.title}
          </Card.Title>

          <span className="text-secondary">
            {movie.release_date?.slice(0, 4)}
          </span>
        </Card.Body>
      </Card>
    </Link>
  )
}

function TMDbMovieList({ movies }: { movies: TMDBMovie[] }) {
  return (
    <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-3">
      {movies.map((movie) => (
        <Col key={movie.id}>
          <TMDbMovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  )
}

export default TMDbMovieList