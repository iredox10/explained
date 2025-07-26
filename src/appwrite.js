import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Set the Appwrite project configuration
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite API Endpoint
  .setProject('68850a7d0015db15f57a');   // Your Appwrite Project ID

// Initialize and export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
