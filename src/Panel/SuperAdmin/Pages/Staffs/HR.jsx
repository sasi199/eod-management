import React, { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { Modal, Form, Input, Select, Button, Upload, DatePicker } from 'antd';
import admin1 from '../../../../assets/SuperAdmin/admin1.jpg';
import admin2 from '../../../../assets/SuperAdmin/admin2.jpg';
import admin3 from '../../../../assets/SuperAdmin/admin3.jpg';
import { UploadOutlined } from '@ant-design/icons';

const HR = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const HR = [
    {
      id: 1,
      name: "ElangaiVendhan",
      position: "Human Resource",
      image: admin1,
    },
    {
      id: 2,
      name: "Anjali Raj",
      position: "Human Resource",
      image: admin2,
    },
    {
      id: 3,
      name: "Rohit Sharma",
      position: "Human Resource",
      image: admin3,
    },
  ];

  const filteredAdmins = HR.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddHR = (values) => {
    console.log("Form values:", values);
    handleCloseModal();
  };

  return (
    <div className="px-6 py-2">
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search Human Resource"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleOpenModal}
          className="flex gap-2 items-center px-4 py-1 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
        >
          <IoMdAdd className="text-white" />
          Add HR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((HR) => (
            <div key={HR.id} className="bg-white shadow-lg rounded-lg border-2 overflow-hidden border-gray-200 w-full">
              <img
                className="w-full h-60 object-cover"
                src={HR.image}
                alt={HR.name}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">Name: {HR.name}</h2>
                <p className="text-gray-600">{HR.position}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No admins found.</p>
        )}
      </div>

      
      <Modal
        title="Add HR"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddHR}
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
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
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
            <Select defaultValue="HR" disabled className="w-full">
              <Select.Option value="HR">HR</Select.Option>
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
            <Button type="primary" onClick={() => form.submit()}>
              Add HR
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HR;
