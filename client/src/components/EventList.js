import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_URL || "";

  const fetchEvents = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        const response = await axios.get(`${baseURL}/api/events/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventImage = (title) => {
    const seed = encodeURIComponent(title);
    return `https://picsum.photos/seed/${seed}/400/250`;
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Available Events</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
        </div>
      ) : events.length > 0 ? (
        <Row>
          {events.map((event) => (
            <Col key={event._id} md={4} className="mb-4">
              <Card className="event-card">
                <div className="card-image-wrapper">
                  <Card.Img 
                    variant="top" 
                    src={event.image 
                      ? `${baseURL}${event.image.startsWith('/uploads') ? event.image : `/uploads/\${event.image}`}` 
                      : getEventImage(event.title)
                    } 
                    alt={event.title} 
                    className="event-image"
                  />
                  <div className="event-title-overlay">
                    <h5>{event.title}</h5>
                  </div>
                  <div className="event-overlay">
                    <h5>{event.title}</h5>
                    <p>{event.description}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No events available at the moment.</p>
      )}
    </Container>
  );
};

export default EventList;
