/**
 * Script Name : validateMiddleware.js
 * Description : Helper to compile and format structural validation rules dynamically
 * Usage       : node validateMiddleware.js
 * Author      : @tonybnya
 */

const { sendError } = require('../utils/response');

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return sendError(res, 400, result.error.format());
  }
  req.validatedBody = result.data;
  next();
};

module.exports = validateBody;
