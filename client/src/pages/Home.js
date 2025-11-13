import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import EventList from '../components/EventList'; // Event List included

const Home = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  if (user && user.role === 'admin') {
    return null; // Render nothing if the user is an admin
  }

  return (
    <Container className="mt-5">
      {/* Welcome Message */}
      <h1 className="text-center mb-5">Welcome to Event Manager</h1>

      {/* Event Categories */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="mb-4 shadow-lg card-hover">
            <Card.Body>
              <Card.Title className="fw-bold">Upcoming Events</Card.Title>
              <Card.Text>
                Check out the upcoming events and register for the ones you are interested in.
              </Card.Text>
              <Card.Link as={Link} to="/upcoming-events" className="btn btn-primary">
                View Events
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-lg card-hover">
            <Card.Body>
              <Card.Title className="fw-bold">My Events</Card.Title>
              <Card.Text>
                View and manage the events you have registered for.
              </Card.Text>
              <Card.Link as={Link} to="/my-events" className="btn btn-success">
                My Events
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-lg card-hover">
            <Card.Body>
              <Card.Title className="fw-bold">Contact Us</Card.Title>
              <Card.Text>
                Have any questions or need support? Get in touch with us.
              </Card.Text>
              <Card.Link as={Link} to="/contact" className="btn btn-info">
                Contact Us
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Event List Section */}
      <EventList />
    </Container>
  );
};

export default Home;
