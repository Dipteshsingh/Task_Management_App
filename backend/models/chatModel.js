import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true })

const chatModel = mongoose.models.Chat || mongoose.model('Chat', chatSchema)

export default chatModel
