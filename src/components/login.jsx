import React, { useEffect, useState } from "react";
import logo from "../assets/Login/LoginImage.jpg";
import img1 from "../assets/Login/BrowserLogo.png";
import { useNavigate } from "react-router-dom";
import { AddTrainee, GetBatches, login } from "../services";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import UploadOutlined from "@ant-design/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [batches, setBatches] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        

        const loginData = {
          email,
          password,
          role,
          latitude,
          longitude,
        };

        console.log("Login Data:", loginData);

        login(loginData)
          .then((response) => {
            console.log("Login Response:", response);

            if (response.data.status === true) {
              localStorage.setItem("authToken", response.data.data);
              setEmail("");
              setPassword("");
              setRole("");

              console.log("User Role:", role);

              if (role === "SuperAdmin") {
                navigate("/sidebar/dashboard");
              } else if (role === "Admin") {
                navigate("/admin");
              } else if (role === "Employee") {
                navigate("/trainersidebar/dashboard");
              } else if (role === "Trainee") {
                navigate("/traineesidebar/dashboard");
              } else {
                navigate("/");
              }
            } else {
              alert(response.message || "Invalid credentials");
            }
          })
          .catch((error) => {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
          });
      },

      (error) => {
        console.error("Failed to fetch location:", error);
        alert("alert ta iru");
      },
      {
        enableHighAccuracy: true, 
            
      }
    );
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

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

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "profilePic" || key === "resumeUpload") {
          if (values[key]?.file) {
            formData.append(key, values[key].file.originFileObj);
          }
        } else if (key === "dob") {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await AddTrainee(formData);

      message.success({
        content: response.data.message || "Registration Successful!",
        key: "formSubmit",
      });

      form.resetFields();
      handleModalClose();
    } catch (error) {
      message.error({
        content:
          error.response?.data?.message ||
          "Failed to register. Please try again.",
        key: "formSubmit",
      });
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full justify-center items-center gap-12">
        <img src={logo} alt="Login Logo" className="rounded-3xl" width={450} />
        <div className="flex flex-col justify-center items-center space-y-1">
          <img
            src={img1}
            alt="Browser Logo"
            className="rounded-full"
            width={55}
          />
          <h1 className="text-2xl font-semibold">Why Global Services</h1>
          <h1 className="text-lg font-medium">Please enter your details</h1>
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="flex flex-col gap-5">
              <input
                className="border-orange-200 border-b-2 mt-3 outline-none p-1"
                placeholder="User ID or Mail ID"
                type="text"
                size="35"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border-orange-200 border-b-2 mt-2 outline-none p-1"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                className="border-orange-200 border-b-2 mt-2 outline-none p-1 bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>
            <div className="text-center ">
              <button
                type="submit"
                className="py-1 px-3 mt-9 bg-orange-400 font-bold text-white rounded-md hover:bg-orange-500 transition"
              >
                Log in
              </button>
            </div>
          </form>
          <button
            className="py-1 px-3 mt-9 bg-orange-400 font-bold text-white rounded-md hover:bg-orange-500 transition"
            onClick={handleModalOpen}
          >
            Student register
          </button>
        </div>
      </div>
      <Modal
        title="Student Registration"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        {/* Modal content */}
        <Form layout="vertical" onFinish={handleFormSubmit} form={form}>
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
                  { required: true, message: "Please select the gender!" },
                ]}
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
                rules={[
                  { required: true, message: "Please select the hybrid mode!" },
                ]}
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
                <Form.Item label="Batch" name="batch">
                  <Select placeholder="Select Batch">
                    {Array.isArray(batches) &&
                      batches.map((batch) => (
                        <Select.Option key={batch._id} value={batch._id}>
                          {batch.batchName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
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
              <Form.Item
                label="Experience"
                name="experience"
                rules={[
                  { required: true, message: "Please select the experience!" },
                ]}
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
                rules={[
                  { required: true, message: "Please enter the password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end">
            <Button onClick={handleModalClose} className="mr-4">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
