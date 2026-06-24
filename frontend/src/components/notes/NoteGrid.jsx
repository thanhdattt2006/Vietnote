import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NoteCard from './NoteCard';
import { useLanguage } from '../../contexts/LanguageContext';

const NoteGrid = ({ notes, onSelectNote, onTogglePin, onDelete }) => {
  const { t } = useLanguage();

  if (!notes || notes.length === 0) {
    return (
      <div className='empty-state'>
        <div className='empty-icon'>📝</div>
        <h2>{t('noNotes')}</h2>
        <p className='empty-description'>{t('createFirst')}</p>
      </div>
    );
  }

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
    >
      <Masonry gutter='1.5rem'>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onSelect={onSelectNote}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default NoteGrid;
