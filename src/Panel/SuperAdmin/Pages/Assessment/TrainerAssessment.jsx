import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { CreateAssessment } from "../../../../services/index";

const { Option } = Select;

const TrainerAssessment = () => {
  const [data, setData] = useState([
    { id: 1, name: "Assessment 1", date: "2024-11-27", batch: "Nov-24-2024" },
    { id: 2, name: "Assessment 2", date: "2024-11-20", batch: "Dec-24-2024" },
  ]);
  const [filteredData, setFilteredData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addModal, SetAddmodal] = useState(false);
  const [form] = Form.useForm();
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const [filters, setFilters] = useState({ date: null, batch: null });

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, center: true },
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Date", selector: (row) => row.date, sortable: true, center: true },
    {
      name: "Batch",
      selector: (row) => row.batch,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setIsModalOpen(true), setSelectedAssessment(row);
            }}
            type="link"
          >
            View
          </Button>
          <Button onClick={() => handleEdit(row)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} type="link" danger>
            Delete
          </Button>
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

  const handleAddClick = () => {
    SetAddmodal(true);
    form.resetFields(); // Reset the fields to make sure they are empty
  };
  const handleAssessmentFileUpload = (file) => {
    form.setFieldValue("mediaUrl", file);
    return false;
  };

  const handleAddAssessment = (value) => {
    const formData = new FormData();

    formData.append("subject", value.subject);
    formData.append("assessmentTiming", value.assessmentTiming);
    formData.append("batch", value.batch);
    formData.append("assessmentTitle", value.assessmentTitle);

    if (value.mediaUrl && value.mediaUrl.fileList) {
      formData.append("mediaUrl", value.mediaUrl.fileList);
    } 
    CreateAssessment(formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err, "error creating");
      });
  };

  const handleView = (row) => {
    setSelectedAssessment(row);
    setIsModalOpen(true); // Show the modal for viewing the assessment
  };

  const handleEdit = (row) => {
    setSelectedAssessment(row);
    form.setFieldsValue({
      assessmentTitle: row.name,
      batch: row.batch,
      assessmentTiming: "2 hours", // You can pre-fill with actual timing
      subject: "React.Js", // You can pre-fill with actual subject
    });
    setIsEditModalOpen(true); // Open the modal for editing the assessment
  };

  const handleFormSubmit = (values) => {
    if (selectedAssessment) {
      // Edit existing assessment
      const updatedData = data.map((assessment) =>
        assessment.id === selectedAssessment.id
          ? { ...assessment, name: values.assessmentTitle }
          : assessment
      );
      setData(updatedData);
    } else {
      // Add new assessment
      const newAssessment = {
        id: data.length + 1,
        name: values.assessmentTitle,
        date: new Date().toISOString().split("T")[0],
        batch: values.batch,
      };
      setData([...data, newAssessment]);
    }
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    const filteredData = data.filter((assessment) => assessment.id !== id);
    setData(filteredData);
  };

  const handleFilterChange = (value, type) => {
    const updatedFilters = { ...filters, [type]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (filters) => {
    let filtered = [...data];
    if (filters.date) {
      filtered = filtered.filter((assessment) =>
        moment(assessment.date).isSame(filters.date, "day")
      );
    }
    if (filters.batch) {
      filtered = filtered.filter(
        (assessment) => assessment.batch === filters.batch
      );
    }
    setFilteredData(filtered);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Trainer Assessment</h1>
        <div className="flex space-x-32">
          <DatePicker
            value={filters.date ? moment(filters.date) : null}
            onChange={(date) => handleFilterChange(date, "date")}
            placeholder="Select Date"
            className="w-40"
          />
          <Select
            value={filters.batch}
            onChange={(value) => handleFilterChange(value, "batch")}
            placeholder="Select Batch"
            className="w-40"
          >
            <Option value="Nov-24-2024">Nov-24-2024</Option>
            <Option value="Dec-24-2024">Dec-24-2024</Option>
          </Select>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
        >
          Add Assessment
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="bg-white rounded shadow-md"
      />

      <Modal
        visible={addModal}
        title="add assessment"
        footer={null}
        centered
        onCancel={() => SetAddmodal(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAssessment}>
          <Form.Item
            name="assessmentTitle"
            label="Assessment Title"
            rules={[
              { required: true, message: "Please enter the assessment title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="batch"
            label="Batch"
            rules={[{ required: true, message: "Please select the batch!" }]}
          >
            <Select>
              <Option value="Nov-24-2024">Nov-24-2024</Option>
              <Option value="Dec-24-2024">Dec-24-2024</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="mediaUrl"
            label="Upload File"
            valuePropName="file"
            // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload beforeUpload={handleAssessmentFileUpload} accept=".pdf">
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="assessmentTiming"
            label="Assessment Timing"
            rules={[
              {
                required: true,
                message: "Please enter the assessment timing!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter the subject!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full bg-orange-500 text-white"
            >
              Add Assessment
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for /View Assessment */}
      <Modal
        title={"View Assessment"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedAssessment && (
          <div className="space-y-4">
            <div>
              <strong>Assessment Title: </strong>
              {selectedAssessment.name}
            </div>
            <div>
              <strong>Batch: </strong>
              {selectedAssessment.batch || "N/A"}
            </div>
            <div>
              <strong>Assessment Timing: </strong>
              {selectedAssessment.assessmentTiming || "N/A"}
            </div>
            <div>
              <strong>Subject: </strong>
              {selectedAssessment.subject || "N/A"}
            </div>
            <div>
              <strong>File: </strong>
              {selectedAssessment.mediaUrl ? (
                <a
                  href={selectedAssessment.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              ) : (
                "No file uploaded"
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for Editing Assessment */}
      <Modal
        title="Edit Assessment"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="assessmentTitle"
            label="Assessment Title"
            rules={[
              { required: true, message: "Please enter the assessment title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="batch"
            label="Batch"
            rules={[{ required: true, message: "Please select the batch!" }]}
          >
            <Select>
              <Option value="Nov-24-2024">Nov-24-2024</Option>
              <Option value="Dec-24-2024">Dec-24-2024</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="mediaUrl"
            label="Upload File"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="assessmentTiming"
            label="Assessment Timing"
            rules={[
              {
                required: true,
                message: "Please enter the assessment timing!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter the subject!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full bg-orange-500 text-white"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerAssessment;
