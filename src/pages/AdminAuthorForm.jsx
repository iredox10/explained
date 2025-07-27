
// src/pages/AdminAuthorForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account, databases, storage } from '../appwrite';
import { ID } from 'appwrite';
import { DATABASE_ID, USERS_COLLECTION_ID, AUTHOR_AVATAR_BUCKET_ID } from '../appwriteConst';

export default function AdminAuthorForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author',
    bio: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = '';
      // Step 1: Upload image if selected
      if (imageFile) {
        const uploadedFile = await storage.createFile(
          AUTHOR_AVATAR_BUCKET_ID,
          ID.unique(),
          imageFile
        );
        imageUrl = uploadedFile.$id;
      }

      // Step 2: Create the user in Appwrite Auth
      const newUser = await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        formData.name
      );

      // Step 3: Create the corresponding document in the 'users' collection
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        newUser.$id,
        {
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          imageUrl: imageUrl, // Save the file ID
        }
      );

      alert('User created successfully!');
      navigate('/admin/authors');

    } catch (err) {
      setError(err.message || 'Failed to create user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">Add New User</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" rows="3" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">Profile Picture</label>
              <input id="imageFile" name="imageFile" type="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="author">Author</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500 mt-4">{error}</p>}

          <div className="flex items-center justify-end mt-6 pt-6 border-t">
            <Link to="/admin/authors" className="text-gray-600 hover:text-gray-800 mr-4">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
