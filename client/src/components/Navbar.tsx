import { useState, useEffect } from 'react'
import { Navbar, Form, Button, Row, Col, Container, Nav, NavDropdown } from 'react-bootstrap';
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
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
            <img alt="logo" src="../movie-projector.png"
            width="30" height="30" className="d-inline-block align-top"
            />{' '}CineForum
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='mt-1'>
          <Nav className=" gap-lg-3 text-start"> 
            {loggedIn ? 
              (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <div className='mt-1'>
                  <Button variant='outline-danger w-auto' size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
              ) :
              (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )
            }
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            <Row className="w-100">
              <Col xs={12} md={7} lg={12}>
                <Form className="d-flex gap-1" onSubmit={handleSubmit}>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button variant="outline-success" type="submit" aria-label="Search">
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