import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import admin1 from "../../../../assets/SuperAdmin/admin1.jpg";
import admin2 from "../../../../assets/SuperAdmin/admin2.jpg";
import admin3 from "../../../../assets/SuperAdmin/admin3.jpg";
import { AddStaffs } from "../../../../services";

const { Option } = Select;

const Staffs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [staffData, SetStaffData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    address: "",
    designation: "",
    qualification: "",
    dob: "",
    experience: "",
    profilePic: "",
    hybrid: "",
    role: "",
    password: "",
  });
  const staffs = [
    { id: 1, name: "ElangaiVendhan", position: "Admin", image: admin1 },
    { id: 2, name: "Kavin", position: "Admin", image: admin2 },
    { id: 3, name: "Gopi", position: "Admin", image: admin3 },
    { id: 4, name: "Elangaivendan", position: "HR", image: admin2 },
    { id: 5, name: "Kavin", position: "Coordinator", image: admin2 },
    { id: 6, name: "Gopi", position: "Trainer", image: admin3 },
  ];

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddStaff = async (values) => {
    // try {
    SetStaffData({
      fullName: values.fullName,
      email: values.email,
      gender: values.gender,
      phoneNumber: values.phoneNumber,
      address: values.address,
      designation: values.designation,
      qualification: values.qualification,
      dob: values.dob,
      experience: values.experience,
      profilePic: values.profilePic?.file?.name || null,
      hybrid: values.hybrid,
      role: values.role,
      password: values.password,
    });
    //   console.log(response, "rtyuio");
    //   const response = await AddStaffs(staffData);

    //   if (response.status === 200) {
    //     message.success("Staff added successfully!");
    //     handleCloseModal();
    //   } else {
    //     message.error("Failed to add staff.");
    //   }
    // } catch (error) {
    //   message.error("Error adding staff. Please try again.");
    // }

    await AddStaffs(staffData)
      .then((res) => {
        if (res.status === 200) {
          message.success("Staff added successfully!");
          handleCloseModal();
        } else {
          message.error("Failed to add staff.");
        }
      })
      .catch((err) => {
        console.log(err, "error adding staffs");
      });
  };

  const handleProfilePicUpload = (file) => {
    form.setFieldValue("profilePic", file);
    return false;
  };

  return (
    <div className="px-6 py-2">
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search Staff"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleOpenModal}
          className="flex gap-2 items-center px-3 py-1 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
        >
          <IoMdAdd className="text-white" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredStaffs.length > 0 ? (
          filteredStaffs.map((staff) => (
            <div
              key={staff.id}
              className="bg-white shadow-lg rounded-lg border-2 overflow-hidden border-gray-200 w-full"
            >
              <img
                className="w-full h-60 object-cover"
                src={staff.image}
                alt={staff.name}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Name: {staff.name}
                </h2>
                <p className="text-gray-600">Position: {staff.position}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No Staffs found.
          </p>
        )}
      </div>

      <Modal
        title="Add New Staff"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStaff}
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
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
            className="col-span-1"
          >
            <Input.Password className="w-full" />
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

          <Form.Item
            label="Designation"
            name="designation"
            className="col-span-1"
          >
            <Input className="w-full" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
            className="col-span-1"
          >
            <Select className="w-full">
              <Option value="Admin">Admin</Option>
              <Option value="HR">HR</Option>
              <Option value="Coordinator">Coordinator</Option>
              <Option value="Employee">Employee</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Qualification"
            name="qualification"
            className="col-span-1"
          >
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

          <Form.Item
            label="Experience"
            name="experience"
            className="col-span-1"
          >
            <Select className="w-full">
              <Option value="0 to 1">0 to 1</Option>
              <Option value="1 to 3">1 to 3</Option>
              <Option value="3 to 5">3 to 5</Option>
              <Option value="5+">5+</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hybrid"
            name="hybrid"
            rules={[
              { required: true, message: "Please select hybrid work model" },
            ]}
            className="col-span-1"
          >
            <Select className="w-full">
              <Option value="Online">Online</Option>
              <Option value="Offline">Offline</Option>
              <Option value="WFH">WFH</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Profile Picture"
            name="profilePic"
            valuePropName="file"
            className="col-span-2"
          >
            <Upload
              beforeUpload={handleProfilePicUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} className="w-full">
                Upload Profile Picture
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="col-span-2">
            <Button type="primary" htmlType="submit" className="w-full">
              Add Staff
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Staffs;
