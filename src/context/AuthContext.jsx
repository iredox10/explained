
// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// This is our mock "database" of users
const USERS = {
  admin: { name: 'Admin User', role: 'admin' },
  author: { name: 'Aisha Bello', role: 'author' }, // We'll use Aisha as our example author
};

export function AuthProvider({ children }) {
  // We'll set the initial user to be an author for demonstration
  const [currentUser, setCurrentUser] = useState(USERS.author);

  // In a real app, you'd have login/logout functions here
  // For now, we can add a function to switch users for testing
  const switchUser = (role) => {
    setCurrentUser(USERS[role]);
  };

  const value = { currentUser, switchUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily access the auth context
export function useAuth() {
  return useContext(AuthContext);
}
