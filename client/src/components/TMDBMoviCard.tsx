import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import noImageFallback from '../assets/noimage.svg';

function TMDbMovieCard({ movie }: { movie: TMDBMovie }) {
  return (
    <Link to={`/movie/tmdb/${movie.id}`} className="text-decoration-none text-dark">
      <Card className="border-0 bg-transparent h-100">
        <Card.Img
          variant="top"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : noImageFallback
          }
          alt={movie.title}
          className="rounded img-fluid"
        />

        <Card.Body className="px-0 py-2">
          <Card.Title className="fs-6 fw-semibold mb-1">
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

export default TMDbMovieCard