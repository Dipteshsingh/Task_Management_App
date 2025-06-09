import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema ({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['To Do','In Progress','Completed'],
    default:'To Do'
  },
  dueDate:{
    type:Date,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId, ref: 'User'
  },
},{timestamps:true})

const taskModel = mongoose.models.Task || mongoose.model('Task',taskSchema)

export default taskModel;