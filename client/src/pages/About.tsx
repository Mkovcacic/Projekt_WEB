import { Card, Col, Container, Row } from 'react-bootstrap'

function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="fw-bold mb-4">About</h1>

          <Card className="mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-3">About the application</h3>

              <p className="mb-0">
                This application allows users to search for movies, view movie
                details and ratings, create an account, and write reviews for
                movies they have watched.
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-3">Movie data</h3>

              <p>
                Movie information is retrieved using the OMDb API. The
                application uses IMDb identifiers to uniquely identify movies
                and retrieve detailed information such as the title, release
                year, genre, actors, director, IMDb rating and plot.
              </p>

              <p className="mb-0">
                Movie data and ratings are provided by external data sources
                and are not created or maintained by this application.
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-3">Reviews</h3>

              <p className="mb-0">
                Registered users can write, edit and delete their own movie
                reviews. Reviews are stored in the application database and are
                displayed on the corresponding movie page.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <h3 className="mb-3">Technologies</h3>

              <Row className="gy-3">
                <Col md={6}>
                  <strong>Frontend</strong>
                  <div className="text-secondary">
                    React, TypeScript, React Bootstrap
                  </div>
                </Col>

                <Col md={6}>
                  <strong>Backend</strong>
                  <div className="text-secondary">
                    Node.js, Express.js
                  </div>
                </Col>

                <Col md={6}>
                  <strong>Database</strong>
                  <div className="text-secondary">
                    MongoDB
                  </div>
                </Col>

                <Col md={6}>
                  <strong>Authentication</strong>
                  <div className="text-secondary">
                    JSON Web Token
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default About