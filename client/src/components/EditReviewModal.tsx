import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { updateReview } from '../services/api'

type Props = {
  review: Review | null
  show: boolean
  onHide: () => void
  onUpdated: (review: Review) => void
}

function EditReviewModal({ review, show, onHide, onUpdated }: Props) {
  const [rating, setRating] = useState(10)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (review) {
      setRating(review.rating)
      setText(review.text)
      setError(null)
    }
  }, [review])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!review) {
      return
    }

    if (!text.trim()) {
      setError('Recenzija ne može biti prazna')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const updatedReview = await updateReview(review._id, rating, text.trim())

      onUpdated(updatedReview)
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
          <Modal.Title>Edit review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>

            <Form.Select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}/10
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Review</Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default EditReviewModal