import express from 'express';
import { getChats } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/chats/:userId/:otherUserId', getChats);

export default chatRouter;
