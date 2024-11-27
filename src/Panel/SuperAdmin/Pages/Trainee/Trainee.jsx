import React, { useState, useEffect } from "react";
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
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AddTrainee, EditTrainee, GetBatches, GetTrainee } from "../../../../services";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import moment from 'moment';

const Trainee = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [form] = Form.useForm();
  const [batches, setBatches] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);  // State for Add Student modal
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // State for View Student modal
  const[editingTrainee,setEditingTrainee]=useState(null)
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await GetTrainee();
        setStudents(response?.data.data);
        console.log(response.data.data);
      } catch (error) {
        message.error("Failed to fetch trainees.");
      }
    };
    fetchTrainees();
  }, []);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches();
        setBatches(response.data.data);
      } catch (error) {
        message.error("Failed to fetch batches.");
      }
    };
    fetchBatches();
  }, []);

  const handleAddStudent = () => {
    setIsAddModalVisible(true);
    setEditingTrainee(null);
    form.resetFields();
  };
  const handleEditTrainee= (trainee) => {
    setEditingTrainee(trainee); // Set the batch to edit
    form.setFieldsValue(trainee); // Prefill the form with batch data
    setIsAddModalVisible(true);
  };


  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsViewModalVisible(false);
  }
  const handleFormSubmit = async (values) => {
    try {
     
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "profilePic" || key === "resumeUpload") {
          if (values[key] && values[key].file) {
            formData.append(key, values[key].file.originFileObj);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
  
      if (editingTrainee) {
       
        try {
          const response = await EditTrainee(editingTrainee.id, formData);
          setStudents((prevStudents) =>
            prevStudents.map((trainee) =>
              trainee.id === editingTrainee.id ? { ...trainee, ...values } : trainee
            )
          );
          console.log("Traiee updated:", response);
          message.success("trainee updated successfully!");
        } catch (error) {
          console.error("Error updating Trainee:", error);
          message.error("Failed to update Trainee!");
        }
      } else {
        // Add new batch
        try {
          const response = await AddTrainee(formData);
          const newTrainee = {
            ...values,
            id: response.data.id, 
          };
          setStudents([...students, newTrainee]);
          console.log("Trainee added:", response);
          message.success("Trainee added successfully!");
        } catch (error) {
          console.error("Error adding Trainee:", error);
          message.error("Failed to add Trainee!");
        }
      }
  
      form.resetFields();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Validation Failed:", error);
      message.error("Please check the form fields!");
    }
  };

 const filteredData = students.filter(
    (student) =>
      (nameFilter ? student.fullName.toLowerCase().includes(nameFilter.toLowerCase()) : true)
  );

  const handleView = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setSelectedTrainee(student);
    setIsViewModalVisible(true);  
  };

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, center: true },
    {
      name: "Profile",
      selector: (row) => <img src={row.profilePic} alt="profile pic" className="w-12 h-12 rounded-full object-cover" />,
      sortable: true,
      center:true
    },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true , center:true},
    { name: "Batch", selector: (row) => row.batch, sortable: true, center:true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true, center:true },
    { name: "Email", selector: (row) => row.email, sortable: true, center:true },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex space-x-4 justify-center">
          <button onClick={() => handleView(row._id)} className="text-blue-500">
            <FaEye size={16} />
          </button>
          <button onClick={() => handleEditTrainee(row)} className="text-orange-500">
            <FaEdit size={16}/>
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-red-500">
            <FaTrash  size={16  }/>
          </button>
        </div>
      ),
      center: true,
    },
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
         
          <input
            type="text"
            placeholder="Filter by Name"
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Add Student
        </button>
      </div>

      <DataTable
        columns={columns}
        
        data={filteredData}
        customStyles={customStyles}
        pagination
        className="border rounded-lg shadow-lg"
      />

      <Modal
        title={editingTrainee ? "Edit Batch" : "Add New Batch"}
      open={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleFormSubmit} form={form} initialValues={{fullName: "",
    email: "",
    dob: undefined, 
    phoneNumber: "",
    gender: undefined, 
    profilePic: undefined, 
    batch: undefined,
    currentAddress: "",
    permanentAddress: "",
    experience: undefined,
    qualification: "",
    role: "Trainee", 
    password: "",
    }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter the full name!" }]}
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
        rules={[{ required: true, message: "Please select the date of birth!" }]}
      >
        <DatePicker 
          style={{ width: "100%" }} 
          value={form.getFieldValue('dob') ? moment(form.getFieldValue('dob')) : null} // Ensure the value is a moment object
          onChange={(date) => form.setFieldsValue({ dob: date ? moment(date) : null })}  // Ensure the value is set as moment
        />
      </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Please enter the phone number!" }]}
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
                rules={[{ required: true, message: "Please select the gender!" }]}
              >
                <Select placeholder="Select Gender">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hybrid"
                name="hybrid"
                rules={[{ required: true, message: "Please select the hybrid mode!" }]}
              >
                <Select>
                  <Select.Option value="Online">Online</Select.Option>
                  <Select.Option value="WFH">WFH</Select.Option>
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
              <Form.Item label="Batch" name="batch">
                <Select placeholder="Select Batch">
                  {batches.map((batch) => (
                    <Select.Option key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Current Address"
                name="currentAddress"
                rules={[{ required: true, message: "Please enter the current address!" }]}
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
              <Form.Item
                label="Experience"
                name="experience"
                rules={[{ required: true, message: "Please select the experience!" }]}
              >
                <Select>
                  <Select.Option value="0 to 1">0 to 1</Select.Option>
                  <Select.Option value="1 to 3">1 to 3</Select.Option>
                  <Select.Option value="3 to 5">3 to 5</Select.Option>
                  <Select.Option value="5+">5+</Select.Option>
                </Select>
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
              <Form.Item
                label="Role"
                name="role"
                initialValue="Trainee"
                rules={[{ required: true, message: "Please select the role!" }]}
              >
                <Select>
                  <Select.Option value="Trainer">Trainer</Select.Option>
                  <Select.Option value="Trainee">Trainee</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: "Please enter the password!" }]}
    >
      <Input.Password />
    </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end">
            <Button onClick={handleModalCancel} className="mr-4">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Trainee Details"
        visible={isViewModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width="60%"
      >
        {selectedTrainee ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex justify-center items-center">
           <img
             src={selectedTrainee.profilePic}
             alt="Profile"
             className="h-[400px] object-cover"
           />
         </div>
         <div className="p-4 rounded-lg text-white bg-orange-500 space-y-4">
  <p className="text-lg">
    <span className="font-semibold">Full Name:</span> {selectedTrainee.fullName}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Email:</span> {selectedTrainee.email}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Phone Number:</span> {selectedTrainee.phoneNumber}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Batch:</span> {selectedTrainee.batch}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Gender:</span> {selectedTrainee.gender}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Current Address:</span> {selectedTrainee.currentAddress}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Permanent Address:</span> {selectedTrainee.permanentAddress}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Experience:</span> {selectedTrainee.experience}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Qualification:</span> {selectedTrainee.qualification}
  </p>
  <p className="text-lg">
    <span className="font-semibold">Role:</span> {selectedTrainee.role}
  </p>
</div>

       </div>
       
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

    </div>
  );
};


export default Trainee;
