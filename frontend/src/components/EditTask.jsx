import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTask = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });

  useEffect(() => {
  if (!task) {
   const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:4000/api/task/${id}`, {
          headers: { token },
          withCredentials: true,
        });

        if (res.data.success) {
          const fetchedTask = res.data.task;
          setFormData({
            title: fetchedTask.title || '',
            description: fetchedTask.description || '',
            dueDate: fetchedTask.dueDate?.substring(0, 10) || '',
            status: fetchedTask.status || 'To Do',
          });
        }
      } catch (err) {
        console.error('Error fetching task by ID:', err.message);
      }
    };

    fetchTask();
  } else {
    
    setFormData({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate?.substring(0, 10) || '',
      status: task.status || 'To Do',
    });
  }
}, [task, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(`http://localhost:4000/api/task/update/${id}`, formData, {
        headers: { token },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate('/');
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
