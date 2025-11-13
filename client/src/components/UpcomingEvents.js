import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Card, Button, Container, Row, Col, Alert } from "react-bootstrap";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("User not authenticated");
          return;
        }
    
        const response = await axios.get("http://localhost:8000/api/events/upcoming", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("📢 API Response:", response.data); // ✅ Check event data structure
        
        // ✅ Map 'id' to '_id'
        const mappedEvents = response.data.map(event => ({
          ...event,
          _id: event._id || event.id
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("❌ Error fetching events:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // ✅ Register for an event
  const handleRegister = async (eventId) => {
    if (!eventId) {
      console.error('❌ Invalid event ID:', eventId);
      setError('Invalid event ID');
      setTimeout(() => setError(''), 2000);
      return;
    }
  
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("User not authenticated");
        return;
      }
  
      console.log('📢 Registering for Event ID:', eventId); // ✅ Debug log
  
      const response = await axios.post(
        `http://localhost:8000/api/events/${eventId}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setMessage(response.data.message || "Registered successfully!");
  
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, isRegistered: true } : event
        )
      );
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register.");
      setTimeout(() => setError(""), 2000);
    }
  };

  // ✅ Unregister from an event
  const handleUnregister = async (eventId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("User not authenticated");
        setTimeout(() => setError(""), 2000);
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/events/${eventId}/unregister`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message || "Unregistered successfully!");

      // ✅ Update state based on server response
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, isRegistered: false } : event
        )
      );

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to unregister.");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>

      {loading && <Spinner animation="border" role="status" className="d-block mx-auto" />}
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      {message && <Alert variant="success" className="text-center">{message}</Alert>}

      <Row>
        {events.length > 0 ? (
          events.map((event) => (
            <Col md={4} key={event._id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <Card.Text>
                    📅 Date: <strong>{new Date(event.date).toLocaleDateString()}</strong>
                  </Card.Text>
                  <Card.Text>
                    📍 Location: <strong>{event.location}</strong>
                  </Card.Text>
                  {event.isRegistered ? (
                    <Button 
                      variant="danger" 
                      onClick={() => {
                        console.log("🛠️ Unregistering for event ID:", event._id); // ✅ Check event ID
                        handleUnregister(event._id);
                      }}
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        console.log("🛠️ Registering for event ID:", event._id); // ✅ Check event ID
                        handleRegister(event._id);
                      }}
                    >
                      Register
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          !loading && <p className="text-center">No upcoming events available.</p>
        )}
      </Row>
    </Container>
  );
};

export default UpcomingEvents;
