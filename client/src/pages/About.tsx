import { Card, Col, Container, Row } from 'react-bootstrap'

function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9} xl={8}>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">
              About CineForum
            </h1>
  
            <p className="lead text-secondary mb-0">
              Discover movies, explore their detailed information and share your
              opinions with other movie enthusiasts.
            </p>
          </div>
  
          <Card className="border-0 shadow-sm rounded-4 mb-5">
            <Card.Body className="p-4 p-md-5">
              <Row className="g-5">
                <Col md={6}>
                  <h3 className="fw-bold mb-3">
                    About the application
                  </h3>
  
                  <p className="text-secondary mb-0">
                    This application allows users to search for movies, view movie
                    details and ratings, register, and write reviews for
                    movies they have watched.
                  </p>
                </Col>
  
                <Col md={6}>
                  <h3 className="fw-bold mb-3">
                    Reviews
                  </h3>
  
                  <p className="text-secondary mb-0">
                    Registered users can write, edit and delete their own movie
                    reviews. Reviews are stored in the application database and
                    are displayed on the corresponding movie page.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
  
          <div className="mb-5">
            <h2 className="fw-bold mb-3">
              Movie data
            </h2>
  
            <div className=" border-4 ps-4">
              <p className="text-secondary">
                Movie information is retrieved using the OMDb and TMDB API. The
                application uses IMDb identifiers to uniquely identify movies
                and retrieve detailed information such as the title, release
                year, genre, actors, director, IMDb rating and plot and TMDB API
                to find movies for the Home page.
              </p>
  
              <p className="text-secondary mb-0">
                Movie data and IMDb ratings are provided by external data sources
                and are not created or maintained by this application.
              </p>
            </div>
          </div>
  
          <div className="border-top pt-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">
                Technologies
              </h2>
  
              <p className="text-secondary mb-0">
                Technologies used to build CineForum
              </p>
            </div>
  
            <Row className="g-3">
              <Col sm={6}>
                <div className="bg-body-tertiary rounded-3 p-4 h-100">
                  <div className="small text-secondary mb-1">
                    Frontend
                  </div>
  
                  <div className="fw-semibold">
                    React, TypeScript, React Bootstrap
                  </div>
                </div>
              </Col>
  
              <Col sm={6}>
                <div className="bg-body-tertiary rounded-3 p-4 h-100">
                  <div className="small text-secondary mb-1">
                    Backend
                  </div>
  
                  <div className="fw-semibold">
                    Node.js, Express.js
                  </div>
                </div>
              </Col>
  
              <Col sm={6}>
                <div className="bg-body-tertiary rounded-3 p-4 h-100">
                  <div className="small text-secondary mb-1">
                    Database
                  </div>
  
                  <div className="fw-semibold">
                    MongoDB
                  </div>
                </div>
              </Col>
  
              <Col sm={6}>
                <div className="bg-body-tertiary rounded-3 p-4 h-100">
                  <div className="small text-secondary mb-1">
                    Authentication
                  </div>
  
                  <div className="fw-semibold">
                    JSON Web Token
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default About