import React from 'react';
import { X } from 'lucide-react';

const CustomModal = ({
  isOpen,
  onClose,
  children,
  title,
  showHeader = true,
  className = '',
}) => {
  if (!isOpen) return null;
  return (
    <div className='dialog-overlay' onClick={onClose}>
      <div
        className={`dialog-content-custom ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && (
          <div className='dialog-header-custom'>
            <h3>{title}</h3>
            <button onClick={onClose} className='btn-icon-only'>
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
