// src/components/admin/orderManager/DraggableArticleList.js
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const DraggableItem = ({ item, index }) => (
  <Draggable draggableId={item.$id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`p-3 rounded-md text-gray-800 flex items-center justify-between ${snapshot.isDragging ? 'bg-blue-100 shadow-lg' : 'bg-gray-50'
          }`}
      >
        <span>{item.title}</span>
        <span className="text-xs text-gray-400">Drag</span>
      </div>
    )}
  </Draggable>
);

export default function DraggableArticleList({ listId, title, articles }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-600 mb-2">{title}</h4>
      <Droppable droppableId={listId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 p-4 bg-gray-100 rounded-lg border min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-green-50' : ''}`}
          >
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <DraggableItem key={article.$id} item={article} index={index} />
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">
                Drop articles here
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
