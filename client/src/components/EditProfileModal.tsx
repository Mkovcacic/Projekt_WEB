import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { updateCurrentUser } from '../services/api'

type Props = {
  user: CurrentUser
  show: boolean
  onHide: () => void
  onUpdated: (user: CurrentUser) => void
}

function EditProfileModal({ user, show, onHide, onUpdated }: Props) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [favGenre, setFavGenre] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!show) return

    setName(user.name)
    setUsername(user.username)
    setEmail(user.email)
    setFavGenre(user.favGenre || '')
    setError(null)
  }, [show, user])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      const updatedUser = await updateCurrentUser({
        name,
        username,
        email,
        favGenre
      })

      onUpdated(updatedUser)
      onHide()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
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

          <Form.Group>
            <Form.Label>Favourite genre</Form.Label>
            <Form.Select
                value={favGenre}
                onChange={(e) => setFavGenre(e.target.value)}
                htmlSize={5}
                className="rounded-3 bg-body-tertiary border-0"
            >
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Documentary">Documentary</option>
              <option value="Drama">Drama</option>
              <option value="Family">Family</option>
              <option value="Fantasy">Fantasy</option>
              <option value="History">History</option>
              <option value="Horror">Horror</option>
              <option value="Music">Music</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Thriller">Thriller</option>
              <option value="TV Movie">TV Movie</option>
              <option value="War">War</option>
              <option value="Western">Western</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            type="button"
            onClick={onHide}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default EditProfileModal