import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:4000/api/task/all', {
        headers: { token },
        withCredentials: true,
      });

      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/user/all', {
        headers: { token },
        withCredentials: true,
      });
      if (res.data.success) {
        const currentUser = jwtDecode(token).id;
        const filteredUsers = res.data.users.filter((u) => u._id !== currentUser);
        setUsers(filteredUsers);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
    navigate('/login'); 
  }
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);

      fetchTasks();
      if (decoded.role === 'Admin') {
        fetchUsers();
      } else {

        fetchUsers();
      }
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:4000/api/task/delete/${id}`, {
        headers: { token },
        withCredentials: true,
      });

      if (res.data.success) {
        fetchTasks();
      } else {
        console.error(res.data.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };
  const handleEdit = (task) => {
    navigate(`/edit/${task._id}`, { state: { task } });
  };



  const renderTasksByStatus = (status) =>
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task._id} className="bg-white p-4 rounded shadow mb-3">
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate?.substring(0, 10)}</p>
          <div className="flex justify-end gap-2 mt-2">
            

            {role === 'Admin' ? (
              <button
                onClick={() => handleDelete(task._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            ):(<button
              onClick={() => handleEdit(task)}

              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>)
          }
          </div>
        </div>
      ));

  useEffect(() => {
    fetchTasks();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);

      if (decoded.role === 'Admin') {
        fetchUsers();
      }
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-3">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Logout
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {role === 'Admin' ? (
          <Link
            to="/create"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Task
          </Link>
        ) : (
          <div className="w-[110px]" />
        )}
      </div>


      {users.length > 0 && (
        <div className="mb-4">
          <Link
            to={`/chat/${users.find((u) => u.role === (role === 'Admin' ? 'User' : 'Admin'))?._id || ''
              }`}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Chat with {role === 'Admin' ? 'User' : 'Admin'}
          </Link>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-600">To Do</h2>
          {renderTasksByStatus('To Do')}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-yellow-600">In Progress</h2>
          {renderTasksByStatus('In Progress')}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-green-600">Completed</h2>
          {renderTasksByStatus('Completed')}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
