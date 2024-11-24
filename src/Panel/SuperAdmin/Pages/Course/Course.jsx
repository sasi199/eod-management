import React, { useState } from "react";
import { Button, Modal, Form, Select, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import DataTable from "react-data-table-component";

const { Option } = Select;
const { TextArea } = Input;

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [syllabus, setSyllabus] = useState([]); // Data for the table
  const [subtopics, setSubtopics] = useState({}); // Content for each topic

  const courseTopics = {
    fswd: ["HTML", "CSS", "JavaScript", "ES6", "React", "NodeJS", "Figma"],
    dm: ["SEO", "Social Media Marketing", "Email Marketing", "Google Ads", "Content Marketing"],
  };

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedTopics([]);
    setSubtopics({});
  };

  const handleFormSubmit = (values) => {
    const topicsWithContent = selectedTopics.map((topic) => ({
      topic,
      content: subtopics[topic] || "No specific content added",
    }));

    const newSyllabus = {
      id: syllabus.length + 1, // Unique ID for the table row
      course: selectedCourse.toUpperCase(),
      topics: topicsWithContent.map((t) => t.topic).join(", "),
      content: topicsWithContent
        .map((t) => `${t.topic}: ${t.content}`)
        .join(" | "),
      pdf: values.upload.file.name,
    };

    setSyllabus((prev) => [...prev, newSyllabus]);
    closeModal();
  };

  const handleTopicContentChange = (topic, content) => {
    setSubtopics((prev) => ({ ...prev, [topic]: content }));
  };

  // Columns for react-data-table-component
  const columns = [
    {
      name: "Course",
      selector: (row) => row.course,
      sortable: true,
    },
    {
      name: "Topics",
      selector: (row) => row.topics,
      sortable: true,
      wrap: true,
    },
    {
      name: "Detailed Content",
      selector: (row) => row.content,
      wrap: true,
    },
    {
      name: "PDF",
      selector: (row) => row.pdf,
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Syllabus Management</h2>
        <Button className="bg-orange-500 text-white" onClick={showModal}>
          Add Syllabus
        </Button>
      </div>

      {/* DataTable to Display Syllabus */}
      <DataTable
        columns={columns}
        data={syllabus}
        pagination
        highlightOnHover
        striped
        className="border border-gray-300 rounded-md"
      />

      {/* Modal for Adding Syllabus */}
      <Modal
        title="Add Syllabus"
        open={isModalOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          {/* Course Selection */}
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
              name="topics"
              rules={[{ required: true, message: "Please select at least one topic!" }]}
            >
              <Select
                mode="multiple"
                placeholder={`Select topics for ${selectedCourse.toUpperCase()}`}
                onChange={(value) => setSelectedTopics(value)}
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
          {selectedTopics.map((topic) => (
            <Form.Item
              key={topic}
              label={`Content for ${topic}`}
              rules={[{ required: true, message: `Please add content for ${topic}!` }]}
            >
              <TextArea
                rows={2}
                placeholder={`Enter details for ${topic}`}
                value={subtopics[topic] || ""}
                onChange={(e) => handleTopicContentChange(topic, e.target.value)}
              />
            </Form.Item>
          ))}

          {/* PDF Upload */}
          <Form.Item
            label="Upload PDF"
            name="upload"
            rules={[{ required: true, message: "Please upload the syllabus PDF!" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              Submit Syllabus
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Course;
