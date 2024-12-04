import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, DatePicker, Select, Space } from "antd";
import { UploadOutlined,MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const TrainerEod = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eods, setEods] = useState([
    {
      username: "John Doe",
      department: "Marketing",
      project: "Website Redesign",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi, laudantium quod neque, quasi ullam eos ducimus debitis nesciunt repudiandae iure, vero officia! Veritatis ipsum dolorum vero sit repudiandae exercitationem hic.",
      date: "2024-12-05",
      files: [
        { name: "homepage_design.png", url: "https://via.placeholder.com/150" },
        { name: "layout_changes.jpg", url: "https://via.placeholder.com/150" },
      ],
      link: "https://example.com",
    },
    {
      username: "Jane Smith",
      department: "Development",
      project: "API Integration",
      description: "Integrated user authentication API",
      date: "2024-12-04",
      files: [
        { name: "auth_api_integration.js", url: "https://via.placeholder.com/150" }
      ],
      link: "https://example.com/api-docs",
    },
    {
      username: "Michael Lee",
      department: "Design",
      project: "Mobile App UI",
      description: "Completed the design of the mobile app's user interface",
      date: "2024-12-03",
      files: [
        { name: "app_ui_design.psd", url: "https://via.placeholder.com/150" }
      ],
      link: "https://example.com/app-ui",
    },
  ]);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [form] = Form.useForm();

  const todayDate = dayjs().format("YYYY-MM-DD");

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFormSubmit = (values) => {
    const newEod = { ...values, date: todayDate }; 
    setEods([newEod, ...eods]); 
    form.resetFields();
    setIsModalOpen(false);
  };

  const filteredEods = eods.filter((eod) => eod.date === filterDate);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <button
       
        className="mb-6 bg-orange-500 text-white  px-3 py-1 rounded-md"
        onClick={showModal}
      >
        Add EOD Report
      </button>

      <div className="">
        <DatePicker
          className="w-full"
          placeholder="Filter by date"
          onChange={(date, dateString) => setFilterDate(dateString || todayDate)}
        />
      </div>
      </div>

      {filteredEods.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">EOD Reports</h2>
          {filteredEods.map((eod, index) => (
            <div
              key={index}
              className="p-6 mb-6 border-l-4  border-orange-500 shadow-md rounded-lg bg-white"
            >
                <div className="flex justify-center items-center">
              <h3 className="text-2xl font-semibold   mb-4">
                {eod.department}
              </h3>
           
              </div>
             <div className="flex  justify-between items-start">
            <div className="">
             <p className="text-lg font-semibold">
  Project: <span className="text-md font-normal ">{eod.project}</span>
  <p className="text-lg font-semibold ">
              Name: <span className="text-md font-normal">{eod.username}</span> 
              </p>
             
</p>
{eod.link && (
                <p className="text-lg font-semibold">
                  Link:{" "}
                  <a
                    href={eod.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    {eod.link}
                  </a>
                </p>
              )}
</div>


              <p className="text-xl font-semibold mb-2">
            Date: <span className="text-lg font-normal"> {eod.date}</span>
              </p>
              </div>
            
             <div className=" mt-12">
                 <p className="text-lg font-semibold flex flex-col  ">
            
            Description: <span className="text-md font-normal"> {eod.description}</span>
          </p>
          </div>
             

          <div className="mb-4">
  <div className="grid grid-cols-2 gap-4 mt-2">
    {eod.files.map((file, index) => (
      <div key={index} className="w-full h-[500px] overflow-hidden border rounded-md">
        <img
          src={file.url}
          alt={file.name}
          className="object-cover w-full h-full"
        />
      </div>
    ))}
  </div>
</div>


             
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No EOD reports found for the selected date.</p>
      )}

      <Modal
        visible={isModalOpen}
        onCancel={handleCancel}
        centered
        title="Add EOD"
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
  label="Department"
  name="department"
  rules={[{ required: true, message: "Please choose your department" }]}
>
  <Select placeholder="Select your department">
    <Select.Option value="hr">Human Resources</Select.Option>
    <Select.Option value="engineering">Engineering</Select.Option>
    <Select.Option value="marketing">Marketing</Select.Option>
    <Select.Option value="sales">Sales</Select.Option>
  </Select>
</Form.Item>

<Form.Item
  label="Project"
  name="project"
  rules={[{ required: true, message: "Please choose your project" }]}
>
  <Select placeholder="Select your project">
    <Select.Option value="project1">Project 1</Select.Option>
    <Select.Option value="project2">Project 2</Select.Option>
    <Select.Option value="project3">Project 3</Select.Option>
    <Select.Option value="project4">Project 4</Select.Option>
  </Select>
</Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} placeholder="Write a brief description" />
          </Form.Item>

          <Form.Item
            label="File Upload"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload 
              multiple 
              listType="picture" 
              beforeUpload={() => false} 
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.List
  name="links"
  initialValue={[]}
  rules={[
    {
      validator: async(_, links) => {
        if (!links || links.length < 1) {
          return Promise.reject(new Error('At least one link is required'));
        }
      },
    },
  ]}
>
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item
            {...restField}
            name={[name, 'link']}
            fieldKey={[fieldKey, 'link']}
            rules={[{ required: true, message: 'Please enter a link' }]}
          >
            <Input placeholder="Enter a link" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          icon={<PlusOutlined />}
        >
          Add Link
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>

          <Form.Item>
            <button htmlType="submit" className="w-full bg-orange-500 py-1 rounded-md text-white hover:bg-orange-600">
              Submit
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerEod;

