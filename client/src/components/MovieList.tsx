import { Link } from "react-router-dom";
import {Card, Col, Row} from "react-bootstrap";
import noImageFallback from '../assets/noimage.svg';

function MovieCard({ movie }: { movie: Movie }) {

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="text-decoration-none text-dark"
    >
        <Card className="border-0 bg-transparent h-100">
          <Card.Img
            variant="top"
            src={(movie.Poster === "N/A") ? noImageFallback : movie.Poster}
            alt={movie.Title}
            className="rounded img-fluid"
            onError={(e) => {
              e.currentTarget.src = noImageFallback;
            }}
          />

          <Card.Body className="px-0 py-2 d-flex flex-column flex-grow-1">
            <Card.Title className="fs-6 fw-semibold mb-1">
              {movie.Title}
            </Card.Title>

            <div className="d-flex align-items-center gap-3 small mt-auto">
              <span className="fw-semibold">
                ⭐ {movie.imdbRating}
              </span>
              <span className="text-secondary">
                {movie.Year}
              </span>
            </div>
          </Card.Body>
        </Card>
    </Link>
  );
}

function MovieList({ movies }: { movies : Movie[] }) {
  return (
    <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-3">
      {movies.map((movie) => (
        <Col key={movie.imdbID}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
}

export default MovieList;