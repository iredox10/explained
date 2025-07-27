
// src/pages/AdminOrderManager.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../appwrite';
import { FiSave } from 'react-icons/fi';
import { DragDropContext } from 'react-beautiful-dnd';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, LAYOUTS_COLLECTION_ID } from '../appwriteConst';
import { ID, Permission, Role, Query } from 'appwrite';
import HomepageLayoutForm from '../components/admin/orderManager/HomepageLayoutForm';
import ExplainersPageLayoutForm from '../components/admin/orderManager/ExplainersPageLayoutForm';

export default function AdminOrderManager() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [layoutData, setLayoutData] = useState(null);
  const [layoutDocId, setLayoutDocId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const articlesResponse = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID, [Query.limit(100)]);
        const allDocs = articlesResponse.documents;
        setAllArticles(allDocs);

        const layoutResponse = await databases.listDocuments(
          DATABASE_ID,
          LAYOUTS_COLLECTION_ID,
          [Query.equal('pageName', selectedPage)]
        );

        if (layoutResponse.documents.length > 0) {
          const layoutDoc = layoutResponse.documents[0];
          setLayoutData(layoutDoc);
          setLayoutDocId(layoutDoc.$id);
          setIsEditing(true);
        } else {
          const defaultLayout = {
            pageName: selectedPage,
            ...(selectedPage === 'homepage' && {
              mainStoryId: allDocs.length > 0 ? allDocs[0].$id : '',
              topStoryIds: [], // Start with empty lists
              secondaryStoryIds: []
            }),
            ...(selectedPage === 'explainersPage' && {
              featuredStoryId: allDocs.length > 0 ? allDocs[0].$id : '',
              articleIds: []
            }),
          };
          setLayoutData(defaultLayout);
          setLayoutDocId(null);
          setIsEditing(false);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your Appwrite IDs and permissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPage]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListKey = source.droppableId;
    const destListKey = destination.droppableId;

    // Get the ID of the dragged article
    const draggedArticleId = result.draggableId;

    setLayoutData(prev => {
      const newLayout = { ...prev };

      // If moving from the 'available' pool, it's not in a list in layoutData
      if (sourceListKey !== 'available') {
        const sourceList = Array.from(newLayout[sourceListKey] || []);
        sourceList.splice(source.index, 1);
        newLayout[sourceListKey] = sourceList;
      }

      // If moving to a real list (not the 'available' pool)
      if (destListKey !== 'available') {
        const destList = Array.from(newLayout[destListKey] || []);
        destList.splice(destination.index, 0, draggedArticleId);
        newLayout[destListKey] = destList;
      }

      return newLayout;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setLayoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const dataToSave = {
      pageName: layoutData.pageName,
      ...(layoutData.mainStoryId !== undefined && { mainStoryId: layoutData.mainStoryId }),
      ...(layoutData.topStoryIds !== undefined && { topStoryIds: layoutData.topStoryIds }),
      ...(layoutData.secondaryStoryIds !== undefined && { secondaryStoryIds: layoutData.secondaryStoryIds }),
      ...(layoutData.featuredStoryId !== undefined && { featuredStoryId: layoutData.featuredStoryId }),
      ...(layoutData.articleIds !== undefined && { articleIds: layoutData.articleIds }),
    };

    try {
      if (isEditing) {
        await databases.updateDocument(DATABASE_ID, LAYOUTS_COLLECTION_ID, layoutDocId, dataToSave);
        alert(`Layout for '${selectedPage}' updated successfully!`);
      } else {
        await databases.createDocument(DATABASE_ID, LAYOUTS_COLLECTION_ID, ID.unique(), dataToSave, [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]);
        alert(`Layout for '${selectedPage}' created successfully!`);
      }
      navigate('/admin');
    } catch (err) {
      setError('Failed to save layout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Content Order</h3>
        <button onClick={handleSave} disabled={loading} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300">
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Page to Manage</label>
          <select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)} className="shadow border rounded w-full md:w-1/2 py-2 px-3 text-gray-700">
            <option value="homepage">Homepage</option>
            <option value="explainersPage">Explainers Page</option>
          </select>
        </div>

        {loading && <p>Loading layout...</p>}
        {error && <p className="text-center p-4 bg-red-100 text-red-700 rounded-md">{error}</p>}

        {!loading && !error && layoutData && (
          <DragDropContext onDragEnd={handleDragEnd}>
            {selectedPage === 'homepage' && (
              <HomepageLayoutForm
                layoutData={layoutData}
                allArticles={allArticles}
                onSelectChange={handleSelectChange}
              />
            )}

            {selectedPage === 'explainersPage' && (
              <ExplainersPageLayoutForm
                layoutData={layoutData}
                allArticles={allArticles}
                onSelectChange={handleSelectChange}
              />
            )}
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
