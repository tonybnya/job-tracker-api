/**
 * Script Name : authMiddleware.js
 * Description : Enforce user session access control via token decryption
 * Usage       : node authMiddleware.js
 * Author      : @tonybnya
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Access denied. Token missing');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    sendError(res, 403, 'Invalid or expired token');
  }
}

module.exports = { authenticateToken, JWT_SECRET };
