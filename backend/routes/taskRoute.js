import express from 'express'
import { allTasks, createTask, deleteTask, updateTask } from '../controllers/taskController.js';
import authUser from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';


const taskRouter = express.Router();

taskRouter.post('/create',authUser,adminOnly, createTask)
taskRouter.get('/all',allTasks)
taskRouter.put('/update/:id',authUser,updateTask)
taskRouter.delete('/delete/:id',authUser,adminOnly,deleteTask)


export default taskRouter;