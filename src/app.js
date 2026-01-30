const express = require('express');
const authRoutes = require('./modules/auth/routes');
const userRoutes = require('./modules/users/routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;