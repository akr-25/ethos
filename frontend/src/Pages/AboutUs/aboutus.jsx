import React from "react";
import aman from "./aman.jpg";
import siri from "./siri.jpg";
import akshay from "./chinta.jpg";

const Aboutus = () => {
  const data = [
    {
      name: "Srishti Kumari",
      github: "srishtikumari03",
      linkedin: "srishti2003",
      image: siri,
      branch: "MnC",
      year: "3nd",
      college: "IIT Guwahati",
    },
    {
      name: "Aman Kumar",
      github: "akr-25",
      linkedin: "akr25",
      image: aman,
      branch: "MnC",
      year: "3nd",
      college: "IIT Guwahati",
    },
    {
      name: "Akshay Chintala",
      github: "AkshayC00",
      linkedin: "akshay-chintala-967927200",
      image: akshay,
      branch: "MnC",
      year: "3nd",
      college: "IIT Guwahati",
    },
  ];

  return (
    <div className='w-full flex-1 flex justify-center items-center min-h-full'>
      <div className='flex flex-col items-center justify-center m-8 p-8 bg-white rounded-lg shadow-md max-w-5xl'>
        <div className='w-full text-left px-12'>
          <h1 className='font-bold text-4xl mb-6 text-center'>Who are we?</h1>
          <div className='grid grid-cols-3'>
            {data.map((item) => (
              <div className='flex flex-col col-span-1 items-center justify-center p-3 mx-2 bg-white rounded-lg shadow-md max-w-5xl'>
                <div className='flex flex-row items-center justify-center'>
                  <img
                    src={item.image}
                    alt='profile'
                    className='rounded-full h-12 w-12'
                  />
                  <div className='flex flex-col  justify-center ml-4'>
                    <h1 className='font-bold text-xl'>{item.name}</h1>
                    <h1 className='text-sm'>{item.branch}</h1>
                    <h1 className='text-sm'>{item.year} Yearite</h1>
                    <h1 className='text-sm'>{item.college}</h1>
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center mt-4'>
                  <a
                    href={`https://github.com/${item.github}`}
                    className='flex flex-row items-center justify-center hover:bg-slate-300 bg-slate-500 text-white font-bold py-2 px-4 rounded-full'
                  >
                    <h1 className='ml-2'>Github</h1>
                  </a>
                  <a
                    href={`https://www.linkedin.com/in/${item.linkedin}`}
                    className='flex flex-row items-center justify-center hover:bg-slate-300 bg-slate-500 text-white font-bold py-2 px-4 rounded-full ml-4'
                  >
                    <h1 className='ml-2'>Linkedin</h1>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
