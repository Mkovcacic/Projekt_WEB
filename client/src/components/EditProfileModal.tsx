import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import type { UserProfile } from '../App'

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
  const [favGenre, setFavGenre] = useState(userProfile.fav_genre)

  useEffect(() => {
    setName(userProfile.name)
    setUsername(userProfile.username)
    setFavGenre(userProfile.fav_genre)
  }, [userProfile])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !username.trim() || !favGenre.trim()) {
      return
    }

    onSave({
      ...userProfile,
      name: name.trim(),
      username: username.trim(),
      fav_genre: favGenre.trim(),
    })

    onClose()
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      dialogClassName="edit-profile-modal"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 px-4 pt-4 pb-0">
          <Modal.Title as="h2">
            Uredi profil
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column gap-3 px-4 py-3">
          <Form.Group controlId="profile-name">
            <Form.Label className="fw-semibold">
              Ime i prezime
            </Form.Label>

            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>

          <Form.Group controlId="profile-username">
            <Form.Label className="fw-semibold">
              Korisničko ime
            </Form.Label>

            <Form.Control
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>

          <Form.Group controlId="profile-fav-genre">
            <Form.Label className="fw-semibold">
              Omiljeni žanr
            </Form.Label>

            <Form.Control
              type="text"
              value={favGenre}
              onChange={(event) => setFavGenre(event.target.value)}
              placeholder="Npr. Drama"
              className="rounded-4 py-3 px-3"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-0 px-4 pt-0 pb-4 flex-column flex-md-row gap-2">
          <Button
            type="button"
            variant="light"
            className="edit-profile-modal-button rounded-pill px-4 py-2 fw-semibold"
            onClick={onClose}
          >
            Odustani
          </Button>

          <Button
            type="submit"
            variant="dark"
            className="edit-profile-modal-button rounded-pill px-4 py-2 fw-semibold"
          >
            Spremi promjene
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default EditProfileModal