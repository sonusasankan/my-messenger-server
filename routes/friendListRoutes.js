import express from 'express';
import { getFriends } from '../controllers/friendListController.js';

const router = express.Router();

router.get('/:userId', getFriends);

export default router;
