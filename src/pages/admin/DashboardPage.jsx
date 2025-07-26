import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <p className="text-lg mb-8">Welcome to the admin dashboard! From here you can manage articles and users.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Manage Articles</h3>
          <p className="text-gray-700 mb-4">Create, edit, and delete articles.</p>
          <Link to="/admin/articles" className="text-blue-600 hover:underline font-medium">Go to Articles</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Manage Users</h3>
          <p className="text-gray-700 mb-4">Create, edit, and delete user accounts.</p>
          <Link to="/admin/users" className="text-blue-600 hover:underline font-medium">Go to Users</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
