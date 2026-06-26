import React from 'react';
import { Pin, Trash2, Clock } from 'lucide-react';
import DOMPurify from 'dompurify';

/**
 * NoteCard — Hiển thị một Note trong lưới Masonry.
 *
 * Phase 7 Hotfixes:
 *   - [XSS] Sanitize note.content bằng DOMPurify trước khi render dangerouslySetInnerHTML
 *   - [a11y] Thêm aria-label cho tất cả icon button (Pin, Trash2)
 *   - [CLS] Thêm class 'note-card-image' với aspect-ratio cố định để tránh layout shift
 */
const NoteCard = ({ note, onSelect, onTogglePin, onDelete }) => {
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  // Sanitize HTML content để chống XSS
  const sanitizedContent = DOMPurify.sanitize(note.content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
      'ul', 'ol', 'li', 'a', 'img', 'pre', 'code', 'blockquote', 'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'width', 'height'],
  });

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
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={20} />
        </button>
        <button
          className='note-action-btn'
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
          aria-label='Move note to trash'
        >
          <Trash2 size={20} />
        </button>
      </div>
      <h3 className='note-title'>{note.title}</h3>
      <div
        className='note-content'
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
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
