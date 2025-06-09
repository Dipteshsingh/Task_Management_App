import chatModel from '../models/chatModel.js';

export const getChats = async (req, res) => {
  const { userId, otherUserId } = req.params;
  if (!userId || !otherUserId) {
    return res.status(400).json({ success: false, message: "userId and otherUserId are required" });
  }

  try {
    const chats = await chatModel.find({
      $or: [
        { sender: userId, reciever: otherUserId },
        { sender: otherUserId, reciever: userId }
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
