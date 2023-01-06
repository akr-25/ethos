import React from "react";

const Error404 = () => {
  return (
    <div className='bg-indigo-900 relative overflow-hidden flex-1 flex justify-center'>
      <img
        src='https://www.tailwind-kit.com/images/landscape/8.svg'
        className='absolute h-full w-full object-cover'
        alt='404'
      />
      <div className='inset-0 bg-black opacity-25 absolute'></div>
      <div className='mx-auto px-6 md:px-12 relative z-10 flex items-center'>
        <div className='w-full font-mono flex flex-col items-center relative z-10'>
          <h1 className='font-extrabold text-5xl text-center text-white leading-tight mt-4'>
            You're alone here
          </h1>
          <p className='font-extrabold text-8xl my-44 text-white animate-bounce'>
            404
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
