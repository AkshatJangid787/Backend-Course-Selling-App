
const { z } = require('zod');

const courseSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  price: z.number().positive('Price must be positive')
});

module.exports = { courseSchema };
