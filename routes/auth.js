import express from 'express';
import { register, login } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js'
import User from '../models/user.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

export default router;