import { Link } from "react-router-dom";
import {Card, Col, Row, Ratio} from "react-bootstrap";
import noImageFallback from '../assets/noimage.svg';

function MovieCard({ movie }: { movie: MovieSearchResult }) {
  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="text-decoration-none text-body"
    >
      <Card className="border-0 bg-transparent h-100">
        <Ratio aspectRatio={150}>
          <Card.Img
            variant="top"
            src={
              movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : noImageFallback
            }
            alt={movie.Title}
            className="rounded-3 object-fit-contain"
            onError={(e) => {
              e.currentTarget.src = noImageFallback;
            }}
          />
        </Ratio>

        <Card.Body className="px-0 py-2 d-flex flex-column flex-grow-1">
          <Card.Title className="fs-6 fw-semibold mb-1">
            {movie.Title}
          </Card.Title>

          <span className="text-secondary small mt-auto">
            {movie.Year}
          </span>
        </Card.Body>
      </Card>
    </Link>
  )
}

function MovieList({ movies }: { movies : (Movie | MovieSearchResult)[] }) {
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