const express = require('express');
const router = express.Router();
const {signup, login, getCurrentUser, logout} = require('../controllers/authController');
const requireAuth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidation');

router.post('/signup',validate(registerSchema), signup);
router.post('/login',validate(loginSchema), login);
router.get('/me', requireAuth, getCurrentUser);
router.get('/logout', logout);

module.exports = router;