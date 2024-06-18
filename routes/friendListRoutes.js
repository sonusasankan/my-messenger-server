import express from 'express';
import { getFriends, addFriends } from '../controllers/friendListController.js';

const router = express.Router();

router.get('/:userId', getFriends);
router.post('/add', addFriends);

export default router;
