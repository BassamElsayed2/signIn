"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"

const AdminNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="p-4 dark:bg-gray-100 dark:text-gray-800 shadow">
      <div className="container mx-auto flex justify-between items-center h-10">
       
        <Link
          href="/"
          className="flex items-center mx-5 w-10 h-10 text-gray-900 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-violet-700 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
            />
          </svg>
        </Link>

        <ul className="hidden md:flex space-x-3 items-center">
          <li>
            <Link
              href="/"
              className={`px-4 -mb-1 border-b-2 ${
                pathname === "/"
                  ? "text-violet-600 border-violet-600"
                  : "border-transparent text-gray-600 hover:text-violet-500"
              }`}
            >
              New User
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className={`px-4 -mb-1 border-b-2 ${
                pathname === "/admin"
                  ? "text-violet-600 border-violet-600"
                  : "border-transparent text-gray-600 hover:text-violet-500"
              }`}
            >
              Sign Out
            </Link>
          </li>
        </ul>

        
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      
      {isOpen && (
        <ul className="md:hidden flex flex-col mt-4 space-y-2 px-6 text-gray-700">
          <li>
            <Link
              href="/"
              className={`block px-4 py-2 rounded ${
                pathname === "/"
                  ? "bg-violet-100 text-violet-700"
                  : "hover:text-violet-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              New User
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className={`block px-4 py-2 rounded ${
                pathname === "/admin"
                  ? "bg-violet-100 text-violet-700"
                  : "hover:text-violet-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Sign Out
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}


export default AdminNav;



