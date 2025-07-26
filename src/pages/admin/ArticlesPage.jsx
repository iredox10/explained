import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../../data/mockData';

const ArticlesPage = () => {
  const articles = Object.entries(MOCK_DATA.allArticles).map(([id, article]) => ({ id, ...article }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Articles</h2>
        <Link to="/admin/articles/new" className="bg-blue-500 text-white px-4 py-2 rounded">New Article</Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Author</th>
            <th className="py-2">Category</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td className="border px-4 py-2">{article.title}</td>
              <td className="border px-4 py-2">{article.author}</td>
              <td className="border px-4 py-2">{article.category}</td>
              <td className="border px-4 py-2">
                <Link to={`/admin/articles/${article.id}/edit`} className="text-blue-500">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesPage;
