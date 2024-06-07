import express from 'express';

import {getMessages, sendMessage, getMostRecentFriend } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', sendMessage);
router.get('/recent/:userId', getMostRecentFriend);

export default router
