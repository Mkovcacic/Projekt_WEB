import { useEffect, useState } from 'react'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'

import { getCurrentUser } from '../services/api'

function Profile() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser()
        setUser(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        }
      }
    }

    loadUser()
  }, [])

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
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
        <Col lg={8}>
          <h1 className="fw-bold mb-4">
            Profile
          </h1>

          <Card>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="
                    bg-secondary
                    text-white
                    rounded-circle
                    d-flex
                    align-items-center
                    justify-content-center
                    fs-2
                    fw-bold
                  "
                  style={{
                    width: '70px',
                    height: '70px'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="mb-0">
                    {user.name}
                  </h3>

                  <span className="text-secondary">
                    @{user.username}
                  </span>
                </div>
              </div>

              <hr />

              <Row className="gy-4">
                <Col md={6}>
                  <div className="text-secondary small">
                    Email
                  </div>

                  <div className="fw-semibold">
                    {user.email}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-secondary small">
                    Favourite genre
                  </div>

                  <div className="fw-semibold">
                    {user.favGenre || 'Not selected'}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-secondary small">
                    Username
                  </div>

                  <div className="fw-semibold">
                    {user.username}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-secondary small">
                    Member since
                  </div>

                  <div className="fw-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile