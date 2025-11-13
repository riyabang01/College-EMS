import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="about-container my-5">
      <h2 className="text-center mb-3">About Us</h2> {/* Reduced margin-bottom */}
      <p className="mb-4">
        Welcome to <strong>Event Manager</strong>, your one-stop platform for discovering and managing exciting events. Our goal is to connect event organizers and participants in a seamless, user-friendly way.
      </p>
      <p className="mb-4">
        Whether you're looking to attend a concert, workshop, or conference, Event Manager has got you covered. Our platform offers a wide range of events to suit all interests and preferences.
      </p>
      <p className="mb-4">
        For event organizers, we provide powerful tools to create, promote, and manage events effortlessly. Join us today and be a part of an amazing community of event enthusiasts!
      </p>
      <h3 className="mt-5 mb-3">Our Mission</h3>
      <p className="mb-4">
        Our mission is to make event management and participation as easy and enjoyable as possible. We strive to provide a platform that is both intuitive and powerful, catering to the needs of both event organizers and attendees.
      </p>
      <h3 className="mt-5 mb-3">Our Vision</h3>
      <p className="mb-4">
        We envision a world where events are seamlessly organized and attended, bringing people together to share experiences and knowledge. Our vision is to be the leading platform for event management, known for our innovation and user-centric approach.
      </p>
      <h3 className="mt-5 mb-3">Our Values</h3>
      <ul className="mb-4">
        <li><span className="value-highlight">Innovation</span>: We continuously seek to improve and innovate our platform to meet the evolving needs of our users.</li>
        <li><span className="value-highlight">Community</span>: We believe in the power of community and strive to foster connections through events.</li>
        <li><span className="value-highlight">Excellence</span>: We are committed to providing the highest level of service and support to our users.</li>
        <li><span className="value-highlight">Integrity</span>: We operate with integrity and transparency in all our interactions.</li>
      </ul>
    </Container>
  );
};

export default About;