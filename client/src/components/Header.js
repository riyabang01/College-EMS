import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="custom-navbar mb-4 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white fw-bold">
          Event Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Nav.Link as={Link} to="/" className="text-white text-decoration-none nav-link-custom">Home</Nav.Link>
                )}
                <Nav.Link as={Link} to="/about" className="text-white text-decoration-none nav-link-custom">About</Nav.Link>
                
                {user.role !== 'admin' && (
                  <Nav.Link as={Link} to="/contact" className="text-white text-decoration-none nav-link-custom">Contact</Nav.Link>
                )}
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin-dashboard" className="text-white text-decoration-none nav-link-custom">Admin Dashboard</Nav.Link>
                )}
                <Nav.Link onClick={logoutHandler} className="text-white text-decoration-none nav-link-custom" style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;