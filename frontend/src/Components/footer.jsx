// tailwind footer
import React from 'react';

const Footer = () => {
    return (
      <div className='w-full'>
        <footer className='bg-gray-800 dark:bg-gray-900 text-white p-4 text-center'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} -{" "}
            <a
              href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              className='text-white'
            >
              Hand Detection using Tensorflow.js
            </a>
          </p>
        </footer>
      </div>
    );
}

export default Footer;
