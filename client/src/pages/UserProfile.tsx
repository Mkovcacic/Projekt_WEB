import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Calendar3, Envelope, Film, Person } from 'react-bootstrap-icons'

import { getUserById } from '../services/api'

function UserProfile() {
  const { id } = useParams()

  const [user, setUser] = useState<PublicUser | null>(null)
  const [error, setError] = useState<string | null>(null)

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
  </Container>
)
}

export default UserProfile