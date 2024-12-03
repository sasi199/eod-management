import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
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
import {
  AddStaffs,
  AllStaffs,
  DeleteStaffs,
  EditStaffs,
} from "../../../../services";
import dayjs from "dayjs";

const { Option } = Select;

const Staffs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [showIsTrainer, setShowIsTrainer] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editModal, SetEditModal] = useState(false);
  const [editStaff, SetEditStaff] = useState({
    id: "",
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    address: "",
    designation: "",
    qualification: "",
    dob: "",
    experience: "",
    hybrid: "",
    role: "",
    password: "",
    profilePic: "",
    isTrainer: "",
  });

  useEffect(() => {
    const fetchStaffData = () => {
      AllStaffs()
        .then((res) => {
          setStaffs(res.data.data);
          console.log(res.data.data);
        })
        .catch((error) => {
          message.error("Error fetching staff data. Please try again.");
          console.error("Error fetching staff data:", error.message);
        });
    };

    fetchStaffData();
  }, []);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCardClick = (staff) => {
    setSelectedStaff(staff);
    setIsCardModalVisible(true);
  };
  const handleCloseCardModal = () => {
    setSelectedStaff(null);
    setIsCardModalVisible(false);
  };

  const handleRoleChange = (value) => {
    setShowIsTrainer(value === "Employee");
  };

  const handleAddStaff = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("address", values.address);
    formData.append("designation", values.designation);
    formData.append("qualification", values.qualification);
    formData.append("dob", values.dob);
    formData.append("experience", values.experience);
    formData.append("hybrid", values.hybrid);
    formData.append("role", values.role);
    formData.append("password", values.password);
    formData.append("isTrainer", values.isTrainer);
    console.log(values);

    if (values.profilePic && values.profilePic.file) {
      formData.append("profilePic", values.profilePic.file);
    }

    await AddStaffs(formData)
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

  const handleEditStaffModal = (staff) => {
    console.log(staff);

    SetEditModal(true);
    SetEditStaff({
      id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      gender: staff.gender,
      phoneNumber: staff.phoneNumber,
      address: staff.address,
      designation: staff.designation,
      qualification: staff.qualification,
      dob: staff.dob,
      experience: staff.experience,
      hybrid: staff.hybrid,
      role: staff.role,
      password: staff.password,
    });
  };

  const handleEditStaff = (values) => {
    const editFormData = new FormData();

    editFormData.append("fullName", editStaff.fullName);
    editFormData.append("email", editStaff.email);
    editFormData.append("gender", editStaff.gender);
    editFormData.append("phoneNumber", editStaff.phoneNumber);
    editFormData.append("address", editStaff.address);
    editFormData.append("designation", editStaff.designation);
    editFormData.append("qualification", editStaff.qualification);
    editFormData.append("dob", editStaff.dob);
    editFormData.append("experience", editStaff.experience);
    editFormData.append("hybrid", editStaff.hybrid);
    editFormData.append("role", editStaff.role);
    // editFormData.append("password", editStaff.password);

    if (values.profilePic && values.profilePic.file) {
      editFormData.append("profilePic", values.profilePic.file);
    }

    EditStaffs(editStaff.id, editFormData)
      .then((res) => {
        if (res.status === 200) {
          message.success("Edit Successfull");
          SetEditModal(false);
          console.log(editFormData);
        }
      })
      .catch((err) => {
        console.log(err, "error editing staffs");
      });
  };
  const handleDeleteStaff = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Staff?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        className: "bg-orange-500 text-white hover:bg-orange-600",
      },
      cancelButtonProps: {
        className: "bg-gray-500 text-white hover:bg-gray-600",
      },
      
      onOk: async () => {
        try {
          // Pass the correct ID to delete
          await DeleteStaffs(id);

          // Make sure the filtering is done using the correct ID field
          setStaffs(
            (prevStaffs) => prevStaffs.filter((staff) => staff._id !== id) // Use _id if your staff object has _id
          );
          message.success("Staff deleted successfully.");
        } catch (error) {
          console.error("Error deleting Staff:", error);
          message.error("Failed to delete the Staff. Please try again.");
        }
      },
      onCancel: () => {
        message.info("Deletion canceled.");
      },
    });
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
        {staffs.length > 0 ? (
          staffs.map((staff) => (
            <div
              key={staff.id}
              className="bg-white shadow-[0px_1px_14px_7px_#00000024] rounded-lg  overflow-hidden w-full"
            >
              {/* Image Container with Overlay */}
              <div className="relative group">
                {/* Staff Image */}
                <img
                  className="w-full h-60 object-cover p-2 rounded-xl"
                  src={staff?.profilePic || "https://via.placeholder.com/400"}
                  alt={staff.name}
                />

                {/* Overlay for Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    {/* View Icon */}
                    <button
                      className="flex flex-col justify-center items-center w-8 h-8 rounded-full text-white bg-orange-500 hover:bg-white hover:text-orange-500 duration-200"
                      onClick={() => handleCardClick(staff)}
                    >
                      <span className="text-sm">
                        <FiEye size={20} />
                      </span>
                    </button>

                    {/* Edit Icon */}
                    <button
                      className="flex flex-col justify-center items-center w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-white hover:text-orange-500 duration-200"
                      onClick={() => handleEditStaffModal(staff)}
                    >
                      <span className="text-sm">
                        <FiEdit size={20} />
                      </span>
                    </button>

                    {/* Delete Icon */}
                    <button
                      className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-white hover:text-orange-500 duration-200"
                      onClick={() => handleDeleteStaff(staff._id)}
                    >
                      <span className="text-sm ">
                        <FiTrash size={20} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Staff Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Name: {staff.fullName}
                </h2>
                <p className="text-gray-600">Position: {staff.role}</p>
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
            <Select className="w-full" onChange={handleRoleChange}>
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
            <DatePicker
              className="w-full"
              format="DD-MM-YYYY"
              onChange={(date) => {
                if (date) {
                  const formattedDate = dayjs(date).format("DD-MM-YYYY");
                  console.log("Formatted Date of Birth:", formattedDate);
                }
              }}
            />
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
            className="col-span-1"
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
          {showIsTrainer && (
            <Form.Item
              label="IsTrainer"
              name="isTrainer"
              rules={[{ required: true, message: "Please select yes or no" }]}
              className="col-span-1"
            >
              <Select className="w-full">
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item className="col-span-2">
            <button  htmlType="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md">
              Add Staff
            </button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <h2 className="text-2xl font-bold text-gray-800">Staff Details</h2>
        }
        visible={isCardModalVisible}
        onCancel={handleCloseCardModal}
        footer={null}
        width="60%"
        centered
      >
        {selectedStaff && (
          <div className="flex flex-col md:flex-row items-center gap-8 p-">
            {/* Image Section */}
            <div className="flex justify-center">
              <img
                className="h-[400px] w-[600px]   object-cover rounded-lg"
                src={
                  selectedStaff.profilePic || "https://via.placeholder.com/400"
                }
                alt={selectedStaff.fullName}
              />
            </div>

            {/* Data Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white w-full p-6 h-96 rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold mb-4">
                {selectedStaff.fullName}
              </h2>
              <div className="space-y-4 text-lg">
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {selectedStaff.gender}
                </p>
                <p>
                  <span className="font-semibold">Role:</span>{" "}
                  {selectedStaff.role}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedStaff.email}
                </p>
                <p>
                  <span className="font-semibold">Dob:</span>{" "}
                  {selectedStaff.dob}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedStaff.phoneNumber}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {selectedStaff.address}
                </p>

                <p>
                  <span className="font-semibold">Qualification:</span>{" "}
                  {selectedStaff.qualification}
                </p>
                <p>
                  <span className="font-semibold">Designation:</span>{" "}
                  {selectedStaff.designation}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Staff Details"
        visible={editModal}
        footer={null}
        onCancel={() => SetEditModal(false)}
        centered
      >
        {editStaff && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditStaff}
            className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4"
          >
            <Form.Item
              label="Full Name"
              // name="fullName"
              rules={[{ required: true, message: "Please enter full name" }]}
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.fullName}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, fullName: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Email"
              // name="email"
              rules={[{ type: "email", message: "Please enter a valid email" }]}
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.email}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, email: e.target.value })
                }
              />
            </Form.Item>

            {/* <Form.Item
              label="Password"
              // name="password"
              rules={[{ required: true, message: "Please enter password" }]}
              className="col-span-1"
            >
              <Input.Password
                className="w-full"
                value={editStaff.password}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, password: e.target.value })
                }
              />
            </Form.Item> */}

            <Form.Item
              label="Gender"
              // name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
              className="col-span-1"
            >
              <Select
                className="w-full"
                value={editStaff.gender}
                onChange={(value) =>
                  SetEditStaff({ ...editStaff, gender: value })
                }
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Phone Number"
              // name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.phoneNumber}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, phoneNumber: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Address"
              // name="address"
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.address}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, address: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Designation"
              // name="designation"
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.designation}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, designation: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Role"
              // name="role"
              rules={[{ required: true, message: "Please select role" }]}
              className="col-span-1"
            >
              <Select
                className="w-full"
                value={editStaff.role}
                onChange={(value) => {
                  console.log("role", value);

                  SetEditStaff({ ...editStaff, role: value });
                }}
              >
                <Option value="Admin">Admin</Option>
                <Option value="HR">HR</Option>
                <Option value="Coordinator">Coordinator</Option>
                <Option value="Employee">Employee</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Qualification"
              // name="qualification"
              className="col-span-1"
            >
              <Input
                className="w-full"
                value={editStaff.qualification}
                onChange={(e) =>
                  SetEditStaff({ ...editStaff, qualification: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              // name="dob"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
              className="col-span-1"
            >
              <DatePicker
                className="w-full"
                format="DD-MM-YY"
                value={
                  editStaff.dob ? dayjs(editStaff.dob, "DD-MM-YYYY") : null
                }
                onChange={(e) =>
                  SetEditStaff({
                    ...editStaff,
                    dob: e ? e.format("DD-MM-YYYY") : null,
                  })
                }
              />
            </Form.Item>

            <Form.Item
              label="Experience"
              // name="experience"
              className="col-span-1"
            >
              <Select
                className="w-full"
                value={editStaff.experience}
                onChange={(value) =>
                  SetEditStaff({ ...editStaff, experience: value })
                }
              >
                <Option value="0 to 1">0 to 1</Option>
                <Option value="1 to 3">1 to 3</Option>
                <Option value="3 to 5">3 to 5</Option>
                <Option value="5+">5+</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Hybrid"
              // name="hybrid"
              rules={[
                { required: true, message: "Please select hybrid work model" },
              ]}
              className="col-span-1"
            >
              <Select
                className="w-full"
                value={editStaff.hybrid}
                onChange={(value) =>
                  SetEditStaff({ ...editStaff, hybrid: value })
                }
              >
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
              <button  htmlType="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1 rounded-md">
                Add Staff
              </button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Staffs;
