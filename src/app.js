const express = require('express');
const authRoutes = require('./modules/auth/routes');
const userRoutes = require('./modules/users/routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


module.exports = app;