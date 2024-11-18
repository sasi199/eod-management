import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Modal, Form, Select, Input, Avatar } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const TrainerReports = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reports, setReports] = useState([
    { id: 1, report: 'Report 1', status: 'Pending' },
    { id: 2, report: 'Report 2', status: 'Reviewed' },
  ]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const showModal = () => {
    setIsReportOpen(true);
  };

  const closeModal = () => {
    setIsReportOpen(false);
    setSelectedPerson(null); 
  };

  
  const columns = [
    { name: 'S.No', selector: (row, index) => index + 1, center: true },
    { name: 'Report', selector: row => row.report, sortable: true, center: true },
    { name: 'Status', selector: row => row.status, sortable: true, center: true },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex text-xl gap-4">
          <FaEye className="text-blue-500 cursor-pointer" title="View Report" onClick={() => handleView(row)} />
          <FaEdit className="text-green-500 cursor-pointer" title="Edit Report" onClick={() => handleEdit(row)} />
          <FaTrash className="text-red-500 cursor-pointer" title="Delete Report" onClick={() => handleDelete(row.id)} />
        </div>
      ),
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#ff9800',
        color: '#ffffff',
        fontSize: '16px',
        paddingRight: '0px'
      }
    },
  };

  
  const handleView = (report) => {
    console.log('Viewing report:', report);
  };

  const handleEdit = (report) => {
    console.log('Editing report:', report);
  };

  const handleDelete = (id) => {
    setReports(prevReports => prevReports.filter(report => report.id !== id));
  };

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
    closeModal();
  };

  const personOptions = {
    hr: [
      { name: 'HR 1', image: 'https://via.placeholder.com/24' },
      { name: 'HR 2', image: 'https://via.placeholder.com/24' },
      { name: 'HR 3', image: 'https://via.placeholder.com/24' },
    ],
    coordinator: [
      { name: 'Coordinator 1', image: 'https://via.placeholder.com/24' },
      { name: 'Coordinator 2', image: 'https://via.placeholder.com/24' },
      { name: 'Coordinator 3', image: 'https://via.placeholder.com/24' },
    ],
    admin: [
      { name: 'Admin 1', image: 'https://via.placeholder.com/24' },
      { name: 'Admin 2', image: 'https://via.placeholder.com/24' },
      { name: 'Admin 3', image: 'https://via.placeholder.com/24' },
    ],
    trainer: [
      { name: 'Trainer 1', image: 'https://via.placeholder.com/24' },
      { name: 'Trainer 2', image: 'https://via.placeholder.com/24' },
      { name: 'Trainer 3', image: 'https://via.placeholder.com/24' },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trainee Reports</h2>
        <Button className='bg-orange-500 text-white' onClick={showModal}>
          Add Report
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        pagination
        highlightOnHover
        customStyles={customStyles}
        className="border border-gray-300 rounded-md"
      />

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
            rules={[{ required: true, message: 'Please select the reported person!' }]}
          >
            <Select
              placeholder="Select person"
              onChange={value => setSelectedPerson(value)}
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
                  <Option key={index} value={person.name}><Avatar src={person.image} size={32} className='mr-2' />{person.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Report"
            name="reportContent"
            rules={[{ required: true, message: 'Please enter the report content!' }]}
          >
            <TextArea rows={4} placeholder="Type your report here" />
          </Form.Item>

          <Form.Item>
            <Button  htmlType="submit" className="w-full bg-orange-500 text-white">
              Submit Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerReports;
