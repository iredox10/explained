import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // Mock data for a single user (in a real app, this would be fetched from an API)
  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = () => {
      const mockUsers = [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'author' },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'author' },
      ];
      const user = mockUsers.find(u => u.id === parseInt(id));
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      } else {
        // Handle user not found, e.g., redirect to 404 or users list
        navigate('/admin/users');
      }
    };
    fetchUserData();
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Updating user ${id} with:`, { name, email, role });
    // In a real application, you would send this data to your backend API
    navigate('/admin/users');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit User {id}</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
          <select
            id="role"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update User
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
