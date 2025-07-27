// src/pages/AdminArticleForm.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { databases, storage } from '../appwrite';
import { ID, Permission, Role, Query } from 'appwrite';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, SERIES_COLLECTION_ID, IMAGE_BUCKET_ID } from '../appwriteConst';

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
    imageUrl: '',
    content: '',
    seriesId: '',
    keyTakeaways: [],
    relatedArticles: [],
  });

  // State for dropdown options, fetched from Appwrite
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [seriesOptions, setSeriesOptions] = useState([]);
  const [allArticleOptions, setAllArticleOptions] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // This useEffect now fetches all data needed for the form from Appwrite
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        // Fetch all articles and series in parallel for the dropdowns
        const [articlesResponse, seriesResponse] = await Promise.all([
          databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID, [Query.limit(100)]), // Get up to 100 articles for options
          databases.listDocuments(DATABASE_ID, SERIES_COLLECTION_ID)
        ]);

        // Populate dropdown options from the fetched data
        const allDocs = articlesResponse.documents;
        setAllArticleOptions(allDocs.map(doc => ({ id: doc.$id, title: doc.title })));
        const uniqueCategories = [...new Set(allDocs.map(doc => doc.category).filter(Boolean))];
        setCategoryOptions(uniqueCategories);
        setSeriesOptions(seriesResponse.documents);

        // If we are editing an existing article, fetch its specific data
        if (isEditing) {
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
        }
      } catch (err) {
        setError('Failed to load form data from the database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [id, isEditing]);

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
      if (imageFile) {
        const uploadedFile = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          imageFile
        );
        finalImageUrl = uploadedFile.$id;
      }

      const dataToSave = { ...articleData, imageUrl: finalImageUrl };

      if (isEditing) {
        await databases.updateDocument(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          id,
          dataToSave
        );
        alert('Article updated successfully!');
      } else {
        await databases.createDocument(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          ID.unique(),
          dataToSave,
          [
            Permission.read(Role.any()),
            Permission.update(Role.user(currentUser.$id)),
            Permission.delete(Role.user(currentUser.$id)),
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

  if (loading) return <p>Loading form data...</p>;

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">
        {isEditing ? `Editing: ${articleData.title}` : 'Create New Article'}
      </h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                setOptions={{
                  height: 400,
                  buttonList: [
                    ['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'], ['removeFormat'], ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'], ['table', 'link', 'image', 'video'],
                    ['fullScreen', 'showBlocks', 'codeView'], ['preview', 'print'],
                  ],
                }}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">Excerpt / Subtitle</label>
              <textarea id="excerpt" name="excerpt" rows="3" value={articleData.excerpt} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">Author</label>
              <input id="author" name="author" type="text" value={articleData.author} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100" readOnly />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
              <select id="category" name="category" value={articleData.category} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="">Select a Category</option>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                {seriesOptions.map(series => <option key={series.$id} value={series.$id}>{series.title}</option>)}
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
