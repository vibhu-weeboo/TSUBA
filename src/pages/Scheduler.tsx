import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const Scheduler: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/scheduler/tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('/api/scheduler/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data.task]);
      setShowAddModal(false);
      setNewTask({ title: '', description: '', scheduledTime: '', priority: 'medium' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/scheduler/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/scheduler/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();
      setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Smart Scheduler</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold text-gray-800 mb-2 ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(task.scheduledTime).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPriorityColor(task.priority)
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No scheduled tasks. Create your first task above.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="datetime-local"
                  value={newTask.scheduledTime}
                  onChange={(e) => setNewTask({ ...newTask, scheduledTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
