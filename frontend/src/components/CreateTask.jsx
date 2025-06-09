import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTask = ({ onTaskCreated }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.post('http://localhost:4000/api/task/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          token: token, 
        },
        withCredentials: true,
      });

      if (res.data.success) {
        onTaskCreated && onTaskCreated(res.data.task);
        setFormData({ title: '', description: '', dueDate: '', status: 'To Do' });
        navigate('/')
      } else {
        setError(res.data.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Task</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <input
          type="date"
          name="dueDate"
          className="w-full p-2 border rounded"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          className="w-full p-2 border rounded"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
