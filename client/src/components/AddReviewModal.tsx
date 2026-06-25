import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { createReview } from '../services/api'
import type { MovieDetails, Review } from '../services/api'

type AddReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  movie: MovieDetails
  onReviewCreated: (review: Review) => void
}

function AddReviewModal({
  isOpen,
  onClose,
  movie,
  onReviewCreated,
}: AddReviewModalProps) {
  const [rating, setRating] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!rating || !text.trim()) {
      setError('Unesi ocjenu i komentar.')
      return
    }

    try {
      setIsSaving(true)
      setError('')

      const newReview = await createReview({
        imdbId: movie.imdbId,
        movieTitle: movie.title,
        movieYear: movie.year,
        moviePoster: movie.poster,
        movieGenre: movie.genre,
        imdbRating: movie.imdbRating,
        authorName: 'Marko Kovač',
        rating: Number(rating),
        text: text.trim(),
      })

      onReviewCreated(newReview)

      setRating('')
      setText('')
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Greška kod spremanja komentara.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  function handleClose() {
    setError('')
    onClose()
  }

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      centered
      dialogClassName="add-review-modal"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 px-4 pt-4 pb-0">
          <Modal.Title as="h2">
            Dodaj komentar
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column gap-3 px-4 py-3">
          <div className="bg-light rounded-4 p-3">
            <p className="fw-semibold mb-1">
              {movie.title}
            </p>

            <p className="text-muted small mb-0">
              {movie.year} · {movie.genre}
            </p>
          </div>

          <Form.Group controlId="rating">
            <Form.Label className="fw-semibold">
              Ocjena
            </Form.Label>

            <Form.Control
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              placeholder="Npr. 4.5"
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>

          <Form.Group controlId="comment">
            <Form.Label className="fw-semibold">
              Komentar
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={5}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Napiši svoje mišljenje..."
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>

          {error && (
            <p className="text-danger small mb-0">
              {error}
            </p>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 flex-column flex-sm-row gap-2 px-4 pb-4">
          <Button
            type="button"
            variant="light"
            className="add-review-modal-button rounded-pill px-4 py-2 fw-semibold"
            onClick={handleClose}
            disabled={isSaving}
          >
            Odustani
          </Button>

          <Button
            type="submit"
            variant="dark"
            className="add-review-modal-button rounded-pill px-4 py-2 fw-semibold bg-primary border-0"
            disabled={isSaving}
          >
            {isSaving ? 'Spremam...' : 'Objavi komentar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddReviewModal