import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value, onChange, placeholder, className }) => {
  const [show, setShow] = useState(false);
  return (
    <div className='custom-password-wrapper'>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className}`}
        style={{ paddingRight: '2.5rem' }}
      />
      <button
        type='button'
        onClick={() => setShow(!show)}
        className='password-toggle-btn'
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordInput;
