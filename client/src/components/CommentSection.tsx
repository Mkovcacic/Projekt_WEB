import { useEffect, useState } from 'react'
import { Alert, Button, Card, Spinner, Accordion } from 'react-bootstrap'
import { PersonCircle, StarFill, PlusCircleFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { getCurrentUser, getMovieReviews, deleteReview } from '../services/api'
import { isLoggedIn } from '../services/auth'
import { socket } from '../services/socket'
import EditReviewModal from './EditReviewModal'
import CreateReviewModal from './CreateReviewModal'

function CommentSection({ imdbID, title }: { imdbID : string, title : string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  
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

  useEffect(() => {
    socket.connect()
  
    socket.emit('join-movie-room', imdbID)
  
    const handleReviewCreated = (review: Review) => {
      setReviews((currentReviews) => {
        const exists = currentReviews.some(
          (currentReview) => currentReview._id === review._id
        )
      
        if (exists) {
          return currentReviews
        }
      
        return [review, ...currentReviews]
      })
    }
  
    const handleReviewUpdated = (updatedReview: Review) => {
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      )
    }
  
    const handleReviewDeleted = (data: { _id: string }) => {
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review._id !== data._id)
      )
    }
  
    socket.on('review-created', handleReviewCreated)
    socket.on('review-updated', handleReviewUpdated)
    socket.on('review-deleted', handleReviewDeleted)
  
    return () => {
      socket.emit('leave-movie-room', imdbID)
    
      socket.off('review-created', handleReviewCreated)
      socket.off('review-updated', handleReviewUpdated)
      socket.off('review-deleted', handleReviewDeleted)
    }
  }, [imdbID])

  return (
  <div className="mt-5">
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span className="fw-bold">
            Reviews
          </span>
        </Accordion.Header>
  
        <Accordion.Body>
          {isLoggedIn() && (
            <div className="d-flex justify-content-end mb-3">
              <PlusCircleFill 
                className="fs-2 text-primary" 
                role="button" 
                onClick={() => setShowCreateModal(true)}/>
            </div>
          )}
          {error && (
            <Alert
              variant="danger"
              className="border-0 rounded-3"
            >
              {error}
            </Alert>
          )}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center bg-body-tertiary rounded-4 p-5">
              <h5 className="fw-semibold mb-2">
                No reviews yet
              </h5>
          
              <p className="text-secondary mb-0">
                Be the first to share your opinion about this movie.
              </p>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <div className="mb-4" key={review._id}>
                  <Card className="shadow-sm rounded-3">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="fs-5">
                          <StarFill className="text-warning"/>{' '}
                          <span className="fw-semibold">
                            {review.rating}
                          </span>
                          <span className="text-secondary">
                            /10
                          </span>
                        </div>
                      </div>
                      
                      <Card.Text className="fs-5 lh-lg mb-3 text-start">
                        {review.text}
                      </Card.Text>
                      
                      {currentUser && review.authorID == currentUser._id && (
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="outline-secondary"
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
                    </Card.Body>
                  </Card>
                      
                  <div className="d-flex align-items-center gap-2 mt-2 px-2">
                    <PersonCircle className="fs-3 text-primary" />
                      
                    <Link
                      to={`/profile/${review.authorID}`}
                      className="fw-semibold text-decoration-none"
                    >
                      {review.authorName}
                    </Link>
                      
                    <span className="text-secondary">
                      •
                    </span>
                      
                    <small className="text-secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
        
      <CreateReviewModal
        imdbID={imdbID}
        title={title}
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
  
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