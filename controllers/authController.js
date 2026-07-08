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

exports.register = async (req, res) => {
  const { name, email, password } = req.validatedBody;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user =  await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    res.status(201).json({ success: true, message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Email already exists.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
