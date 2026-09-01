import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { createReview } from '../services/api'

function CreateReviewModal({ imdbID, title, show, onHide, }: CreateProps) {
  const [rating, setRating] = useState(10)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!text.trim()) {
      setError('Review cannot be empty')
      return
    }

    try {
      setSaving(true)
      setError(null)

      await createReview({
        imdbID,
        title,
        rating,
        text
      })

      setRating(10)
      setText('')
      onHide()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>

            <Form.Control
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={0.1}
              max={10}
              step={0.1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Review</Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your review..."
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Submit review'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CreateReviewModal