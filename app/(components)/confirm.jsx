import React from "react";

const Confirm = ({cancel}) => {
    



  return (
    <div class="fixed inset-0  backdrop-blur-md  flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl animate-bob-up text-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Delete User?</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this user?
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={()=>cancel(false)}>
            Cancel
          </button>
          <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" >
            Delete
          </button>
        </div>
      </div>    
    </div>
  );
};

export default Confirm;
