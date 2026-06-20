import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { Review } from '../App'
import './AddReviewModal.css'

type AddReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void
}

function AddReviewModal({ isOpen, onClose, onAddReview }: AddReviewModalProps) {

  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [text, setText] = useState('')

  if (!isOpen) return null

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title || !rating || !text) {
      return
    }

    onAddReview({
      title,
      author: 'Marko Kovač',
      rating: Number(rating),
      text,
    })

    setTitle('')
    setRating('')
    setText('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Dodaj komentar</h2>

          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Naslov filma ili serije</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Npr. Interstellar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Ocjena</label>
            <input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              placeholder="Npr. 4.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Komentar</label>
            <textarea
              id="comment"
              rows={5}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Napiši svoje mišljenje..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Odustani
            </button>

            <button type="submit" className="submit-button">
              Objavi komentar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddReviewModal