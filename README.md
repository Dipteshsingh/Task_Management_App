# Task Management System (Trello Lite)

A simplified task management system inspired by Trello, built with React (frontend) and Node.js + Express (backend).  
It supports secure communication with encrypted requests and responses, role-based access, real-time chat, and task management.

---

## Features

### Frontend (React)
- **Login Page**: Simulates authentication via email and password (static validation).
- **Dashboard Page**: Displays tasks in three columns — To Do, In Progress, Completed.
- **Task Management**:
  - Admin can create tasks.
  - Users can update task status and details.
  - Task details: title, description, status, due date.
  - Drag & drop to change task status (bonus feature).
- **Chat Functionality**: Real-time one-to-one chat between Admin and User.
- **State Management**: Uses Redux Toolkit or Context API.
- **Styling**: Built with Tailwind CSS.

### Backend (Node.js with Express)
- **User Roles**: Admin and User with role-based permissions.
- **API Endpoints**:
  - `POST /signup` - Signup with email, password, and age.
  - `POST /login` - Login and receive JWT token.
  - `GET /tasks` - Fetch all tasks (User/Admin).
  - `POST /tasks` - Create a new task (Admin only).
  - `PUT /tasks/:id` - Update a task (User/Admin).
  - `DELETE /tasks/:id` - Delete a task (Admin only).
- **Security**:
  - Requests and responses encrypted/decrypted using CryptoJS.
  - JWT authentication middleware for route protection.
- **Real-time Chat**:
  - Supports one-to-one chat between User and Admin.
- **Database**: MongoDB for storing users, tasks, and messages.

### Additional Features
- Nodemailer integration to notify Admin by email whenever a User updates a task.
- Role-based access control.
- Live chat using WebSocket (e.g., Socket.io).

---

## Installation & Setup

### Backend
1. Clone the repo  
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name/backend
Install dependencies

npm install
Configure environment variables
Create .env file with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
Run backend server


npm start
Frontend
Navigate to frontend directory


cd ../frontend
Install dependencies

npm install
Run frontend

npm start
Usage
Register and login.

Admin can create tasks.

Users can update tasks and chat with Admin.

Drag and drop tasks across columns to update status.

Admin receives email notifications when tasks are updated.

Technologies Used
React, Redux Toolkit / Context API

Tailwind CSS / Bootstrap

Node.js, Express

MongoDB, Mongoose

CryptoJS (encryption/decryption)

JWT Authentication

Nodemailer

Socket.io (for live chat)

Contributing
Contributions are welcome! Please open an issue or submit a pull request.



Contact
GitHub: [dipteshsingh1845](https://github.com/Dipteshsingh1845)

Email: diptesh.singh73@gmail.com
