import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Calendar3, Envelope, Film, Person, StarFill } from 'react-bootstrap-icons'
import { getUserById, getUserReviews } from '../services/api'
import { socket } from '../services/socket'
import UploadImage from '../components/UploadImage'
import { getUserImages, getImageURL } from '../services/api'

function UserProfile() {
  const { id } = useParams()

  const [user, setUser] = useState<PublicUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  const [images, setImages] = useState<Image[]>([])
  const [imagesLoading, setImagesLoading] = useState(true)
  const [imagesError, setImagesError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        return
      }

      try {
        const data = await getUserById(id)
        setUser(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      }
    }

    loadUser()
  }, [id])

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return

      try {
        setReviewsLoading(true)
        setReviewsError(null)

        const data = await getUserReviews(id)
        setReviews(data)
      } catch (e) {
        if (e instanceof Error) {
          setReviewsError(e.message)
        }
      } finally {
        setReviewsLoading(false)
      }
    }

    loadReviews()
  }, [id])

  useEffect(() => {
    if (!id) return

    socket.connect()
    socket.emit('join-user-room', id)

    const handleReviewCreated = (review: Review) => {
      setReviews((currentReviews) => {
        const exists = currentReviews.some(
          (currentReview) => currentReview._id === review._id
        )

        if (exists) return currentReviews

        return [review, ...currentReviews]
      })
    }

  useEffect(() => {
    const loadImages = async () => {
      if (!id) return

      try {
        setImagesLoading(true)
        setImagesError(null)

        const data = await getUserImages(id)
        setImages(data)
      } catch (e) {
        if (e instanceof Error) {
          setImagesError(e.message)
        }
      } finally {
        setImagesLoading(false)
      }
    }

    loadImages()
  }, [id])

    const handleReviewUpdated = (updatedReview: Review) => {
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === updatedReview._id
            ? updatedReview
            : review
        )
      )
    }

    const handleReviewDeleted = (data: { _id: string }) => {
      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review._id !== data._id
        )
      )
    }

    socket.on('review-created', handleReviewCreated)
    socket.on('review-updated', handleReviewUpdated)
    socket.on('review-deleted', handleReviewDeleted)

    return () => {
      socket.emit('leave-user-room', id)

      socket.off('review-created', handleReviewCreated)
      socket.off('review-updated', handleReviewUpdated)
      socket.off('review-deleted', handleReviewDeleted)
    }
  }, [id])

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9} xl={8}>
          <h1 className="fw-bold mb-4">
            Profile
          </h1>
  
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="bg-dark text-white p-4 p-md-5">
                <Row className="align-items-start">
                  <Col xs={3} sm={2}>
                    <div className="ratio ratio-1x1">
                      <div className="bg-light text-dark rounded-circle d-flex align-items-center justify-content-center fs-1 fw-bold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </Col>
  
                  <Col className="text-center">
                    <h2 className="fw-bold mb-1">
                      {user.name}
                    </h2>
  
                    <div className="text-white-50">
                      @{user.username}
                    </div>
                  </Col>
  
                  <Col xs={3} sm={2}></Col>
                </Row>
              </div>
  
              <div className="p-4 p-md-5">
                <h5 className="fw-bold text-center mb-4">
                  Account information
                </h5>
              
                <Row className="align-items-center py-3 border-bottom">
                  <Col xs={2} className="d-flex justify-content-center">
                    <Envelope className="fs-4 text-secondary" />
                  </Col>
              
                  <Col xs={10} className="text-start">
                    <div className="small text-secondary">
                      Email
                    </div>
              
                    <div className="fw-semibold">
                      {user.email}
                    </div>
                  </Col>
                </Row>
              
                <Row className="align-items-center py-3 border-bottom">
                  <Col xs={2} className="d-flex justify-content-center">
                    <Person className="fs-4 text-secondary" />
                  </Col>
              
                  <Col xs={10} className="text-start">
                    <div className="small text-secondary">
                      Username
                    </div>
              
                    <div className="fw-semibold">
                      @{user.username}
                    </div>
                  </Col>
                </Row>
              
                <Row className="align-items-center py-3 border-bottom">
                  <Col xs={2} className="d-flex justify-content-center">
                    <Film className="fs-4 text-secondary" />
                  </Col>
              
                  <Col xs={10} className="text-start">
                    <div className="small text-secondary">
                      Favourite genre
                    </div>
              
                    <div className="fw-semibold">
                      {user.favGenre || 'Not selected'}
                    </div>
                  </Col>
                </Row>
              
                <Row className="align-items-center py-3">
                  <Col xs={2} className="d-flex justify-content-center">
                    <Calendar3 className="fs-4 text-secondary" />
                  </Col>
              
                  <Col xs={10} className="text-start">
                    <div className="small text-secondary">
                      Joined
                    </div>
              
                    <div className="fw-semibold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </Col>
                </Row>
              </div>
  
            </Card.Body>
          </Card>
        </Col>
      </Row>
  
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold mb-0">Reviews</h3>
        </div>
      
        {reviewsError && (
          <Alert variant="danger">
            {reviewsError}
          </Alert>
        )}
      
        {reviewsLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-body-tertiary rounded-4 text-center p-5">
            <h5 className="fw-semibold mb-2">
              No reviews yet
            </h5>
        
            <p className="text-secondary mb-0">
              This user hasn't written any reviews yet.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card
              key={review._id}
              className="shadow-sm rounded-3 mb-3"
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-2 text-primary">
                  <Link
                    to={`/movie/${review.imdbID}`}
                    className="fs-5 text-decoration-none fw-semibold"
                  >
                    {review.title}
                  </Link>
          
                  <small className="text-secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
          
                <div className="mb-3 d-flex align-items-start">
                  <StarFill className="text-warning me-1" />
                  <span className="fw-semibold">{review.rating}</span>
                  <span className="text-secondary">/10</span>
                </div>
          
                <Card.Text className="text-start mb-0">
                  {review.text}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
      <div className="mt-5 dflex justify-content-center justify-content-lg-start">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">
            Images
          </h3>

          <p className="text-secondary mb-0">
            Images uploaded by you.
          </p>
        </div>

        <div className="w-50">
          <UploadImage
            onUploaded={(image) =>
              setImages((currentImages) => [
                image,
                ...currentImages
              ])
            }
          />
        </div>

        {imagesError && (
          <Alert variant="danger">
            {imagesError}
          </Alert>
        )}

        {imagesLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : images.length === 0 ? (
          <div className="bg-body-tertiary rounded-4 text-center p-5">
            <h5 className="fw-semibold mb-2">
              No images yet
            </h5>
        
            <p className="text-secondary mb-0">
              Upload your first image.
            </p>
          </div>
        ) : (
          <Row className="g-3">
            {images.map((image) => (
              <Col xs={12} sm={6} md={4} key={image._id}>
                <img
                  src={getImageURL(image._id)}
                  alt={image.originalName}
                  className="img-fluid rounded-3 w-100"
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  )
}

export default UserProfile