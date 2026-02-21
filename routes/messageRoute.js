import { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getMessagesController, sendMessageController } from '../controllers/messageController.js';

const router = Router();

router.get('/message/:conversationId', isAuthenticated, getMessagesController);
router.post('/send/message/:conversationId', isAuthenticated, sendMessageController);

export default router;