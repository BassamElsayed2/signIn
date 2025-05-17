"use client";
import Link from "next/link";
import { useState } from "react";
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <aside
      className={`flex flex-col  ${
        open && "w-55"
      }  px-4 py-8 text-black fixed top-0 right-0 h-full  duration-300  bg-[#ced4da] border-gray-700 z-10`}
    >
      <div
        className={`bg-[#ECEDF8] rounded-full flex justify-center items-center absolute -left-4 top-9 w-[35px] h-[35px] border border-[#002364] cursor-pointer ${
          open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col items-center mt-6 -mx-2">
        {open && <h4 className="mx-2 mt-2 font-medium text-black ">Admin</h4>}
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className=" flex flex-col h-full">
          <Link
            className="flex items-center px-4 py-2 mt-5 text-black transition-colors duration-300 transform rounded-lg   hover:bg-[#6c757d]  hover:text-black"
            href="/admin"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            {open && <span className="mx-4 font-medium">Users</span>}
          </Link>

          <Link
            className="flex items-center px-4 py-2 mt-5 text-black transition-colors duration-300 transform rounded-lg   hover:bg-[#6c757d] hover:text-black "
            href="/admin/newuser"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>

            {open && <span className="mx-4 font-medium">Create Users</span>}
          </Link>

          <Link
            className="flex px-4 py-2 mt-auto  text-black transition-colors duration-300 transform  rounded-lg  hover:bg-[#6c757d]   hover:text-black"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            {open && <span className="mx-4 font-medium">Sign out</span>}
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
