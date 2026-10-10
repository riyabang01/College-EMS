const jwt = require('jsonwebtoken');


const payload = { id: "userID123", name: "Riya" };


const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Generated Token:', token);
