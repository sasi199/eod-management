import React, { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { Modal, Form, Input, Select, DatePicker, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import admin1 from '../../../../assets/SuperAdmin/admin1.jpg';
import admin2 from '../../../../assets/SuperAdmin/admin2.jpg';
import admin3 from '../../../../assets/SuperAdmin/admin3.jpg';

const { Option } = Select;

const Coordinator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const coordinator = [
    {
      id: 1,
      name: "ElangaiVendhan",
      position: "Coordinator",
      image: admin1,
    },
    {
      id: 2,
      name: "Anjali Raj",
      position: "Coordinator",
      image: admin2,
    },
    {
      id: 3,
      name: "Rohit Sharma",
      position: "Coordinator",
      image: admin3,
    },
  ];

  const filteredCoordinator = coordinator.filter(coordinator => 
    coordinator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const showModal = () => {
    setIsModalVisible(true);
  };

 
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  const handleAddCoordinator = (values) => {
    console.log("Form Submitted:", values);
    setIsModalVisible(false); 
  };

  return (
    <div className="px-6 py-2">
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search Coordinator"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={showModal}
          className="flex gap-2 items-center px-3 py-1 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
        >
          <IoMdAdd className="text-white" />
          Add Coordinator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredCoordinator.length > 0 ? (
          filteredCoordinator.map((coordinator) => (
            <div key={coordinator.id} className="bg-white shadow-lg rounded-lg border-2 overflow-hidden border-gray-200 w-full">
              <img
                className="w-full h-60 object-cover"
                src={coordinator.image}
                alt={coordinator.name}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">Name: {coordinator.name}</h2>
                <p className="text-gray-600">{coordinator.position}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No Coordinators found.</p>
        )}
      </div>

      
      <Modal
        title="Add New Coordinator"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCoordinator}
          className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter full name" }]}
            className="col-span-1"
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Please enter a valid email" }]}
            className="col-span-1"
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
            className="col-span-1"
          >
            <Select className="w-full">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter phone number" }]}
            className="col-span-1"
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item label="Address" name="address" className="col-span-1">
            <Input className="w-full" />
          </Form.Item>

          <Form.Item label="Designation" name="designation" className="col-span-1">
            <Input className="w-full" />
          </Form.Item>

          <Form.Item label="Role" name="role" className="col-span-1">
            <Select disabled className="w-full" defaultValue="Coordinator">
              <Option value="Coordinator">Coordinator</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Qualification" name="qualification" className="col-span-1">
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please select date of birth" }]}
            className="col-span-1"
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Experience" name="experience" className="col-span-1">
            <Input className="w-full" />
          </Form.Item>

          <Form.Item label="Profile Picture" name="profilePic" valuePropName="file" className="col-span-2">
            <Upload beforeUpload={() => false} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button className='bg-orange-500 text-white' onClick={() => form.submit()}>
              Add Coordinator
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Coordinator;
