import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { Modal, Form, Input, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// const Navbar = () => (
//   <div className="w-full bg-blue-600 text-white p-4">
//     <h1 className="text-lg font-semibold">Trainer Assessment</h1>
//   </div>
// );

const Sidebar = () => (
  <div className="w-1/4 border-l border-gray-300 p-4 h-[600px]">
    <ul className="space-y-4">
      <li className="cursor-pointer">Dashboard</li>
      <li className="cursor-pointer">Assignments</li>
      <li className="cursor-pointer">Quizzes</li>
      <li className="cursor-pointer">Materials</li>
    </ul>
  </div>
);

const TrainerAssessment = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");

  const batches = [
    { name: "March 31", studentCount: 30, image: "https://via.placeholder.com/150" },
    { name: "April 22", studentCount: 25, image: "https://via.placeholder.com/150" },
    { name: "May 15", studentCount: 20, image: "https://via.placeholder.com/150" },
  ];

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditorContent("");
    setTitle("");
  };

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  return (
    <div className="px-4 relative">
      {selectedBatch ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Selected Batch: {selectedBatch.name}</h2>
          <button
            className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition-colors duration-300"
            onClick={toggleDropdown}
          >
            <IoIosAdd className="text-white text-xl" />
            <span className="text-lg font-medium">Create</span>
          </button>

          <div
            className={`bg-white border border-gray-200 rounded-lg shadow-md w-32 py-3 absolute z-10 transition-all duration-300 ${
              isDropdownOpen ? "opacity-100 translate-y-4" : "opacity-0 -translate-y-1"
            }`}
            style={{
              top: "85%",
              left: "15px",
            }}
          >
            <ul>
              <li
                className="hover:bg-gray-100 p-2 cursor-pointer"
                onClick={() => openModal("Assignment")}
              >
                Assignment
              </li>
              <li
                className="hover:bg-gray-100 p-2 cursor-pointer"
                onClick={() => openModal("Quiz")}
              >
                Quiz
              </li>
              <li
                className="hover:bg-gray-100 p-2 cursor-pointer"
                onClick={() => openModal("Material")}
              >
                Material
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {batches.map((batch, index) => (
            <div
              key={index}
              className="bg-white shadow-md border border-gray-200 rounded-lg text-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={batch.image}
                alt={batch.name}
                className="w-full h-64 object-cover rounded-md mb-2"
              />
              <div className="text-left p-2">
                <h2 className="text-xl font-semibold">{batch.name}</h2>
                <p className="text-gray-600 mt-2">Total Students: {batch.studentCount}</p>
                <button
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
                  onClick={() => handleBatchSelect(batch)}
                >
                  Select Batch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width="100%" 
        bodyStyle={{
          height: "100vh", 
          padding: "0",
        }}
        centered
      >
         <div className="w-full border-b border-gray-300 text-white p-4 ">
      <h1 className="text-2xl font-semibold text-gray-600">{modalContent}</h1>
      </div>
       
        <div className="flex h-full ">
          <div className="flex-1 p-8 overflow-y-auto bg-gray-100 ">
           
            <Form layout="vertical" className="border p-6 bg-white rounded-xl" onFinish={() => {}}>
              
              <Form.Item label="Title">
                <Input
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 bord"
                />
              </Form.Item>

              
              <Form.Item label="Content" >
                <ReactQuill
                  value={editorContent}
                  onChange={handleEditorChange}
                  className="h-32 mb-4 "
                  placeholder="Start writing here..."
                />
              </Form.Item>
              </Form>

              <div className="flex gap-4 mt-8">
                {/* <Button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  Google Drive
                </Button >
                <Button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  YouTube
                </Button> */}
                {/* <Button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  Create from Drive
                </Button> */}
                <Button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  Upload
                </Button>
                <Button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  Link
                </Button>
              </div>
              {/* <Form.Item>
                <Button type="primary" htmlType="submit" className="mt-4">
                  Submit
                </Button>
              </Form.Item> */}
          </div>
          <Sidebar />
        </div>
      </Modal>
    </div>
  );
};

export default TrainerAssessment;
