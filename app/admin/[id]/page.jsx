'use client'
import { Chart } from "@/app/(components)/Chart";
import Confirm from "@/app/(components)/confirm";
import { notFound } from "next/navigation";
import React from "react";
import {useState} from 'react'

const page = ({ params }) => {
  const user = {
    name: "John Doe",
    role: "it",
    arriveTime: "10:00 AM",
  };

  const { id } = params;
  if (!id) {
    return notFound();
  }

   const [showConfirm, setShowConfirm] = useState(false);

   console.log(showConfirm)
  return (
    <div className=" w-full h-screen p-4 mr-55">
      <div className="mx-auto  bg-white shadow-md rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">ID:</p>
            <p>{id}</p>
          </div>

          <div>
            <p className="font-semibold">Role:</p>
            <p>{user.role}</p>
          </div>
          <div>
            <p className="font-semibold">Name:</p>
            <p>{user.name}</p>
          </div>

          <div>
            <p className="font-semibold">Arrive Time:</p>
            <p>{user.arriveTime}</p>
          </div>
        </div>

        <button className="flex gap-2 bg-[#6c757d] text-white px-4 py-2 rounded-lg mt-4 self-end hover:bg-[#495057] transition duration-300 " onClick={()=>setShowConfirm(true)} >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 my-auto flex flex-col"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          delete user
        </button>

{
  showConfirm && <Confirm cancel={setShowConfirm} />
}
       
        <div>
          <p className="font-semibold text-gray-700 mb-2">Location on Map:</p>
          <div className="w-full h-100 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Map
          </div>
        </div>
        <div className="justify-items-center">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default page;
