import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Button, Modal, Form, Input, Avatar, Select, notification } from "antd";
import { AllStaffs, CreateReport, DeleteReport, EditReport, GetReportAll } from "../../../../services";

const { Option } = Select;
const { TextArea } = Input;

const TraineeReports = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [getReports, setGetReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null); 
  const [form] = Form.useForm();

  
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await AllStaffs();
        if (response?.data) {
          setStaffs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        notification.error({
          message: "Error",
          description: "Unable to fetch staff data.",
        });
      }
    };
    fetchStaffData();
  }, []);

  // Fetch report data

  const showModal = () => {
    setIsReportOpen(true);
    form.resetFields();
    setEditingReport(null);
  };

  const closeModal = () => {
    setIsReportOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingReport) {
       
        const response = await EditReport(editingReport._id, values);
        if (response?.status === 200) {
          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === editingReport.id ? { ...report, ...values } : report
            )
          );
          notification.success({
            message: "Success",
            description: "Report updated successfully.",
          });
        }
      } else {
        const response = await CreateReport(values);
        if (response?.status === 201) {
          setReports((prevReports) => [...prevReports, { ...values, id: response.data.id }]);
          notification.success({
            message: "Success",
            description: "Report added successfully.",
          });
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving report:", error);
      notification.error({
        message: "Error",
        description: "Unable to save report. Please try again.",
      });
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    form.setFieldsValue(report);
    setIsReportOpen(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this report?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await DeleteReport(id); // Assuming DeleteReport makes the API call
          setReports((prevReports) =>
            prevReports.filter((report) => report._id !== id)
          );
          notification.success({
            message: "Success",
            description: "Report deleted successfully.",
          });
        } catch (error) {
          console.error("Error deleting report:", error);
          notification.error({
            message: "Error",
            description: "Failed to delete the report. Please try again.",
          });
        }
      },
      onCancel: () => {
        notification.info({
          message: "Info",
          description: "Deletion canceled.",
        });
      },
    });
  };
  
   

  const columns = [
    { name: "S.No", selector: (_, index) => index + 1, center: true },
    { name: "Report Title", selector: (row) => row.title, sortable: true, center: true },
    { name: "Status", selector: (row) => row.status || "Pending", sortable: true, center: true },
    { name: "Replay", selector: (row) => row.replay || "Pending", sortable: true, center: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-4">
          <FaEye className="text-blue-500 cursor-pointer" title="View Report" />
          <FaEdit
            className="text-green-500 cursor-pointer"
            title="Edit Report"
            onClick={() => handleEdit(row)}
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            title="Delete Report"
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
      center: true,
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trainee Reports</h2>
        <Button
          type="primary"
          className="bg-orange-500 text-white hover:bg-orange-600"
          onClick={showModal}
        >
          Add Report
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={getReports}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="border border-gray-300 rounded-md"
      />

      <Modal
        title={editingReport ? "Edit Report" : "Add Report"}
        open={isReportOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{
            title: "",
            content: "",
            reporter: "",
            reportTo: "",
          }}
        >
          <Form.Item
            label="Report Title"
            name="title"
            rules={[{ required: true, message: "Please enter the report title!" }]}
          >
            <Input placeholder="Enter report title" />
          </Form.Item>

          <Form.Item
            label="Report Content"
            name="content"
            rules={[{ required: true, message: "Please enter the report content!" }]}
          >
            <TextArea rows={4} placeholder="Enter report content" />
          </Form.Item>

          <Form.Item
            label="Reporter"
            name="reporter"
            rules={[{ required: true, message: "Please enter the reporter name!" }]}
          >
            <Input placeholder="Enter reporter name" />
          </Form.Item>

          <Form.Item
            label="Report To"
            name="reportTo"
            rules={[{ required: true, message: "Please select a person to report to!" }]}
          >
            <Select placeholder="Select person" allowClear>
              {staffs.map((staff) => (
                <Option key={staff.id} value={staff.fullName}>
                  <Avatar src={staff.profilePic} size={32} className="mr-2" />
                  {staff.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingReport ? "Update Report" : "Submit Report"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TraineeReports;
