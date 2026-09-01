import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

import { login } from '../services/api'
import { setToken } from '../services/auth'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const result = await login({
        username,
        password
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
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5 text-start">
                <div className="text-center mb-4">
                  <h1 className="fw-bold mb-2">
                    Login
                  </h1>
                </div>
  
                {error && (
                  <Alert variant="danger" className="border-0 rounded-3">
                    {error}
                  </Alert>
                )}
  
                <Form onSubmit={handleSubmit} className="text-start">
                  <Form.Group className="mb-3 text-start">
                    <Form.Label className="fw-semibold d-block text-start">
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
              
                  <Form.Group className="mb-4 text-start">
                    <Form.Label className="fw-semibold d-block text-start">
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
              
                  <div className="d-flex flex-column flex-md-row gap-3">
                    <Button
                      type="submit"
                      className="flex-grow-1 rounded-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
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
                    Don't have an account?{' '}
                  </span>
              
                  <Link
                    to="/signup"
                    state={{ from }}
                    className="fw-semibold text-decoration-none"
                  >
                    Sign up
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

export default Login