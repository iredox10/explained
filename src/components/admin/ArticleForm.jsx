import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css'; // Import Quill's CSS
import { MOCK_DATA } from '../../data/mockData';

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const article = MOCK_DATA.allArticles[id];
      if (article) {
        setTitle(article.title);
        setAuthor(article.author);
        setCategory(article.category);
        setContent(article.content);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically dispatch an action to save the data
    console.log({ id, title, author, category, content });
    navigate('/admin/articles');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Author</label>
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Content</label>
        <ReactQuill theme="snow" value={content} onChange={setContent} className="w-full p-2 border" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
};

export default ArticleForm;
