import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { uploadImage } from '../services/api'

type Props = {
  onUploaded: (image: Image) => void
}

function UploadImage({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setFile(null)
      setError('Only image files are allowed')
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setLoading(true)
      setError(null)

      const uploadedImage = await uploadImage(file)

      onUploaded(uploadedImage)
      setFile(null)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3 d-flex justify-content-center justify-content-lg-start">
        <Form.Label className="fw-semibold">
          Upload image
        </Form.Label>

        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Form.Group>

      <Button
        variant="outline-primary"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}

export default UploadImage