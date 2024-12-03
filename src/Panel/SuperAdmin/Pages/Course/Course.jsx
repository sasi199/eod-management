import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Select, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import DataTable from "react-data-table-component";
import {
  CreateSyllabus,
  DeleteSyllabus,
  EditSyllabus,
  GetSyllabus,
} from "../../../../services";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const { Option } = Select;
const { TextArea } = Input;

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen]=useState(false); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [fetchedSyllabus, SetFetchedSyllabus] = useState([]);
  const [subtopics, setSubtopics] = useState({});
  const [editModal, SetEditModal] = useState(false);
  const [deleteModal, SetDeleteModal] = useState(false);
  const [deleteCourse, SetDeleteCourse] = useState(null);
  const [SyllabusData, SetSyllabusData] = useState({
    course: "",
    topic: "",
    content: "",
  });
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

  const [editSyllabusData, SetEditSyllabusData] = useState({
    course: "",
    topic: "",
    id: "",
  });

  const courseTopics = {
    fswd: ["HTML", "CSS", "JavaScript", "ES6", "React", "NodeJS", "Figma"],
    dm: [
      "SEO",
      "Social Media Marketing",
      "Email Marketing",
      "Google Ads",
      "Content Marketing",
    ],
  };

  const fetchSyllabus = () => {
    GetSyllabus()
      .then((res) => {
        console.log(res.data);
        SetFetchedSyllabus(res.data.data);
      })
      .catch((err) => {
        console.log(err, "error fetching");
      });
  };

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedTopics([]);
    setSubtopics({});
    setIsViewModalOpen(false);
  };

  const viewModal = (syllabus) => {
    setSelectedSyllabus(syllabus); // Set the selected syllabus
    setIsViewModalOpen(true);
  };
  

  // const handleFormSubmit = (values) => {
  //   const topicsWithContent = selectedTopics.map((topic) => ({
  //     topic,
  //     content: subtopics[topic] || "No specific content added",
  //   }));

  //   const newSyllabus = {
  //     id: syllabus.length + 1, // Unique ID for the table row
  //     course: selectedCourse.toUpperCase(),
  //     topics: topicsWithContent.map((t) => t.topic).join(", "),
  //     content: topicsWithContent
  //       .map((t) => `${t.topic}: ${t.content}`)
  //       .join(" | "),
  //     pdf: values.upload.file.name,
  //   };

  //   setSyllabus((prev) => [...prev, newSyllabus]);
  //   closeModal();
  // };

  const handleFormSubmit = (values) => {
    console.log(values, "valueeee");

    const formData = new FormData();
    formData.append("courseName", values.course);
    formData.append("subjectName", values.topic);
    // formData.append("", values.content);
    if (values.document && values.document.file) {
      formData.append("uploadFile", values.document.file);
    }

    CreateSyllabus(formData)
      .then((res) => {
        if (res.status === 200) {
          setIsModalOpen(false);
          fetchSyllabus();
          message.success("created successfully");
        }
      })
      .catch((err) => {
        console.log(err, "error creating syllabus");
      });
  };

  const handleTopicContentChange = (topic, content) => {
    setSubtopics((prev) => ({ ...prev, [topic]: content }));
  };

  const handleDeleteClick = (data) => {
    SetDeleteCourse(data);
    SetDeleteModal(true);
  };

  const handleDeleteCourse = () => {
    DeleteSyllabus(deleteCourse._id)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          message.success("delete successfull");
          SetDeleteModal(false);
          fetchSyllabus();
        }
      })
      .catch((err) => {
        console.log(err, "error deleting");
      });
  };

  const handleEditClick = (data) => {
    SetEditModal(true);
    SetEditSyllabusData({
      id: data._id,
      topic: data.subjectName,
      course: data.courseName,
    });
  };

  const handleEditSyllabus = (values) => {
    const editFormData = new FormData();

    editFormData.append("courseName", editSyllabusData.course);
    editFormData.append("subjectName", editSyllabusData.topic);
    if (values.document && values.document.file) {
      editFormData.append("uploadFile", values.document.file);
    }

    EditSyllabus(editSyllabusData.id, editFormData)
      .then((res) => {
        if (res.status === 200) {
          message.success("edit successfull");
          SetEditModal(false);
          fetchSyllabus();
        }
      })
      .catch((err) => {
        console.log(err, "error editing");
      });
  };

  const columns = [
    {
      name: "S.No",
      selector: (row,i) => i+1,
      sortable: true,
      center: true,
    },
    {
      name: "Course",
      selector: (row) => (
        <span className="capitalize">{row.courseName || "N/A"}</span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Topics",
      selector: (row) => (
        <span className="capitalize">{row.subjectName || "N/A"}</span>
      ),
      sortable: true,
      wrap: true,
      center: true,
    },
   
    {
      name: "PDF",
      center: true,
      selector: (row) => row.uploadFile,
    },
    {
      name: "Actions",
      center: true,
      selector: (row) => (
        <div className="flex gap-2">
          <button className="border border-green-500 text-green-500 px-2 py-2 rounded-md hover:border-green-600" onClick={()=>viewModal(row)}>
            <FaEye />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="border border-blue-500 text-blue-500 px-2 py-2 rounded-md hover:border-blue-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="border border-red-500 text-red-500 px-2 py-2 rounded-md hover:border-red-600"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ff9800",
        color: "#ffffff",
        fontSize: "16px",
        paddingRight: "0px",
      },
    },
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Syllabus Management</h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md" onClick={showModal}>
          Add Syllabus
        </button>
      </div>

      {/* DataTable to Display Syllabus */}
      <DataTable
        columns={columns}
        data={fetchedSyllabus}
        pagination
        highlightOnHover
        customStyles={customStyles}
        striped
        className="border border-gray-300 rounded-md"
      />

<Modal
        
        open={isViewModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <p className="text-xl font-semibold">View Syllabus</p>
        {selectedSyllabus ? (
   <div className="p-4 ">
   <div className="mb-3">
     <p className="text-lg font-medium text-gray-600">
       <span className="font-semibold text-lg">Course:</span> {selectedSyllabus.courseName || "N/A"}
     </p>
   </div>
   <div className="mb-3">
     <p className="text-lg font-medium text-gray-600">
       <span className="font-semibold text-lg">Topics:</span> {selectedSyllabus.subjectName || "N/A"}
     </p>
   </div>
   {selectedSyllabus.uploadFile && (
     <div>
       <p className="text-lg font-medium text-gray-600">
         <span className="font-semibold text-lg">PDF:</span>{" "}
         <a
           href={selectedSyllabus.uploadFile}
           target="_blank"
           rel="noopener noreferrer"
           className="text-gray-800 underline hover:text-gray-600 transition duration-200"
         >
           View PDF
         </a>
       </p>
     </div>
   )}
 </div>
  ) : (
    <p>No syllabus selected.</p>
  )}
      </Modal>


      <Modal
        title="delete course"
        visible={deleteModal}
        onCancel={() => SetDeleteModal(false)}
        onOk={handleDeleteCourse}
        cancelButtonProps={{
          className: "bg-gray-500 text-white hover:bg-gray-600 border-none rounded",
          
        }}
        okButtonProps={{
          className: "bg-orange-500 text-white hover:bg-orange-600 border-none rounded",
        }}
      >
        <p>This action cannot be undone.</p>
      </Modal>

      <Modal
        title="edit syllabus"
        visible={editModal}
        footer={null}
        onCancel={() => SetEditModal(false)}
      >
        <Form layout="vertical" onFinish={handleEditSyllabus}>
          <Form.Item
            label="Course"
            // name="course"
            rules={[{ required: true, message: "Please select a course!" }]}
          >
            <Select
              value={editSyllabusData.course}
              placeholder="Select course"
              onChange={(value) => {
                SetEditSyllabusData({ ...editSyllabusData, course: value });
                setSelectedCourse(value);
              }}
            >
              <Option value="fswd">FSWD (Full-Stack Web Development)</Option>
              <Option value="dm">DM (Digital Marketing)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Topics"
            rules={[
              {
                required: true,
                message: "Please select at least one topic!",
              },
            ]}
          >
            <Select
              value={editSyllabusData.topic}
              // mode="multiple"
              placeholder={`Select topics for Selected Course}`}
              onChange={(value) =>
                SetEditSyllabusData({ ...editSyllabusData, topic: value })
              }
            >
              {selectedCourse &&
                courseTopics[selectedCourse].map((topic, index) => (
                  <Option key={index} value={topic}>
                    {topic}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Upload PDF"
            name="document"
            rules={[
              { required: true, message: "Please upload the syllabus PDF!" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <button
              htmlType="submit"
              className="w-full py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
            >
              Submit Syllabus
            </button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Syllabus"
        open={isModalOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Course"
            name="course"
            rules={[{ required: true, message: "Please select a course!" }]}
          >
            <Select
              placeholder="Select course"
              onChange={(value) => {
                setSelectedCourse(value);
                setSelectedTopics([]);
                setSubtopics({});
              }}
            >
              <Option value="fswd">FSWD (Full-Stack Web Development)</Option>
              <Option value="dm">DM (Digital Marketing)</Option>
            </Select>
          </Form.Item>

          {/* Topics Selection */}
          {selectedCourse && (
            <Form.Item
              label="Topics"
              name="topic"
              rules={[
                {
                  required: true,
                  message: "Please select at least one topic!",
                },
              ]}
            >
              <Select
                // mode="multiple"
                placeholder={`Select topics for ${selectedCourse.toUpperCase()}`}
                onChange={(value) =>
                  SetSyllabusData({ ...SyllabusData, topic: value })
                }
              >
                {courseTopics[selectedCourse].map((topic, index) => (
                  <Option key={index} value={topic}>
                    {topic}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Subtopics or Content Fields */}
          {/* {selectedTopics && (
            <Form.Item
              name="content"
              // key={topic}
              label={`Content for topic`}
              rules={[
                { required: true, message: `Please add content for topic!` },
              ]}
            >
              <TextArea
                rows={2}
                placeholder={`Enter details for topic`}
                value={SyllabusData.content || ""}
                onChange={(e) =>
                  SetSyllabusData({ ...SyllabusData, content: e.target.value })
                }
              />
            </Form.Item>
          )} */}

          {/* PDF Upload */}
          <Form.Item
            label="Upload PDF"
            name="document"
            rules={[
              { required: true, message: "Please upload the syllabus PDF!" },
            ]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <button
              htmlType="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600 py-1 rounded-md"
            >
              Submit Syllabus
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Course;
