import express from 'express'
import { getAllUsers, login, signUp } from '../controllers/userController.js';
import authUser from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup',signUp)
userRouter.post('/login',login)
userRouter.get('/all',authUser,getAllUsers)


export default userRouter;