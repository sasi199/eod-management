import React from "react";
import { FaPlus } from "react-icons/fa";

const CreatePage = () => {
  const handleCreate = () => {
    console.log("Create action triggered");
    // Add your create logic here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Record</h1>

      <button
        className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors duration-300 flex items-center gap-2"
        onClick={handleCreate}
      >
        <FaPlus />
        Create
      </button>
    </div>
  );
};

export default CreatePage;
