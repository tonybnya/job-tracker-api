/**
 * Script Name : response.js
 * Description : Response helper utilities
 * Usage       : const { sendSuccess, sendError } = require('../utils/response');
 * Author      : @tonybnya
 */

function sendSuccess(res, status, data) {
  res.status(status).json({ success: true, data: data });
}

function sendError(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

module.exports = { sendSuccess, sendError };
