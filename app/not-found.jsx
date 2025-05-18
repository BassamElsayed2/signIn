import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <img
        src="/404.jpg"
        alt="404 Not Found"
        className="w-[300px] h-[300px] "
      />

      <button className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer px-4 py-2 rounded-md mt-4">
        <Link href="/">الصفحه الرئيسيه</Link>
      </button>
    </div>
  );
};

export default NotFound;
