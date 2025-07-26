import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div>
      <h2>Admin Section</h2>
      <p>This is the main admin page.</p>
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminPage;
