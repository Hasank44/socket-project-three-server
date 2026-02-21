import { Router } from 'express';
import {
    getAllUsersForConversation, getUserController, userLoginController, userLogoutController,
    userRegisterController
} from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';


const router = Router();

router.get('/me', isAuthenticated, getUserController);
router.get('/users/available', isAuthenticated, getAllUsersForConversation);
router.post('/register', userRegisterController);
router.post('/login', userLoginController);
router.post('/logout', isAuthenticated , userLogoutController);

export default router;