import { useState, useEffect } from 'react'
import { Navbar, Form, Button, Row, Col, Container, Nav } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, logout } from '../services/auth';

function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState('')
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    navigate('/')
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    navigate(`/search?title=${encodeURIComponent(title)}`)
  }

  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="py-3 shadow-sm"
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="d-flex align-items-center gap-2 fw-bold fs-4 me-lg-4"
        >
          <img
            alt="logo"
            src="/movie-projector.png"
            width="32"
            height="32"
            className="d-inline-block align-top"
          />
          CineForum
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav" className="mt-3 mt-lg-0">
          <Nav className="w-100 align-items-lg-center gap-2 gap-lg-3 text-start">

            {loggedIn ?
              (
                <>
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className="fw-medium px-lg-2"
                  >
                    Profile
                  </Nav.Link>

                  <div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) :
              (
                <Nav.Link
                  as={Link}
                  to="/login"
                  state={{ from: location }}
                  className="fw-medium px-lg-2"
                >
                  Login
                </Nav.Link>
              )
            }

            <Nav.Link
              as={Link}
              to="/about"
              className="fw-medium px-lg-2"
            >
              About
            </Nav.Link>

            <Row className="w-100 ms-lg-auto">
              <Col xs={12} md={7} lg={8}>
                <Form
                  className="d-flex gap-2 mt-2 mt-lg-0"
                  onSubmit={handleSubmit}
                >
                  <Form.Control
                    type="search"
                    placeholder="Search movie or show"
                    aria-label="Search"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-pill px-3"
                  />

                  <Button
                    variant="outline-light"
                    type="submit"
                    aria-label="Search"
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    
                  >
                    <Search />
                  </Button>
                </Form>
              </Col>
            </Row>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;