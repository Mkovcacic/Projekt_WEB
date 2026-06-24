import { Link } from 'react-router'
import { useState } from 'react'
import { Navbar as BSNavbar, Nav, Button, Container } from 'react-bootstrap'
import AddReviewModal from './AddReviewModal'
import type { Review } from '../App'
import './Navbar.css'

type NavbarProps = {
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void
}

function Navbar({ onAddReview }: NavbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <BSNavbar className="navbar-custom navbar-expand-md position-static position-md-sticky top-0 w-100 py-4 px-4 p-md-3">
        <Container className="navbar-content mx-auto d-flex flex-md-row flex-column border border-secondary rounded-4 shadow-sm px-3 py-3 bg-secondary">
          <BSNavbar.Brand as={Link} to="/" className="navbar-brand text-primary fs-3 fw-bold fw-extrabold ls-tight d-flex justify-content-center">
            CineForum
          </BSNavbar.Brand>

          <Nav className="navbar-menu d-flex justify-content-center flex-wrap gap-3 gap-md-4">
            <Nav.Link as={Link} to="/" className="navbar-link text-decoration-none fw-medium px-3 py-2 rounded-pill text-dark">
              Homepage
            </Nav.Link>

            <Nav.Link as={Link} to="/profile" className="navbar-link text-decoration-none fw-medium px-3 py-2 rounded-pill text-dark">
              Profil
            </Nav.Link>

            <Button
              className="navbar-button p-2"
              onClick={() => setIsModalOpen(true)}
            >
              Dodaj komentar
            </Button>
          </Nav>
        </Container>
      </BSNavbar>

      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddReview={onAddReview}
      />
    </>
  )
}

export default Navbar