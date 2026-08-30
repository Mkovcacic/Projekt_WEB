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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="fw-bold text-center mb-4">
                Create account
              </h2>

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Favourite genre</Form.Label>

                  <Form.Select
                    value={favGenre}
                    onChange={(e) => setFavGenre(e.target.value)}
                  >
                    <option value="">Choose genre</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                  </Form.Select>
                </Form.Group>


                <div className="d-flex gap-2">
                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Odustani
                </Button>
                </div>

              </Form>

              <div className="text-center mt-3">
                <span className="text-secondary">
                  Already have an account?{' '}
                </span>

                <Link to="/login" state={{ from: location }}>
                  Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Signup