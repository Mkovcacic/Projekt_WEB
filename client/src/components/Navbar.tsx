import { Link } from 'react-router'
import { useState } from 'react'
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
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            CineForum
          </Link>

          <nav className="navbar-menu">
            <Link to="/" className="navbar-link">
              Homepage
            </Link>

            <Link to="/profile" className="navbar-link">
              Profil
            </Link>

            <button
              className="navbar-button"
              onClick={() => setIsModalOpen(true)}
            >
              Dodaj komentar
            </button>
          </nav>
        </div>
      </header>

      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddReview={onAddReview}
      />
    </>
  )
}

export default Navbar