import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { getMovieReviews } from "../services/api";

function CommentSection({ imdbID }: { imdbID: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getMovieReviews(imdbID);
        setReviews(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    };

    loadReviews();
  }, [imdbID]);

  return (
    <div className="mt-5">
      <h3 className="mb-4">Reviews</h3>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {reviews.length === 0 && !error ? (
        <Alert variant="secondary">
          No reviews yet.
        </Alert>
      ) : (
        <Row className="g-3">
          {reviews.map((review) => (
            <Col xs={12} key={review._id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <strong>{review.authorName}</strong>

                    <span>
                      ⭐ {review.rating}/10
                    </span>
                  </div>

                  <Card.Text>
                    {review.text}
                  </Card.Text>

                  <small className="text-secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default CommentSection;