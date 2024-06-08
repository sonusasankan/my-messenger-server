import express from 'express';

import {getMessages, sendMessage, getMostRecentFriend, loadMore } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', sendMessage);
router.get('/recent/:userId', getMostRecentFriend);
router.get('/load', loadMore);


export default router
