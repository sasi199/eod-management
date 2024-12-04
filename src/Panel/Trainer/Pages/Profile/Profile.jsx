import React, { useState } from "react";
import { Input, Select, DatePicker, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStaff, setEditStaff] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    gender: "Male",
    phoneNumber: "+1234567890",
    address: "123 Street, City, Country",
    designation: "Software Engineer",
    role: "Employee",
    qualification: "B.Tech in Computer Science",
    dob: "15-08-1990",
    experience: "3 to 5",
    hybrid: "WFH",
    profilePic: null,
  });

  const handleProfilePicUpload = (file) => {
    setEditStaff({ ...editStaff, profilePic: file });
    return false;
  };

  const handleSaveChanges = () => {
    console.log("Updated Staff Profile:", editStaff);
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 relative">
            <img
              src={editStaff.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-full w-full h-full object-cover border-4 border-gradient-to-r from-green-500 to-purple-600"
            />
            <Upload
              showUploadList={false}
              beforeUpload={handleProfilePicUpload}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg"
            >
              <UploadOutlined className="text-green-600" />
            </Upload>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isEditing ? (
              <Input
                value={editStaff.fullName}
                onChange={(e) => setEditStaff({ ...editStaff, fullName: e.target.value })}
                className="mt-2 text-center"
              />
            ) : (
              editStaff.fullName
            )}
          </h2>
          <p className="text-lg text-gray-600">
            {isEditing ? (
              <Input
                value={editStaff.designation}
                onChange={(e) => setEditStaff({ ...editStaff, designation: e.target.value })}
                className="mt-2 text-center"
              />
            ) : (
              editStaff.designation
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Email</h3>
            {isEditing ? (
              <Input
                value={editStaff.email}
                onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Phone Number</h3>
            {isEditing ? (
              <Input
                value={editStaff.phoneNumber}
                onChange={(e) => setEditStaff({ ...editStaff, phoneNumber: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Gender</h3>
            {isEditing ? (
              <Select
                value={editStaff.gender}
                onChange={(val) => setEditStaff({ ...editStaff, gender: val })}
                className="mt-2 w-full"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Date of Birth</h3>
            {isEditing ? (
              <DatePicker
                format="DD-MM-YYYY"
                value={editStaff.dob ? dayjs(editStaff.dob, "DD-MM-YYYY") : null}
                onChange={(date) => setEditStaff({ ...editStaff, dob: date ? date.format("DD-MM-YYYY") : null })}
                className="mt-2 w-full"
              />
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.dob}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Address</h3>
            {isEditing ? (
              <Input
                value={editStaff.address}
                onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Role</h3>
            {isEditing ? (
              <Select
                value={editStaff.role}
                onChange={(val) => setEditStaff({ ...editStaff, role: val })}
                className="mt-2 w-full"
              >
                <Option value="Admin">Admin</Option>
                <Option value="HR">HR</Option>
                <Option value="Coordinator">Coordinator</Option>
                <Option value="Employee">Employee</Option>
              </Select>
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Qualification</h3>
            {isEditing ? (
              <Input
                value={editStaff.qualification}
                onChange={(e) => setEditStaff({ ...editStaff, qualification: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.qualification}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Experience</h3>
            {isEditing ? (
              <Select
                value={editStaff.experience}
                onChange={(val) => setEditStaff({ ...editStaff, experience: val })}
                className="mt-2 w-full"
              >
                <Option value="0 to 1">0 to 1</Option>
                <Option value="1 to 3">1 to 3</Option>
                <Option value="3 to 5">3 to 5</Option>
                <Option value="5+">5+</Option>
              </Select>
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.experience}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Hybrid Work</h3>
            {isEditing ? (
              <Select
                value={editStaff.hybrid}
                onChange={(val) => setEditStaff({ ...editStaff, hybrid: val })}
                className="mt-2 w-full"
              >
                <Option value="Online">Online</Option>
                <Option value="Offline">Offline</Option>
                <Option value="WFH">WFH</Option>
              </Select>
            ) : (
              <p className="mt-2 text-gray-600">{editStaff.hybrid}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            onClick={toggleEditMode}
            className="bg-orange-500 text-white py-2 px-6 rounded-md"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white py-2 px-6 rounded-md"
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
