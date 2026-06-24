import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const NoteSearchBar = ({ search, setSearch }) => {
  const { t } = useLanguage();
  return (
    <div className='search-bar'>
      <Search size={20} className='search-icon' />
      <input
        className='search-input'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchPlaceholder')}
      />
    </div>
  );
};

export default NoteSearchBar;
