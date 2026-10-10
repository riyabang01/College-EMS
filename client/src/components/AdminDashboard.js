import React, { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { Container, Table, Button, Form, Modal, Spinner } from "react-bootstrap";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", location: "" });
  const [registrants, setRegistrants] = useState([]);
  const [showRegistrantsModal, setShowRegistrantsModal] = useState(false);


  const fetchEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No token found");
  
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
  
      const response = await API.get("/api/events/admin-events", config);
      console.log("Events fetched:", response.data); 
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchEvents();
  }, []);

  
  const fetchRegistrants = async (eventId) => {
    try {
      const response = await API.get(`/api/events/${eventId}/registrants`);
      setRegistrants(Array.isArray(response.data) ? response.data : []);
      setShowRegistrantsModal(true);
    } catch (error) {
      console.error("Error fetching registrants:", error);
      setRegistrants([]);
    }
  };


  const handleShowModal = (event = null) => {
    if (event) {
      setEditMode(true);
      setCurrentEventId(event._id);
      setNewEvent({
        title: event.title,
        description: event.description,
        date: event.date.split("T")[0], 
        location: event.location || "",
      });
    } else {
      setEditMode(false);
      setCurrentEventId(null);
      setNewEvent({ title: "", description: "", date: "", location: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
      const formData = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location,
      };

      let response;
      if (editMode) {
        response = await API.put(`/api/events/${currentEventId}`, formData, config);
      } else {
        response = await API.post("/api/events", formData, config);
      }

      if (response.status === 200 || response.status === 201) {
        fetchEvents();
        setShowModal(false);
        setNewEvent({ title: "", description: "", date: "", location: "" });
      }
    } catch (error) {
      console.error("Error creating/updating event:", error);
    }
  };

  
  const handleDelete = async (eventId) => {
    try {
      await API.delete(`/api/events/${eventId}`);
      fetchEvents(); 
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Container className="admin-dashboard-container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => fetchRegistrants(event._id)}
                    className="me-2"
                  >
                    <i className="bi bi-eye"></i> View Registrants
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleShowModal(event)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(event._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}


      <Button variant="primary" onClick={() => handleShowModal()}>
        Create New Event
      </Button>

   
      <Modal show={showRegistrantsModal} onHide={() => setShowRegistrantsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrants for the Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registrants.length > 0 ? (
            <ul>
              {registrants.map((registrant) => (
                <li key={registrant._id}>
                  <strong>Name:</strong> {registrant.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No registrants for this event.</p>
          )}
        </Modal.Body>
      </Modal>

      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Event" : "Create New Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              {editMode ? "Update Event" : "Create Event"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
