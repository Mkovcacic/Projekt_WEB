import { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { TMDbMovieCard } from './TMDBMovieList'

type Props = {
  title: string
  movies: TMDBMovie[]
}

function TMDBMovieSection({ title, movies }: Props) {
  const [page, setPage] = useState(0)

  const moviesPerPage = 5
  const pageCount = Math.ceil(movies.length / moviesPerPage)

  useEffect(() => {
    setPage(0)
  }, [movies])

  const handlePrevious = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleNext = () => {
    if (page < pageCount - 1) {
      setPage(page + 1)
    }
  }

  return (
    <section className="mb-5">
      <h2 className="mb-3">{title}</h2>

      {/* LG i veće */}
      <div className="d-none d-lg-flex align-items-center gap-2">
        <Button
          variant="dark"
          className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center p-0"
          style={{ width: '44px', height: '44px', fontSize: '28px' }}
          onClick={handlePrevious}
          disabled={page === 0}
        >
          ‹
        </Button>

        <div className="overflow-hidden flex-grow-1">
          <div
            className="d-flex"
            style={{
              transform: `translateX(-${page * 100}%)`,
              transition: 'transform 0.5s ease'
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="px-2 flex-shrink-0"
                style={{ width: '20%' }}
              >
                <TMDbMovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="dark"
          className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center p-0"
          style={{ width: '44px', height: '44px', fontSize: '28px' }}
          onClick={handleNext}
          disabled={page >= pageCount - 1}
        >
          ›
        </Button>
      </div>

      {/* Manje od LG */}
      <div className="d-lg-none">
        <Row xs={1} md={2} className="g-3">
          {movies.map((movie) => (
            <Col key={movie.id}>
              <TMDbMovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  )
}

export default TMDBMovieSection