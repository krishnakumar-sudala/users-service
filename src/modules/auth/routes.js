const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);

module.exports = router;
