const express = require('express');
const authRoutes = require('./modules/auth/routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

module.exports = app;

const userRoutes = require('./modules/users/routes');
app.use('/users', userRoutes);
