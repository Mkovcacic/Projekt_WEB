/*import { useParams } from "react-router";*/
import { Container, Row, Col, Badge} from "react-bootstrap";

function MovieDetails() {
  /*const { imdbID } = useParams();*/

  const movie = {
  "Title": "Spider-Man: Brand New Day",
  "Year": "2026",
  "Rated": "PG-13",
  "Released": "31 Jul 2026",
  "Runtime": "145 min",
  "Genre": "Action, Adventure, Sci-Fi",
  "Director": "Destin Daniel Cretton",
  "Writer": "Chris McKenna, Erik Sommers, Stan Lee",
  "Actors": "Tom Holland, Zendaya, Mark Ruffalo",
  "Plot": "A forgotten Peter Parker lives alone as a full-time Spider-Man until mounting pressure triggers a dangerous change and a powerful new enemy emerges.",
  "Language": "English",
  "Country": "United States, Canada, United Kingdom, Germany",
  "Awards": "1 nomination total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BOWNjYWM3NWItOGE0ZS00MWRjLThiZWEtYjc4ZmNmMmU5ZTVmXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.1/10"
    },
    {
      "Source": "Metacritic",
      "Value": "66/100"
    }
  ],
  "Metascore": "66",
  "imdbRating": "8.1",
  "imdbVotes": "183,571",
  "imdbID": "tt22084616",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$655,088,528",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
};
  if (!movie) {
    return (
      <Container className="py-5">
        <h2>Movie not found</h2>
      </Container>
    );
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
    </Container>
  );
}

export default MovieDetails;