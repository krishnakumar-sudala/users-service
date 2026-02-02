const express = require('express');
const cors = require('cors');  //added for CORS support so that I can run a html form from localhost:8084 using python3 -m http.server 8084

const authRoutes = require('./modules/auth/routes');
const userRoutes = require('./modules/users/routes');

const app = express();

// ⭐ Enable CORS BEFORE any routes 
app.use(cors({ origin: 'http://localhost:8084', // or '*' during development 
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
allowedHeaders: ['Content-Type', 'Authorization'] })); 

// Handle preflight requests explicitly (optional but recommended) 
app.options('*', cors());


//app.use(express.json());
// Apply JSON parsing ONLY to routes that expect JSON 
app.use('/auth', express.json()); 
app.use('/users', express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


module.exports = app;