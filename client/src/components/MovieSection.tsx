import Button from "react-bootstrap/Button";
import MovieList from "./MovieList";

function MovieSection({ title, movies }: { title : string, movies: Movie[] }) {
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-4 fw-bold mb-0">
          {title}
        </h2>

        <Button
          variant="light"
          size="sm"
          className="rounded-pill px-3"
        >
          Prikaži sve →
        </Button>
      </div>

      <MovieList movies={movies} />
    </section>
  );
}

export default MovieSection;