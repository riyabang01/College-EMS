import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError('User not authenticated');
          setTimeout(() => navigate('/login'), 1000); 
          return;
        }

        const response = await axios.get(`${baseURL}/api/events/myevents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyEvents(response.data); 
      } catch (error) {
        console.error('Error fetching my events:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          setError('Unauthorized access, please log in');
        } else {
          setError('Failed to fetch registered events. Please try again later.');
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchMyEvents();
  }, [navigate, baseURL]);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">My Registered Events</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : myEvents.length > 0 ? (
        <Row>
          {myEvents.map((event) => (
            <Col key={event._id} md={4} className="mb-4">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <Card.Text>📅 {new Date(event.date).toLocaleString()}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">You have no events yet.</Alert>
      )}
    </Container>
  );
};

export default MyEvents;
