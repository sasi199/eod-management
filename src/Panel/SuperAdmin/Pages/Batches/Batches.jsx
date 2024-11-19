import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Input, Select, Button, Form } from 'antd';
import { AddBatches, GetBatches } from '../../../../services';

const { Option } = Select;

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Example trainers data
  const trainersData = [
    { name: 'John', image: '/path-to-images/john.jpg' },
    { name: 'Jane', image: '/path-to-images/jane.jpg' },
  ];


 // Fetch batches data from API
 useEffect(() => {
  const fetchBatches = async () => {
   
    try {
      const response = await GetBatches();
      setBatches(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  fetchBatches();
}, []);





  // Table columns configuration
  const columns = [
    { name: 'Course Name', selector: (row) => row.courseName, sortable: true, center: true },
    { name: 'Batch Timings', selector: (row) => row.batchTimings, sortable: true, center: true },
    { name: 'Course Duration', selector: (row) => row.courseDuration, sortable: true, center: true },
    { name: 'Trainers', selector: (row) => row.trainers.join(', '), sortable: true, center: true },
    {
      name: 'Actions',
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => handleDelete(row.id)} className="border border-red-500 text-red-500 px-2">
            Delete
          </Button>
        </div>
      ),
    },
  ];





  // Modal handling for adding a new batch
  const handleAddBatch = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newBatch = {
          id: Math.max(...batches.map((b) => b.id), 0) + 1,
          ...values,
        };

        // Call the API to post the new batch data
        AddBatches(newBatch)
          .then((response) => {
            setBatches([...batches, newBatch]);
            console.log(response);
            form.resetFields();
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.error('Error adding batch:', error);
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    setBatches(batches.filter((batch) => batch.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Batches</h2>
        <Button
          onClick={handleAddBatch}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Add Batch
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        pagination
        highlightOnHover
        className="border rounded shadow-sm"
      />

      <Modal
        title="Add New Batch"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} className="bg-orange-500 text-white hover:bg-orange-600">
            Add
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            courseName: '',
            batchTimings: '',
            courseDuration: '',
            trainers: [],
          }}
        >
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: 'Please select a course name' }]}
          >
            <Select placeholder="Select a course">
              <Option value="Full Stack">Full Stack</Option>
              <Option value="Digital Marketing">Digital Marketing</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="batchTimings"
            label="Batch Timings"
            rules={[{ required: true, message: 'Please select the batch timings' }]}
          >
            <Select placeholder="Select batch timings">
              <Option value="10 am to 02 pm">10 am to 02 pm</Option>
              <Option value="02 pm to 06 pm">02 pm to 06 pm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="courseDuration"
            label="Course Duration"
            rules={[{ required: true, message: 'Please select the course duration' }]}
          >
            <Select placeholder="Select course duration">
              <Option value="3 Months">3 Months</Option>
              <Option value="6 Months">6 Months</Option>
              <Option value="9 Months">9 Months</Option>
              <Option value="12 Months">12 Months</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="trainers"
            label="Add Trainers"
            rules={[{ required: true, message: 'Please select at least one trainer' }]}
          >
            <Select mode="multiple" placeholder="Select trainers">
              {trainersData.map((trainer) => (
                <Option key={trainer.name} value={trainer.name}>
                  <div className="flex items-center gap-2">
                    <img src={trainer.image} alt={trainer.name} className="w-8 h-8 rounded-full" />
                    {trainer.name}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Batches;
