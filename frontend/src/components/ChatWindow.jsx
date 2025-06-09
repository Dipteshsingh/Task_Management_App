import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000', {
  withCredentials: true,
});

const ChatWindow = ({ userId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const bottomRef = useRef(null);

  // Fetch old messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/chat/chats/${userId}/${otherUserId}`, {
        headers: { token },
        withCredentials: true,
      });
      if (res.data.success) {
        setMessages(res.data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    socket.emit('user_connected', userId); 
  }, [userId, otherUserId]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (
        (data.sender === otherUserId && data.receiver === userId) ||
        (data.sender === userId && data.receiver === otherUserId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    const msgData = {
      sender: userId,
      receiver: otherUserId,
      message: inputMsg,
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, { ...msgData, timestamp: new Date() }]);
    setInputMsg('');
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Chat with {otherUserId}</h2>

      <div className="h-80 overflow-y-auto border p-2 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === userId ? 'bg-blue-500 text-white text-right' : 'bg-gray-300 text-left'
            }`}
          >
            <div>{msg.message}</div>
            <div className="text-xs mt-1 opacity-75">{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="mt-3 flex">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border px-3 py-1 rounded mr-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
