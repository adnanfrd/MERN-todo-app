"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetch("/api/tasks").then((res) => res.json()).then(setTasks);
  }, []);

  const handleAddTask = async () => {
    if (!newTask) return;
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    if (response.ok) {
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask("");
      setIsModalOpen(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleEditTask = async () => {
    if (!editTask) return;
    const response = await fetch(`/api/tasks/${editTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTask.title }),
    });
    if (response.ok) {
      setTasks(tasks.map((task) => (task.id === editTask.id ? { ...task, title: editTask.title } : task)));
      setEditTask(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Task List</h2>
      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-purple-700">
        <Plus size={20} /> Add New
      </button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-md shadow-sm">
            <span className="flex-1 text-gray-800">{task.title}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditTask(task)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDeleteTask(task.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">{editTask ? "Edit Task" : "Add Task"}</h3>
            <input
              type="text"
              value={editTask ? editTask.title : newTask}
              onChange={(e) => editTask ? setEditTask({ ...editTask, title: e.target.value }) : setNewTask(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
              <button onClick={editTask ? handleEditTask : handleAddTask} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editTask ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
