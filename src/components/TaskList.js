"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", country: "" });
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setUsers(data.tasks);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.country) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchUsers();
        setNewUser({ name: "", email: "", country: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async () => {
    if (!editUser.name || !editUser.email || !editUser.country) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        fetchUsers();
        setEditUser(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

 const handleDeleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`/api/tasks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchUsers(); // Refresh UI after deletion
    } else {
      console.error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl p-6 bg-white border border-amber-600 shadow-lg rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">User List</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-purple-700"
        >
          <Plus size={20} /> Add New User
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Country</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.country}</td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">{editUser ? "Edit User" : "Add User"}</h3>
              <input
                type="text"
                placeholder="Name"
                value={editUser ? editUser.name : newUser.name}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, name: e.target.value })
                    : setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={editUser ? editUser.email : newUser.email}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Country"
                value={editUser ? editUser.country : newUser.country}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, country: e.target.value })
                    : setNewUser({ ...newUser, country: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditUser(null);
                    setNewUser({ name: "", email: "", country: "" });
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={editUser ? handleEditUser : handleAddUser}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  {editUser ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
