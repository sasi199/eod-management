import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Input, Select, Button, Form } from 'antd';

const { Option } = Select;

const Batches = () => {
  const [batches, setBatches] = useState([
    { id: 1, name: 'Batch A', students: 30, course: 'Full Stack Developer', date: '2024-01-01' },
    { id: 2, name: 'Batch B', students: 25, course: 'Digital Marketing', date: '2024-02-01' },
    { id: 3, name: 'Batch C', students: 20, course: 'Full Stack Developer', date: '2024-03-01' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [form] = Form.useForm();

  
  const columns = [
   
    { name: 'ID', selector: row => row.id, sortable: true, center:true },
    { name: 'Batch Name', selector: row => row.name, sortable: true, center:true },
    { name: 'Students', selector: row => row.students, sortable: true, center:true },
    { name: 'Course', selector: row => row.course, sortable: true, center:true },
    { name: 'Date', selector: row => row.date, sortable: true, center:true },
    {
      name: 'Actions',
      center:true,
      cell: row => (
        <div className="flex gap-2">
          <Button onClick={() => handleView(row)} className='border border-blue-500 text-blue-500'>View</Button>
          <Button onClick={() => handleEdit(row)} className='border border-green-500 text-green-500'>Edit</Button>
          <Button onClick={() => handleDelete(row.id)} className='border border-red-500 text-red-500 px-2' >
            Delete
          </Button>
        </div>
      ),
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
  const handleAddBatch = () => {
    setIsEdit(false);
    setCurrentBatch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (batch) => {
    setIsEdit(true);
    setCurrentBatch(batch);
    form.setFieldsValue(batch);
    setIsModalOpen(true);
  };

  const handleView = (batch) => {
    setCurrentBatch(batch);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit && currentBatch) {
        setBatches(batches.map(batch => batch.id === currentBatch.id ? { ...currentBatch, ...values } : batch));
      } else {
        const newBatch = {
          id: batches.length + 1,
          ...values,
          date: new Date().toISOString().split('T')[0],
        };
        setBatches([...batches, newBatch]);
      }
      form.resetFields();
      setIsModalOpen(false);
      setCurrentBatch(null);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Batches</h2>
        <button
          onClick={handleAddBatch}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Add Batch
        </button>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        pagination
        highlightOnHover
        customStyles={customStyles}
        className="border rounded shadow-sm"
      />

    
      <Modal
        title={isEdit ? "Edit Batch" : "Add New Batch"}
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} className="bg-orange-500">
            {isEdit ? "Update" : "Add"}
          </Button>,
        ]}
        centered
      >
        <Form form={form} layout="vertical" name="batchForm">
          <Form.Item
            name="name"
            label="Batch Name"
            rules={[{ required: true, message: 'Please enter the batch name' }]}
          >
            <Input placeholder="Enter batch name" />
          </Form.Item>
          <Form.Item
            name="students"
            label="Number of Students"
            rules={[{ required: true, message: 'Please enter the number of students' }]}
          >
            <Input type="number" placeholder="Enter number of students" />
          </Form.Item>
          <Form.Item
            name="course"
            label="Course"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select placeholder="Select a course">
              <Option value="Full Stack Developer">Full Stack Developer</Option>
              <Option value="Digital Marketing">Digital Marketing</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      
      <Modal
        title="View Batch Details"
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        centered
      >
        {currentBatch && (
          <div>
            <p><strong>Batch Name:</strong> {currentBatch.name}</p>
            <p><strong>Students:</strong> {currentBatch.students}</p>
            <p><strong>Course:</strong> {currentBatch.course}</p>
            <p><strong>Date:</strong> {currentBatch.date}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Batches;
