import { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import TMDbMovieCard from './TMDBMovieCard'

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
      <h2 className="fw-bold mb-4">{title}</h2>
  
      {/* LG i veće */}
      <div className="d-none d-lg-block position-relative px-5">
        <Button
          variant={page === 0 ? 'light' : 'dark'}
          className={`position-absolute start-0 top-50 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center      p-2 z-3 ${
            page === 0 ? 'opacity-25' : 'shadow'
          }`}
          onClick={handlePrevious}
          disabled={page === 0}
          aria-label="Previous movies"
        >
          <ChevronLeft className="fs-4" />
        </Button>
        
        <div className="overflow-hidden">
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
          variant={page >= pageCount - 1 ? 'light' : 'dark'}
          className={`position-absolute end-0 top-50 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center p-2      z-3 ${
            page >= pageCount - 1 ? 'opacity-25' : 'shadow'
          }`}
          onClick={handleNext}
          disabled={page >= pageCount - 1}
          aria-label="Next movies"
        >
          <ChevronRight className="fs-4" />
        </Button>
      </div>
        
      {/* Manje od LG */}
      <div className="d-lg-none">
        <Row xs={1} md={2} className="g-4">
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