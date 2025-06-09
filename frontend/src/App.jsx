import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Dashboard'
import CreateTask from './components/CreateTask'
import Login from './pages/Login'
import Signup from './pages/Signup'

import ChatPage from './pages/ChatPage'
import EditTask from './components/EditTask'
const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<CreateTask />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/edit/:id' element={<EditTask />} />
        <Route path='/chat/:otherUserId' element={<ChatPage />} />

      </Routes>
    </div>
  )
}

export default App;