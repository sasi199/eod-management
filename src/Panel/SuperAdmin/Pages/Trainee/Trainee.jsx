import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Form, Input, Button, DatePicker, Radio, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Trainee = () => {
  const [batchFilter, setBatchFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", batch: "Batch A" },
    { id: 2, name: "Jane Smith", batch: "Batch B" },
    { id: 3, name: "Samuel Green", batch: "Batch A" },
    { id: 4, name: "Emily Johnson", batch: "Batch C" },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddStudent = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    console.log("Form Values:", values);
    setIsModalVisible(false);
    const newStudent = {
      id: students.length + 1,
      name: values.fullName,
      batch: "Batch A", // Default batch
    };
    setStudents([...students, newStudent]);
  };

  const filteredData = students.filter(
    (student) =>
      (batchFilter ? student.batch === batchFilter : true) &&
      (nameFilter
        ? student.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true)
  );

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Batch", selector: (row) => row.batch, sortable: true },
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <select
            className="border px-4 py-2 rounded"
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          >
            <option value="">All Batches</option>
            <option value="Batch A">Batch A</option>
            <option value="Batch B">Batch B</option>
            <option value="Batch C">Batch C</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Name"
            className="border px-4 py-2 rounded"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Add Student
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="border rounded"
      />

      <Modal
        title="Add Student"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
      >
        <Form
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            gender: "Male",
            hybrid: "Online",
          }}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the full name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please select the date of birth!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter the phone number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Profile Picture" name="profilePic">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Current Address"
            name="currentAddress"
            rules={[{ required: true, message: "Please enter the current address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hybrid" name="hybrid">
            <Radio.Group>
              <Radio value="Online">Online</Radio>
              <Radio value="Offline">Offline</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Trainee;
