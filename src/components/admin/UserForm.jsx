import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_DATA } from '../../data/mockData';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('author');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const user = MOCK_DATA.users[id];
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically dispatch an action to save the data
    console.log({ id, name, email, role });
    navigate('/admin/users');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border">
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default UserForm;
