/**
 * Script Name : authRoutes.js
 * Description : Routes layer for auth
 * Usage       : node authRoutes.js
 * Author      : @tonybnya
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateBody = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/appSchemas');

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

module.exports = router;
