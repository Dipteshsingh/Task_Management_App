import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import sendMail from "../config/nodemailer.js";

// create tasks---
const createTask = async (req,res)=>{
  const {title,description,status,dueDate} = req.body;
  const createdBy = req.user.id;
  try {
    const user = await userModel.findById(createdBy)
    if (user.role !=='Admin') {
      return res.json({
        success: false, 
        message: "Only admin can create tasks"
      })
    }
    const task = new taskModel({
      title,
      description,
      dueDate,
      createdBy
    })
    await task.save()
    return res.json({
      success: true, 
      message: "Task created", task
    })
  } catch (error) {
    return res.json({ 
      success: false, message: error.message
     });
  }
}

// get all tasks----
const allTasks = async (req,res)=>{
  try {
    const tasks = await taskModel.find().populate('createdBy','firstName lastName email role')
    return res.json({
      success:true,
      tasks

    })
  } catch (error) {
    return res.json({ 
      success: false, message: error.message
     });
  }
}

// update task----

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const task = await taskModel.findById(id);
    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    if (req.user.role === 'Admin') {
      return res.json({
        success: false,
        message: "Admins are not allowed to update tasks",
      });
    }

    task.status = status;
    const updatedTask = await task.save();

    const admin = await userModel.findOne({ role: "Admin" });
    if (admin?.email) {
      await sendMail(
        admin.email,
        "Task Updated by User",
        `Task "${task.title}" status updated to "${status}" by ${req.user.email}`,
        `<p>User <b>${req.user.email}</b> updated the task: <b>${task.title}</b> to status: <b>${status}</b></p>`
      );
    }

    res.json({
      success: true,
      message: "Task updated",
      updatedTask,
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// delete task---
const deleteTask = async (req,res)=>{
  const {id} = req.params;
  const user = req.user;
  try {
    if (user.role !=='Admin') {
      return res.json({
        success:false,
        message:'Only admin can delete tasks'
      })
    }
    await taskModel.findByIdAndDelete(id)
    return res.json({
      success:true,
      message:'Task deleted'
    })
  } catch (error) {
    return res.json({ 
      success: false, message: error.message
     });
  }
}

export {createTask,allTasks,updateTask,deleteTask}