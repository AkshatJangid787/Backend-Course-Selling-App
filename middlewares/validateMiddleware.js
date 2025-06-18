const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Zod validation
    next();
  } catch (err) {
    const error = err.errors?.[0]?.message || 'Invalid input';
    res.status(400).json({ msg: error });
  }
};

module.exports = validate;
