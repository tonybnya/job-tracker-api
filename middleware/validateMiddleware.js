/**
 * Script Name : validateMiddleware.js
 * Description : Helper to compile and format structural validation rules dynamically
 * Usage       : node validateMiddleware.js
 * Author      : @tonybnya
 */

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }
  req.validatedBody = result.data;
  next();
};

module.exports = validateBody;
