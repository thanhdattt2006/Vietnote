import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

// Thêm prop style
const LoadingOverlay = ({ isVisible, style }) => {
  if (!isVisible) return null;

  return (
    // Merge style mặc định với style truyền vào
    <div className='loading-overlay' style={style}>
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
