import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const NotFoundPage = () => {
  const { t } = useLanguage();
  return (
    <div
      className='page not-found-page'
      style={{ textAlign: 'center', paddingTop: '5rem' }}
    >
      <h1
        style={{
          fontSize: '6.6rem',
          marginBottom: '3rem',
          color: 'var(--text-primary)',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: '3.3rem',
          marginBottom: '4rem',
          color: 'var(--text-secondary)',
        }}
      >
        {t('pageNotFound')}
      </p>
      <Link to='/home' className='btn btn-primary'>
        {t('backToHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
