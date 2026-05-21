const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, me, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3, max: 30 }).withMessage('Username 3-30 chars')
      .matches(/^[a-zA-Z0-9_.]+$/).withMessage('Username can contain letters, numbers, _ and .'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isString().notEmpty().withMessage('Password required'),
  ],
  login
);

router.get('/me', protect, me);
router.post('/logout', protect, logout);

module.exports = router;
