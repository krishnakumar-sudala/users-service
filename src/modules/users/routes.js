const express = require('express');
const controller = require('./controller');
const authenticate = require('../../middleware/auth');
const requireRole = require('../../middleware/rbac');

const router = express.Router();

router.get('/me', authenticate, controller.me);

router.get('/', authenticate, requireRole(['admin']), controller.list);
router.patch('/:id', authenticate, requireRole(['admin']), controller.update);
router.delete('/:id', authenticate, requireRole(['admin']), controller.remove);

module.exports = router;
