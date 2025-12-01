import React from 'react';
import { Menu } from 'lucide-react';
import logo from '../../assets/logo.png';

const TopHeader = ({ onToggle, onMobileToggle }) => {
  return (
    <header className='top-header'>
      <div className='logo-area'>
        <button
          className='logo-icon-toggle desktop-toggle'
          onClick={onToggle}
          aria-label='Toggle sidebar'
        >
          <Menu size={24} />
        </button>

        <button
          className='logo-icon-toggle mobile-menu-btn'
          onClick={onMobileToggle}
          aria-label='Open menu'
        >
          <Menu size={24} />
        </button>

        <div className='logo'>
          <img src={logo} alt='Logo' className='logo-img' />
          <span className='logo-text'>Vietnote</span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
