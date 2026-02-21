import { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createConversation, getConversationController } from '../controllers/conversationController.js';

const router = Router();

router.get('/conversation', isAuthenticated, getConversationController);
router.post('/conversation/:receiverId', isAuthenticated, createConversation);

export default router;