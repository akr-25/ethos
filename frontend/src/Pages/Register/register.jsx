import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const username = usernameRef.current.value.trim();
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const name = `${firstName} ${lastName}`;

    if (!email || !password || !username || !firstName || !lastName) {
      return alert("Please fill in all fields");
    }
    dispatch({ type: "LOGIN_START" });
    let res;
    try {
      res = await axios.post(
        `${BACKEND_URL}/auth/register`,
        {
          email,
          password,
          username,
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "localhost:3000",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      if (res.status === 201) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      } else {
        alert("Username or email already exists");
        dispatch({ type: "LOGIN_FAILED" });
      }
    } catch (err) {
      alert("Username or email already exists");
      dispatch({ type: "LOGIN_FAILED" });
    }
  };

  return (
    <div className='flex-1 flex justify-center items-center'>
      <div className='flex flex-col max-w-md px-4 py-8 bg-gray-100 rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10'>
        <div className='self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white'>
          Create a new account
        </div>
        <span className='justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400'>
          Already have an account ?
          <Link to='/login'>
            <span className='text-sm text-blue-500 underline hover:text-blue-700'>
              {"  "} Sign in
            </span>
          </Link>
        </span>
        <div className='p-6 mt-8'>
          <div>
            <div className='flex flex-col mb-2'>
              <div className=' relative '>
                <input
                  ref={usernameRef}
                  type='text'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='username'
                  placeholder='Username'
                />
              </div>
            </div>
            <div className='flex gap-4 mb-2'>
              <div className=' relative '>
                <input
                  ref={firstNameRef}
                  type='text'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='First name'
                  placeholder='First name'
                />
              </div>
              <div className=' relative '>
                <input
                  ref={lastNameRef}
                  type='text'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='Last name'
                  placeholder='Last name'
                />
              </div>
            </div>
            <div className='flex flex-col mb-2'>
              <div className=' relative '>
                <input
                  ref={emailRef}
                  type='email'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  placeholder='Email'
                />
              </div>
            </div>
            <div className='flex flex-col mb-2'>
              <div className=' relative '>
                <input
                  ref={passwordRef}
                  type='password'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  placeholder='Password'
                />
              </div>
            </div>
            <div className='flex w-full my-4'>
              <button
                type='submit'
                className='py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                onClick={(e) => handleSubmit(e)}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
