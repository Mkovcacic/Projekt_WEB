import { useEffect, useState } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { createReview, getCurrentUser, getMovieReviews, deleteReview } from '../services/api'
import { isLoggedIn } from '../services/auth'
import EditReviewModal from './EditReviewModal'

function CommentSection({ imdbID }: { imdbID: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(10)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getMovieReviews(imdbID)
        setReviews(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [imdbID])

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!isLoggedIn()) {
        return
      }

      try {
        const data = await getCurrentUser()
        setCurrentUser(data)
      } catch (e) {
        console.error(e)
      }
    }

    loadCurrentUser()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!text.trim()) {
      setError('Recenzija ne može biti prazna')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const newReview = await createReview({
        imdbID,
        rating,
        text
      })

      setReviews((currentReviews) => [newReview, ...currentReviews])

      setRating(10)
      setText('')
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    )
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)

      await deleteReview(id)

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review._id !== id)
      )
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    }
  }

  return (
    <div className="mt-5">
      <h3 className="mb-4">Reviews</h3>

      {isLoggedIn() && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="mb-3">
              Add review
            </Card.Title>

            <Form onSubmit={handleSubmit}>
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

              <Form.Group className="mb-3">
                <Form.Label>Review</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your review..."
                />
              </Form.Group>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Submit review'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {!isLoggedIn() && (
        <Alert variant="secondary">
          Moraš biti prijavljen da bi napisao recenziju.
        </Alert>
      )}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : reviews.length === 0 ? (
        <Alert variant="secondary">
          Još nema recenzija za ovaj film.
        </Alert>
      ) : (
        reviews.map((review) => (
          <Card className="mb-3" key={review._id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{review.authorName}</strong>

                <span className="fw-semibold">
                  ⭐ {review.rating}/10
                </span>
              </div>

              <Card.Text>
                {review.text}
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>

                {currentUser && review.authorName == currentUser.username && (
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditingReview(review)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(review._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      <EditReviewModal
        review={editingReview}
        show={editingReview !== null}
        onHide={() => setEditingReview(null)}
        onUpdated={handleReviewUpdated}
      />
    </div>
  )
}

export default CommentSection