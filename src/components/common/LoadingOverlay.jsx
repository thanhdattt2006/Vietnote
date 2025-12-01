// src/components/common/LoadingOverlay.jsx
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className='loading-overlay'>
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth='4'
        animationDuration='.8s'
        className='custom-spinner'
      />
    </div>
  );
};

export default LoadingOverlay;
