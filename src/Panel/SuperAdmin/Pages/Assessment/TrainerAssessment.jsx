import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  CreateAssessment,
  DeleteAssessment,
  EditAssessment,
  GetAssessment,
  GetBatches,
} from "../../../../services";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const TrainerAssessment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [batches, setBatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [form] = Form.useForm();

  const handleEdit = (row) => {
    setIsEditing(true);
    setEditingId(row._id);
    setIsModalVisible(true);

    form.setFieldsValue({
      assessmentTitle: row.assessmentTitle,
      batch: row.batchName,
      mediaUrl: row.mediaUrl,
      assessmentTiming: row.assessmentTiming,
      subject: row.subject,
    });
  };

  const handleView = (row) => {
    setSelectedAssessment(row);
    setIsViewModalVisible(true);
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await GetAssessment();
        if (response.data?.data) {
          const enrichedAssessments = response.data.data.map((assessment) => {
            const batch = batches.find((b) => b.batchId === assessment.batchId);
            return {
              ...assessment,
              batchName: batch ? batch.batchName : "N/A",
            };
          });
          setAssessments(enrichedAssessments);
        } else {
          message.warning("No assessments found.");
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        message.error("Failed to fetch assessments. Please try again.");
      }
    };
    fetchAssessment();
  }, [batches]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches();
        setBatches(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        message.error("Failed to fetch batches. Please try again.");
      }
    };
    fetchBatches();
  }, []);

  const handleDeleteAssessment = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Assessment?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await DeleteAssessment(id);
          setAssessments((prevAssessment) =>
            prevAssessment.filter((assessments) => assessments.id !== id)
          );
          message.success("Assessment deleted successfully.");
        } catch (error) {
          console.error("Error deleting Assessment:", error);
          message.error("Failed to delete the Assessment. Please try again.");
        }
      },
    });
  };

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, center: true },

    {
      name: "Assessment Title",
      selector: (row) => row.assessmentTitle || "N/A",
      sortable: true,
    },
    {
      name: "Batch",
      selector: (row) => row.batchName || "N/A",
      sortable: true,
    },
    {
      name: "Media URL",
      selector: (row) =>
        row.mediaUrl ? (
          <a
            href={row.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Media
          </a>
        ) : (
          "No Media"
        ),
    },
    {
      name: "Timing",
      selector: (row) => row.assessmentTiming || "N/A",
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-4 text-lg">
          <FaEye
            className="text-green-500 cursor-pointer"
            onClick={() => handleView(row)}
          />
          <FaEdit
            className="text-yellow-500 cursor-pointer"
            onClick={() => handleEdit(row)}
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            onClick={() => handleDeleteAssessment(row._id)}
          />
        </div>
      ),
      ignoreRowClick: true,
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleMediaUpload = ({ file }) => {
    form.setFieldsValue({ mediaUrl: file });
    return false;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedBatch = batches.find(
        (batch) => batch.batchName === values.batch
      );

      const formData = new FormData();
      formData.append("assessmentTitle", values.assessmentTitle);
      formData.append("batch", values.batch);
      formData.append("batchId", selectedBatch ? selectedBatch.batchId : "");
      formData.append("assessmentTiming", values.assessmentTiming);
      formData.append("subject", values.subject);

      if (values.mediaUrl.file) {
        formData.append("mediaUrl", values.mediaUrl.file);
      }

      if (isEditing && editingId) {
        // Call EditAssessment API
        const response = await EditAssessment(editingId, formData);
        if (response.status === 200) {
          // Update the assessments state
          setAssessments((prev) =>
            prev.map((item) =>
              item._id === editingId
                ? { ...item, ...values, batchName: values.batch }
                : item
            )
          );
          message.success("Assessment updated successfully!");
        } else {
          message.error("Failed to update assessment.");
        }
      } else {
        // Add Assessment logic (already in your code)
        const response = await CreateAssessment(formData);
        if (response.status === 200) {
          setAssessments([
            ...assessments,
            {
              ...values,
              batchName: values.batch,
            },
          ]);
          message.success("Assessment added successfully!");
        } else {
          message.error("Failed to add assessment.");
        }
      }

      form.resetFields();
      setIsModalVisible(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Validation Failed:", error);
      message.error("Please check your input and try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <button
        className="bg-orange-500 px-3 py-1 text-white rounded-lg mb-4"
        onClick={() => {
          setIsModalVisible(true);
          setIsEditing(false);
          form.resetFields();
        }}
      >
        Add Assessment
      </button>

      <DataTable
        columns={columns}
        data={assessments}
        pagination
        customStyles={customStyles}
        highlightOnHover
        responsive
        className="rounded-lg border shadow-md"
      />

      <Modal
        title={isEditing ? "Edit Assessment" : "Add Assessment"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Assessment Title"
            name="assessmentTitle"
            rules={[
              { required: true, message: "Please input the assessment title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Batch"
            name="batch"
            rules={[{ required: true, message: "Please select a batch!" }]}
          >
            <Select placeholder="Select a batch">
              {batches.map((batch) => (
                <Option key={batch.batchName} value={batch.batchName}>
                  {batch.batchName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Media File"
            name="mediaUrl"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload a media file!" }]}
          >
            <Upload beforeUpload={handleMediaUpload} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Assessment Timing"
            name="assessmentTiming"
            rules={[
              {
                required: true,
                message: "Please input the assessment timing!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please select a subject!" }]}
          >
            <Select placeholder="Select a subject">
              {[
                "Html/Css",
                "Javascript",
                "J-Query",
                "React.Js",
                "Node.Js/Mongodb",
                "Python",
                "Figma",
                "PHP",
                "Flutter",
              ].map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
  title={<h2 className="text-xl font-semibold text-gray-700">View Assessment</h2>}
  visible={isViewModalVisible}
  onCancel={() => setIsViewModalVisible(false)}
  footer={null}
  destroyOnClose
  className="rounded-lg shadow-lg"
>
  {selectedAssessment && (
    <div className="p-4 bg-gray-50 rounded-lg space-y-6">
      <div className="flex flex-col">
        <span className="font-medium text-gray-600">Assessment Title:</span>
        <span className="text-lg font-semibold text-gray-800">
          {selectedAssessment.assessmentTitle || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-600">Batch:</span>
        <span className="text-lg font-semibold text-gray-800">
          {selectedAssessment.batchName || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-600">Media URL:</span>
        {selectedAssessment.mediaUrl ? (
          <a
            href={selectedAssessment.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            View Media
          </a>
        ) : (
          <span className="text-lg font-semibold text-gray-800">No Media</span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-600">Timing:</span>
        <span className="text-lg font-semibold text-gray-800">
          {selectedAssessment.assessmentTiming || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-600">Subject:</span>
        <span className="text-lg font-semibold text-gray-800">
          {selectedAssessment.subject || "N/A"}
        </span>
      </div>
    </div>
  )}
</Modal>
    </div>
  );
};

export default TrainerAssessment;
