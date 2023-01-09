import React, { useContext, useEffect, useMemo } from "react";
// import DropDownMenu from "../dropdown.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { REACT_APP_BACKEND_URL as BACKEND_URL } from "../../config/url";

const selectedTabCSS =
  "text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium";
const unselectedTabCSS =
  "text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium";
const Navbar = () => {
  const [isClose, setIsClose] = useState(true);
  const [isDark, setDark] = useState(false);
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const html = document.querySelector("html");

  // Get the current url
  const currentUrl = window.location.pathname;
  const tabsEnum = useMemo(
    () => ({
      "/": 0,
      "/history": 1,
      "/how-to": 2,
      "/about-us": 3,
    }),
    []
  );

  const getCurrentTab = useMemo(() => {
    const tab = tabsEnum[currentUrl];
    return tab === undefined ? 0 : tab;
  }, [currentUrl, tabsEnum]);

  const [currentTab, setCurrentTab] = useState(getCurrentTab);

  const logOutHandler = async () => {
    localStorage.removeItem("user");
    localStorage.clear();
    history.go(0);

    await axios.post(`${BACKEND_URL}/auth/logout`);
  };

  useEffect(() => {
    isDark ? html.classList.add("dark") : html.classList.remove("dark");
  }, [html.classList, isDark]);

  return (
    <nav className='bg-white dark:bg-gray-800  shadow '>
      <div className='max-w-7xl mx-auto px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className=' flex items-center'>
            <a className='flex-shrink-0' href='/'>
              <img
                className='h-12 w-12'
                src='./IIT_Guwahati_Logo.svg'
                alt='Workflow'
              />
            </a>
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-4'>
                <Link to='/'>
                  <button
                    className={
                      currentTab === 0 ? selectedTabCSS : unselectedTabCSS
                    }
                    onClick={() => setCurrentTab(0)}
                  >
                    Predict
                  </button>
                </Link>
                <Link to='/history'>
                  <button
                    className={
                      currentTab === 1 ? selectedTabCSS : unselectedTabCSS
                    }
                    onClick={() => setCurrentTab(1)}
                  >
                    History
                  </button>
                </Link>
                <Link to='/how-to'>
                  <button
                    className={
                      currentTab === 2 ? selectedTabCSS : unselectedTabCSS
                    }
                    onClick={() => setCurrentTab(2)}
                  >
                    How it works?
                  </button>
                </Link>
                <Link to='/about-us'>
                  <button
                    className={
                      currentTab === 3 ? selectedTabCSS : unselectedTabCSS
                    }
                    onClick={() => setCurrentTab(3)}
                  >
                    About us
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            <div className='ml-4 flex items-center md:ml-6'>
              <a
                href='https://github.com/akr-25/ethos'
                className='p-1 rounded-full text-gray-400 focus:outline-none hover:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
              >
                <span className='sr-only'>View github</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={30}
                  height={30}
                  fill='currentColor'
                  className='text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200'
                  viewBox='0 0 1792 1792'
                >
                  <path d='M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z' />
                </svg>
              </a>
              {/* <DropDownMenu
                  forceOpen={false}
                  label={"Account"}
                  withDivider={true}
                  items={[{ label: "hello", desc: "hehe" }]}
                /> */}
              {/* {user ? (
                <>
                  <div className='ml-3 relative'>
                    <p className='flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50'>
                      Hello {user.name}
                    </p>
                  </div>
                  <div>
                    <button
                      className='flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500'
                      onClick={() => logOutHandler()}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className='ml-3 relative'>
                    <Link to='/login'>
                      <button className='flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500'>
                        Login
                      </button>
                    </Link>
                  </div>

                  <div>
                    <Link to='/register'>
                      <button className='flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500'>
                        Register
                      </button>
                    </Link>
                  </div>
                </>
              )} */}

              {/* <div className='flex justify-content'>
                <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    name='toggle'
                    className='checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'
                    onClick={() => {
                      setDark(!isDark);
                    }}
                  />
                  <label
                    htmlFor='Dark Mode'
                    className='block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer'
                  />
                </div>
                <span className='text-gray-400 font-medium'>Dark Mode</span>
              </div>*/}
            </div>
          </div>
          <div className={"-mr-2 flex md:hidden"}>
            <button
              className='text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none'
              onClick={() => setIsClose(!isClose)}
            >
              <svg
                width={20}
                height={20}
                fill='currentColor'
                className='h-8 w-8'
                viewBox='0 0 1792 1792'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z' />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={isClose ? "hidden" : "md:hidden block"}>
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
          <a
            className='text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            href='/#'
          >
            Predict
          </a>
          <a
            className='text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium'
            href='/#'
          >
            History
          </a>
          <a
            className='text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            href='/#'
          >
            How it works?
          </a>
          <a
            className='text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            href='/#'
          >
            About us
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
