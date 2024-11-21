import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Select,
  Row,
  Col,
} from "antd";
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
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter the full name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter the email!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "Please select the date of birth!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter the phone number!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  { required: true, message: "Please enter the gender!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hybrid"
                name="hybrid"
                rules={[
                  { required: true, message: "Please select the hybrid mode!" },
                ]}
              >
                <Select>
                  <Select.Option value="Online">Online</Select.Option>
                  <Select.Option value="Offline">Offline</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Profile Picture" name="profilePic">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item label="Batch" name="batch">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Current Address"
                name="currentAddress"
                rules={[
                  {
                    required: true,
                    message: "Please enter the current address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Permanent Address" name="permanentAddress">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Father's Name" name="fatherName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mother's Name" name="motherName">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Additional Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Contact Number" name="contact">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Guardian Name" name="guardian">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Account Holder Name" name="accountHolderName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Account Number" name="accountNumber">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bank Name" name="bankName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="IFSC Code" name="ifscCode">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Branch" name="branch">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Resume Upload" name="resumeUpload">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Experience" name="experience">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Qualification" name="qualification">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Role" name="role">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Password" name="password">
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

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
