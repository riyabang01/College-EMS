import React from 'react';

const Footer = () => {
  return (
    <footer className="footer fixed-bottom text-center">
      <p>&copy; {new Date().getFullYear()} College-EMS. All rights reserved.</p>
    </footer>
  );
};

export default Footer;