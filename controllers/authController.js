/**
 * Script Name : authController.js
 * Description : Auth controller layer
 * Usage       : node authController.js
 * Author      : @tonybnya
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { sendSuccess, sendError } = require('../utils/response');

exports.register = async (req, res) => {
  const { name, email, password } = req.validatedBody;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user =  await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    sendSuccess(res, 201, { userId: user.id });
  } catch (error) {
    sendError(res, 400, 'Email already exists.');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return sendError(res, 401, 'Invalid email or password.');
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
  sendSuccess(res, 200, { token, user: { id: user.id, name: user.name, email: user.email } });
};
