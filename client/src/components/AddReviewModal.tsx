import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import type { Review } from '../App'

type AddReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void
}

function AddReviewModal({
  isOpen,
  onClose,
  onAddReview,
}: AddReviewModalProps) {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [text, setText] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title || !rating || !text) {
      return
    }

    onAddReview({
      title,
      author: 'Marko Kovač',
      rating: Number(rating),
      text,
    })

    setTitle('')
    setRating('')
    setText('')
    onClose()
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
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
          <Form.Group controlId="title">
            <Form.Label className="fw-semibold">
              Naslov filma ili serije
            </Form.Label>

            <Form.Control
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Npr. Interstellar"
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>

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
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 flex-column flex-sm-row gap-2">
          <Button
            type="button"
            variant="light"
            className="w-sm-auto rounded-pill px-4 py-2 fw-semibold"
            onClick={onClose}
          >
            Odustani
          </Button>

          <Button
            type="submit"
            variant="dark"
            className="w-sm-auto rounded-pill px-4 py-2 fw-semibold bg-primary"
          >
            Objavi komentar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddReviewModal