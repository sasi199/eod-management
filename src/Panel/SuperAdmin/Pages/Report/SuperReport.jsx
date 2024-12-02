import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaTrash, FaReply } from "react-icons/fa";
import { Button, Modal, Input } from "antd";
import { GetReportAll, replyReport } from "../../../../services";

const { TextArea } = Input;

const SuperReports = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await GetReportAll();
        if (response.data) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching reports data:', error);
      }
    };
    fetchReportsData();
  }, []);

  const showModal = () => {
    setIsReportOpen(true);
  };

  const closeModal = () => {
    setIsReportOpen(false);
  };

  const showViewModal = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReport(null);
  };

  const showReplyModal = (report) => {
    setSelectedReport(report);
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setReply("");
  };

  const handleDelete = (id) => {
    setReports((prevReports) => prevReports.filter((report) => report.id !== id));
  };

  const handleReplySubmit = async () => {
    if (!reply) {
      alert("Please enter a reply before submitting.");
      return;
    }
    try {
      await replyReport(selectedReport._id, { replay: reply });
      alert("Reply sent successfully.");
      closeReplyModal();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
    }
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
          <FaReply
            className="text-green-500 cursor-pointer"
            title="Reply to Report"
            onClick={() => showReplyModal(row)} 
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

      <Modal
        title="View Report"
        open={isViewModalOpen}
        footer={null}
        onCancel={closeViewModal}
      >
        {selectedReport && (
          <div className="bg-orange-500 text-white p-6 rounded-md shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Report Details</h2>
            <div className="space-y-4">
              <p className="text-lg">
                <strong className="font-semibold">Reported By:</strong> {selectedReport.reporter}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Status:</strong> {selectedReport.title}
              </p>
              <p className="text-lg">
                <strong className="font-semibold">Content:</strong> {selectedReport.content}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Reply to Report"
        open={isReplyModalOpen}
        onCancel={closeReplyModal}
        footer={[
          <Button key="cancel" onClick={closeReplyModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleReplySubmit}>
            Submit Reply
          </Button>,
        ]}
      >
        <TextArea
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Enter your reply"
        />
      </Modal>
    </div>
  );
};

export default SuperReports;
