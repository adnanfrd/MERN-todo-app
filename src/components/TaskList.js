"use client";
import { useState, useEffect } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks").then((res) => res.json()).then(setTasks);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-md shadow-sm"
          >
            <span className="flex-1 text-gray-800 text-center sm:text-left">{task.title}</span>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                ✔
              </button>
              <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                ✏
              </button>
              <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}