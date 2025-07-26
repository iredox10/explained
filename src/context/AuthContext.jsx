import React, { createContext, useState, useContext, useEffect } from 'react';
import { account, databases } from '../appwrite'; // Import from our appwrite.js
import { ID } from 'appwrite';

const AuthContext = createContext();

// --- Appwrite Database Configuration ---
// TODO: Replace with your actual Database and Collection IDs from Appwrite
const DATABASE_ID = '6885112e000227dd70e8';
const USERS_COLLECTION_ID = '68851166000a041829a4';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const userAccount = await account.get();
        // If user is logged in, fetch their custom data from the database
        const userDocument = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userAccount.$id // The user's ID is the document ID
        );
        setCurrentUser({ ...userAccount, ...userDocument });
      } catch (err) {
        // Not logged in
        setCurrentUser(null);
      }
      setLoading(false);
    };
    checkLoggedInUser();
  }, []);

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    // After session is created, re-fetch user data to update context
    const userAccount = await account.get();
    const userDocument = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userAccount.$id
    );
    setCurrentUser({ ...userAccount, ...userDocument });
  };

  const logout = async () => {
    await account.deleteSession('current');
    setCurrentUser(null);
  };

  const value = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
