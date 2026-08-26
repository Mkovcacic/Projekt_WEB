import { Navbar, Form, Button, Row, Col, Container, Nav, NavDropdown } from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';

function AppNavbar() {

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
            <img alt="logo" src="../movie-projector.png"
            width="30" height="30" className="d-inline-block align-top"
            />{' '}CineForum
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='mt-2'>
          <Row className="w-100">
            <Col xs={12} md={6}>
              <Form className="d-flex gap-1">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <Button variant="outline-success" type="submit" aria-label="Search">
                  <Search />
                </Button>
              </Form>
            </Col>
          </Row>
          <Nav className="ms-auto gap-lg-3 text-start">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#home">Login</Nav.Link>
            <Nav.Link href="#link">About</Nav.Link>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;