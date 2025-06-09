import React from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const { otherUserId } = useParams();
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id || decoded._id; 

  return (
    <ChatWindow userId={userId} otherUserId={otherUserId} />
  );
};

export default ChatPage;
