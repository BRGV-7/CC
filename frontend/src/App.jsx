import { useEffect, useState } from 'react';

const MOCK_STORAGE_KEY = 'student-task-manager-local';
const DEFAULT_TASKS = [
  { id: 'task-1', title: 'Review CloudFormation stack', completed: false },
  { id: 'task-2', title: 'Prepare AWS architecture notes', completed: true },
  { id: 'task-3', title: 'Demonstrate Lambda and DynamoDB flow', completed: false }
];

const getConfiguredApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || '';
  return url.trim();
};

const isMockMode = () => {
  const configuredUrl = getConfiguredApiUrl();
  return !configuredUrl || configuredUrl.includes('your-api-id') || configuredUrl.includes('example');
};

const readMockTasks = () => {
  try {
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Unable to read mock tasks from localStorage.', error);
  }

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
  return DEFAULT_TASKS;
};

const writeMockTasks = (tasks) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(tasks));
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');

      if (isMockMode()) {
        setTasks(readMockTasks());
        return;
      }

      const API_URL = getConfiguredApiUrl();
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || data || []);
    } catch (err) {
      setError('Unable to load tasks. Check the API URL or deployed backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    try {
      if (isMockMode()) {
        const newTask = {
          id: `task-${Date.now()}`,
          title: title.trim(),
          completed: false
        };

        const updatedTasks = [newTask, ...readMockTasks()];
        writeMockTasks(updatedTasks);
        setTasks(updatedTasks);
        setTitle('');
        setError('');
        return;
      }

      const API_URL = getConfiguredApiUrl();
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      setTitle('');
      await fetchTasks();
    } catch (err) {
      setError('Unable to add task.');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      if (isMockMode()) {
        const updatedTasks = readMockTasks().map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        );
        writeMockTasks(updatedTasks);
        setTasks(updatedTasks);
        return;
      }

      const API_URL = getConfiguredApiUrl();
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks();
    } catch (err) {
      setError('Unable to update task status.');
    }
  };

  const deleteTask = async (id) => {
    try {
      if (isMockMode()) {
        const updatedTasks = readMockTasks().filter((task) => task.id !== id);
        writeMockTasks(updatedTasks);
        setTasks(updatedTasks);
        return;
      }

      const API_URL = getConfiguredApiUrl();
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (err) {
      setError('Unable to delete task.');
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Student Task Manager</h1>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task"
            aria-label="Task title"
          />
          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="status-text">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="status-text">No tasks yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                <span>{task.title}</span>
                <div className="task-actions">
                  <button onClick={() => toggleTask(task.id, task.completed)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
