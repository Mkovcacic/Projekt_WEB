import { useState } from 'react'
import type { UserProfile } from '../App'
import './EditProfileModal.css'

type EditProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile
  onSave: (updatedProfile: UserProfile) => void
}

function EditProfileModal({
  isOpen,
  onClose,
  userProfile,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(userProfile.name)
  const [username, setUsername] = useState(userProfile.username)

  if (!isOpen) return null

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !username.trim()) {
      return
    }

    onSave({
      ...userProfile,
      name: name.trim(),
      username: username.trim(),
    })

    onClose()
  }

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div
        className="edit-modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="edit-modal-header">
          <h2>Uredi profil</h2>

          <button className="edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="edit-form-group">
            <label htmlFor="profile-name">Ime i prezime</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="profile-username">Korisničko ime</label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="edit-modal-actions">
            <button
              type="button"
              className="edit-cancel-button"
              onClick={onClose}
            >
              Odustani
            </button>

            <button type="submit" className="edit-save-button">
              Spremi promjene
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal