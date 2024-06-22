import express from 'express';
import { createUser, getUser, getAllUsers } from '../controllers/userController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', createUser);
router.get('/user/:userid', getUser);
router.get('/allUsers', auth, getAllUsers);

export default router;


