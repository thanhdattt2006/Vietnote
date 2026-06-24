import React from 'react';
import { Pin, Trash2, Clock } from 'lucide-react';

const NoteCard = ({ note, onSelect, onTogglePin, onDelete }) => {
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div
      className={`note-card w-full mb-0 ${note.isPinned ? 'is-pinned' : ''}`}
      onClick={() => onSelect(note)}
    >
      <div className='note-card-actions'>
        <button
          className={`note-action-btn ${note.isPinned ? 'is-pinned' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
        >
          <Pin size={20} />
        </button>
        <button
          className='note-action-btn'
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>
      <h3 className='note-title'>{note.title}</h3>
      <div
        className='note-content'
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className='note-footer'>
        <span className='note-time'>
          <Clock size={12} /> {getRelativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
