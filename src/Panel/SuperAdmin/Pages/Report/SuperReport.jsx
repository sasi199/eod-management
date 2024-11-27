import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal, Form, Select, Input, Avatar } from "antd";
import { GetReportAll } from "../../../../services";

const { Option } = Select;
const { TextArea } = Input;

const SuperReports = () => {
  const [isReportOpen, setIsReportOpen] = useState(false); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); 
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); 
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await GetReportAll();
        if (response.data) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
    fetchReportsData();
  }, []);

  const showModal = () => {
    setIsReportOpen(true);
  };

  const closeModal = () => {
    setIsReportOpen(false);
    setSelectedPerson(null);
  };

  const showViewModal = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, center: true },
    {
      name: "Report",
      selector: (row) => row.reporter,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.title,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex text-xl gap-4">
          <FaEye
            className="text-blue-500 cursor-pointer"
            title="View Report"
            onClick={() => showViewModal(row)} 
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            title="Delete Report"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
      center: true,
    },
  ];

  const handleDelete = (id) => {
    setReports((prevReports) =>
      prevReports.filter((report) => report.id !== id)
    );
  };

  const handleFormSubmit = (values) => {
    console.log("Form values:", values);
    closeModal();
  };

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
        <h2 className="text-xl font-semibold">Reports</h2>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        pagination
        customStyles={customStyles}
        highlightOnHover
        className="border border-gray-300 rounded-md"
      />

      {/* Modal for Viewing Report Details */}
      <Modal
        title="View Report"
        open={isViewModalOpen}
        footer={null}
        onCancel={closeViewModal}
      >
        {selectedReport && (
          <div>
            <p><strong>Reported By:</strong> {selectedReport.reporter}</p>
            <p><strong>Status:</strong> {selectedReport.title}</p>
            <p><strong>Content:</strong></p>
            <TextArea rows={4} value={selectedReport.reportContent} readOnly />
          </div>
        )}
      </Modal>

      {/* Modal for Adding Report */}
      <Modal
        title="Add Report"
        open={isReportOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Reported To"
            name="reportedPerson"
            rules={[{ required: true, message: "Please select the reported person!" }]}
          >
            <Select
              placeholder="Select person"
              onChange={(value) => setSelectedPerson(value)}
            >
              <Option value="hr">HR</Option>
              <Option value="coordinator">Coordinator</Option>
              <Option value="admin">Admin</Option>
              <Option value="trainer">Trainer</Option>
            </Select>
          </Form.Item>

          {selectedPerson && (
            <Form.Item
              label={`Select ${selectedPerson.charAt(0).toUpperCase() + selectedPerson.slice(1)}`}
              name={`${selectedPerson}Name`}
              rules={[{ required: true, message: `Please select a ${selectedPerson}!` }]}
            >
              <Select placeholder={`Select ${selectedPerson}`}>
                {personOptions[selectedPerson].map((person, index) => (
                  <Option key={index} value={person.name}>
                    <Avatar src={person.image} size={32} className="mr-2" />
                    {person.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Report"
            name="reportContent"
            rules={[{ required: true, message: "Please enter the report content!" }]}
          >
            <TextArea rows={4} placeholder="Type your report here" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperReports;
