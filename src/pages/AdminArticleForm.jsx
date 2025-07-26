import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
// Import SunEditor
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

export default function AdminArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [articleData, setArticleData] = useState({
    title: '',
    author: '',
    category: '',
    excerpt: '',
    imageUrl: '',
    content: '',
    seriesId: '',
    keyTakeaways: [],
    relatedArticles: [],
  });

  useEffect(() => {
    if (isEditing) {
      const existingArticle = MOCK_DATA.allArticles[id];
      if (existingArticle) {
        setArticleData({
          ...existingArticle,
          keyTakeaways: existingArticle.keyTakeaways || [],
          relatedArticles: existingArticle.relatedArticles || [],
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  // The onChange handler for SunEditor is the same as for ReactQuill
  const handleContentChange = (value) => {
    setArticleData(prev => ({ ...prev, content: value }));
  };

  const handleMultiSelectChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setArticleData(prev => ({ ...prev, relatedArticles: values }));
  };

  const handleTakeawaysChange = (e) => {
    const takeaways = e.target.value.split('\n').filter(t => t.trim() !== '');
    setArticleData(prev => ({ ...prev, keyTakeaways: takeaways }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Article Data:', articleData);
    alert('Article saved! (Check console for data)');
    navigate('/admin/articles');
  };

  // --- Data for dropdowns ---
  const authors = [...new Set(Object.values(MOCK_DATA.allArticles).map(a => a.author))];
  const categories = [...new Set(Object.values(MOCK_DATA.allArticles).map(a => a.category).filter(Boolean))];
  const allArticleOptions = Object.entries(MOCK_DATA.allArticles).map(([articleId, article]) => ({ id: articleId, title: article.title }));
  const seriesOptions = Object.values(MOCK_DATA.series);

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">
        {isEditing ? `Editing: ${articleData.title}` : 'Create New Article'}
      </h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={articleData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
              {/* Replace ReactQuill with SunEditor */}
              <SunEditor
                setContents={articleData.content}
                onChange={handleContentChange}
                setOptions={{
                  height: 400,
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                  ],
                }}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">Excerpt / Subtitle</label>
              <textarea id="excerpt" name="excerpt" rows="3" value={articleData.excerpt} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
            </div>
          </div>

          {/* Metadata Column */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">Author</label>
              <select id="author" name="author" value={articleData.author} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="">Select an Author</option>
                {authors.map(author => <option key={author} value={author}>{author}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
              <select id="category" name="category" value={articleData.category} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="">Select a Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">Featured Image URL</label>
              <input id="imageUrl" name="imageUrl" type="text" value={articleData.imageUrl} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seriesId">Part of a Series</label>
              <select id="seriesId" name="seriesId" value={articleData.seriesId} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="">None</option>
                {seriesOptions.map(series => <option key={series.id} value={series.id}>{series.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keyTakeaways">Key Takeaways (one per line)</label>
              <textarea id="keyTakeaways" name="keyTakeaways" rows="4" value={articleData.keyTakeaways.join('\n')} onChange={handleTakeawaysChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedArticles">Related Articles</label>
              <select id="relatedArticles" name="relatedArticles" multiple value={articleData.relatedArticles} onChange={handleMultiSelectChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 h-32">
                {allArticleOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
          <Link to="/admin/articles" className="text-gray-600 hover:text-gray-800 mr-4">
            Cancel
          </Link>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Article
          </button>
        </div>
      </form>
    </div>
  );
}
