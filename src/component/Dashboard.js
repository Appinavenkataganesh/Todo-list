import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../component/Dashboard.css';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
  const [sortBy, setSortBy] = useState('Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TODO'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [sortBy, searchQuery]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/tasks');
    let filteredTasks = response.data;

    // Filter tasks based on the search query
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks based on the sortBy value
    if (sortBy === 'TODO' || sortBy === 'In Progress' || sortBy === 'Done') {
      filteredTasks = filteredTasks.filter(task => task.status === sortBy);
    }

    setTasks(filteredTasks);
  } catch (err) {
    console.error(err);
  }
};

  const handleAddTask = () => {
    setViewMode(false);
    setEditTask(null);
    setNewTask({ title: '', description: '', status: 'TODO' });
    setPopupOpen(true);
  };

  const handleSaveTask = async () => {
    try {
      if (editTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, newTask);
      } else {
        await axios.post('http://localhost:5000/api/tasks', newTask);
      }
      fetchTasks();
      setPopupOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    setViewMode(false);
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setEditTask(task);
    setPopupOpen(true);
  };

  const handleViewDetails = (task) => {
    setViewMode(true);
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setEditTask(task);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setViewMode(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Dashboard</div>
        <div className="navbar-profile">
          <button type="button" className="log_dash" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="actions">
          <button className="add-task-button" onClick={handleAddTask}>Add Task</button>
        </div>

        <div className="search-sort-bar">
          <div className="search-bar">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="search_bar"
            />
          </div>
          <div className="sort-by">
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" value={sortBy} onChange={handleSortChange} className="sort-dropdown">
              <option >Recent</option>
              <option value="TODO">TODO</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>
      </div>

      <div className="task-containers">
        <div className="task-container" id="todo">
          <p className="heading_for">TODO</p>
          {tasks.filter(task => task.status === 'TODO').map(task => (
            <div key={task._id} className="task-item">
              <div className="task-content">
                <h4>{task.title}</h4>
                <p className="descr">{task.description}</p>
                <p className="creatat">Created At: {moment(task.createdDate).format('DD/MM/YYYY, h:mm:ss')}</p> {/* Format date here */}
              </div>
              <div className="task-buttons">
                <button className="delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                <button className="edit" onClick={() => handleEditTask(task)}>Edit</button>
                <button className="view-details" onClick={() => handleViewDetails(task)}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div className="task-container" id="in-progress">
          <p className="heading_for">In Progress</p>
          {tasks.filter(task => task.status === 'In Progress').map(task => (
            <div key={task._id} className="task-item">
              <div className="task-content">
                <h4>{task.title}</h4>
                <p className="descr">{task.description}</p>
                <p className="creatat">Created At: {moment(task.createdDate).format('DD/MM/YYYY, h:mm:ss')}</p> {/* Format date here */}
              </div>
              <div className="task-buttons">
                <button className="delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                <button className="edit" onClick={() => handleEditTask(task)}>Edit</button>
                <button className="view-details" onClick={() => handleViewDetails(task)}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div className="task-container" id="done">
          <p className="heading_for">Done</p>
          {tasks.filter(task => task.status === 'Done').map(task => (
            <div key={task._id} className="task-item">
              <div className="task-content">
                <h4>{task.title}</h4>
                <p className="descr">{task.description}</p>
                <p className="creatat">Created At: {moment(task.createdDate).format('DD/MM/YYYY, h:mm:ss')}</p> {/* Format date here */}
              </div>
              <div className="task-buttons">
                <button className="delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                <button className="edit" onClick={() => handleEditTask(task)}>Edit</button>
                <button className="view-details" onClick={() => handleViewDetails(task)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {popupOpen && (
        <div className="task-popup">
          <div className="popup-content">
            <h3>{viewMode ? 'Task Details' : (editTask ? 'Edit Task' : 'Add Task')}</h3>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              disabled={viewMode}
              className="input-field"
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              disabled={viewMode}
              className="input-field"
            ></textarea>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              disabled={viewMode}
              className="input-field"
            >
              <option value="TODO">TODO</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="popup-buttons">
              {!viewMode && <button onClick={handleSaveTask} className="save-button">Save</button>}
              {!viewMode && <button onClick={handleClosePopup} className="cancel-button">Cancel</button>}
              {viewMode && <button onClick={handleClosePopup} className="close-button">Close</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
