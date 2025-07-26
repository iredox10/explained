
// src/pages/AdminArticleForm.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData'; // We still use this for dropdowns
import { useAuth } from '../context/AuthContext';
import { databases, storage } from '../appwrite'; // Import storage
import { ID, Permission, Role } from 'appwrite';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

// --- Appwrite Configuration ---
// TODO: Replace with your actual Database and Collection IDs

const DATABASE_ID = '6885112e000227dd70e8';
const ARTICLES_COLLECTION_ID = '68853dd5002eaf879e95';
const IMAGE_BUCKET_ID = '6885418f0020cc88b27f'; // Add your Bucket ID here

export default function AdminArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditing = id !== 'new';

  const [articleData, setArticleData] = useState({
    title: '',
    author: '',
    category: '',
    excerpt: '',
    imageUrl: '', // This will now store the Appwrite File ID
    content: '',
    seriesId: '',
    keyTakeaways: [],
    relatedArticles: [],
  });
  const [imageFile, setImageFile] = useState(null); // State for the selected image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we are editing, fetch the article data from Appwrite
    const fetchArticle = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const document = await databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id);
          setArticleData({
            title: document.title,
            author: document.author,
            category: document.category || '',
            excerpt: document.excerpt || '',
            imageUrl: document.imageUrl || '',
            content: document.content,
            seriesId: document.seriesId || '',
            keyTakeaways: document.keyTakeaways || [],
            relatedArticles: document.relatedArticles || [],
          });
        } catch (err) {
          setError('Failed to fetch article data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchArticle();
  }, [id, isEditing]);

  // Set the author field automatically when the component loads for a new article
  useEffect(() => {
    if (!isEditing && currentUser) {
      setArticleData(prev => ({ ...prev, author: currentUser.name }));
    }
  }, [isEditing, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let finalImageUrl = articleData.imageUrl;

    try {
      // Step 1: Upload image if a new one is selected
      if (imageFile) {
        const uploadedFile = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          imageFile
        );
        finalImageUrl = uploadedFile.$id; // Get the ID of the uploaded file
      }

      const dataToSave = { ...articleData, imageUrl: finalImageUrl };

      if (isEditing) {
        // --- Update existing document ---
        await databases.updateDocument(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          id,
          dataToSave
        );
        alert('Article updated successfully!');
      } else {
        // --- Create new document ---
        await databases.createDocument(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          ID.unique(),
          dataToSave,
          [
            Permission.read(Role.any()), // Anyone can view this article
            Permission.update(Role.user(currentUser.$id)), // The author can update it
            Permission.delete(Role.user(currentUser.$id)), // The author can delete it
          ]
        );
        alert('Article created successfully!');
      }
      navigate('/admin/articles');
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Data for dropdowns (still from mock data for now) ---
  const authors = [...new Set(Object.values(MOCK_DATA.allArticles).map(a => a.author))];
  const categories = [...new Set(Object.values(MOCK_DATA.allArticles).map(a => a.category).filter(Boolean))];
  const allArticleOptions = Object.entries(MOCK_DATA.allArticles).map(([articleId, article]) => ({ id: articleId, title: article.title }));
  const seriesOptions = Object.values(MOCK_DATA.series);

  if (loading && isEditing) return <p>Loading article...</p>;

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
              <SunEditor
                setContents={articleData.content}
                onChange={handleContentChange}
                setOptions={{ height: 400, buttonList: [['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic'], ['align', 'list'], ['table', 'link', 'image']] }}
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
              <input id="author" name="author" type="text" value={articleData.author} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
              <select id="category" name="category" value={articleData.category} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="">Select a Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">Featured Image</label>
              {articleData.imageUrl && !imageFile && (
                <img
                  src={storage.getFilePreview(IMAGE_BUCKET_ID, articleData.imageUrl)}
                  alt="Current featured"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
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

        {error && <p className="text-sm text-center text-red-500 mt-4">{error}</p>}

        <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
          <Link to="/admin/articles" className="text-gray-600 hover:text-gray-800 mr-4">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
