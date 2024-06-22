import express from 'express';
import { getFriends, addFriends, removeFriends } from '../controllers/friendListController.js';

const router = express.Router();

router.get('/:userId', getFriends);
router.post('/add', addFriends);
router.post('/remove', removeFriends);

export default router;
