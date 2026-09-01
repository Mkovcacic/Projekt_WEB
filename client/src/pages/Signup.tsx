import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

import { signup } from '../services/api'
import { setToken } from '../services/auth'

function Signup() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [favGenre, setFavGenre] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const result = await signup({
        name,
        username,
        email,
        password,
        favGenre
      })

      setToken(result.token)

      navigate(from || '/', { replace: true })
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(from || '/', { replace: true })
  }

  return (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="fw-bold mb-2">
                    Create account
                  </h1>
                </div>
  
                {error && (
                  <Alert variant="danger" className="border-0 rounded-3">
                    {error}
                  </Alert>
                )}
  
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Name
                        </Form.Label>
              
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          size="lg"
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>
              
                    <Col mxs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Username
                        </Form.Label>
              
                        <Form.Control
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          size="lg"
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>
              
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Email
                        </Form.Label>
              
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          size="lg"
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>
              
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Password
                        </Form.Label>
              
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          size="lg"
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>
              
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Favourite genre
                        </Form.Label>
              
                        <Form.Select
                          value={favGenre}
                          onChange={(e) => setFavGenre(e.target.value)}
                          htmlSize={5}
                          className="rounded-3 bg-body-tertiary border-0"
                        >
                          <option value="Action">Action</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Animation">Animation</option>
                          <option value="Comedy">Comedy</option>
                          <option value="Crime">Crime</option>
                          <option value="Documentary">Documentary</option>
                          <option value="Drama">Drama</option>
                          <option value="Family">Family</option>
                          <option value="Fantasy">Fantasy</option>
                          <option value="History">History</option>
                          <option value="Horror">Horror</option>
                          <option value="Music">Music</option>
                          <option value="Mystery">Mystery</option>
                          <option value="Romance">Romance</option>
                          <option value="Science Fiction">Science Fiction</option>
                          <option value="Thriller">Thriller</option>
                          <option value="TV Movie">TV Movie</option>
                          <option value="War">War</option>
                          <option value="Western">Western</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
              
                  <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                    <Button
                      type="submit"
                      className="flex-grow-1 rounded-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : 'Sign up'}
                    </Button>
              
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="flex-grow-1 rounded-3"
                      size="lg"
                      onClick={handleCancel}
                    >
                      Quit
                    </Button>
                  </div>
                </Form>
              
                <hr className="my-4" />
              
                <div className="text-center">
                  <span className="text-secondary">
                    Already have an account?{' '}
                  </span>
              
                  <Link
                    to="/login"
                    state={{ from: location }}
                    className="fw-semibold text-decoration-none"
                  >
                    Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Signup