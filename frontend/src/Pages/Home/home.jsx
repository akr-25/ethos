import axios from "axios";
import React from "react";
import { useRef, useState } from "react";

const Home = () => {
  const ImageRef = useRef();
  const [image, setImage] = useState();

  const predict = (e) => {
    e.preventDefault();
    console.log(ImageRef.current.value);

    const dataArray = new FormData();
    dataArray.append("image", ImageRef.current.files[0]);

    let reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(ImageRef.current.files[0]);

    axios
      .post("http://localhost:5000/ml/predict", dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div>
      <div className='max-w-7xl mx-auto px-8 py-10 flex-1'>
        <div className=''>
          <h1 className='text-4xl'> Hand Detector</h1>
          <br></br>
          <br></br>
          <p>
            Upload your image to predict if your hand is going outside your car
            window or not
          </p>
          <br></br>
          <p>Browse Image</p>
          <div className='w-4/5 flex flex-col items-end mb-12'>
            <div className='bg-stone-700 h-24 w-full rounded p-5 flex items-center'>
              <label className='flex items-center mx-4 flex-1'>
                <span className='sr-only'>Choose profile photo</span>
                <input
                  ref={ImageRef}
                  type='file'
                  typeof='jpeg, png, jpg'
                  className='block w-full text-sm text-slate-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
              '
                />
              </label>
              <span>
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  focusable='false'
                  fill='#c1c4c9'
                  xmlns='http://www.w3.org/2000/svg'
                  color='inherit'
                  className='w-12 h-12 mr-8'
                >
                  <path fill='none' d='M0 0h24v24H0V0z' />
                  <path d='M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z' />
                </svg>
              </span>
            </div>
            <label className='flex items-center space-x-2 pt-2 text-sm font-medium text-slate-600 dark:text-slate-50'>
              <input
                type='checkbox'
                className='accent-violet-500'
                defaultChecked
              />
              <span>
                Yes, you can collect my image data for improving your model
                prediction. I accept privacy policies.
              </span>
            </label>
          </div>
          <button
            className='bg-purple-500 shadow-lg shadow-purple-500/50 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded'
            type='submit'
            onClick={(e) => predict(e)}
          >
            Predict
          </button>
          {image && (
            <>
              <div className='flex w-full justify-center'>
                <img src={image} alt='uploaded' className='max-h-96 rounded' />
              </div>
              <center>
                <p>Uploaded image</p>
              </center>
            </>
          )}
          <h1 className="text-4xl">Prediction</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
