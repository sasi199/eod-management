import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, TimePicker, Row, Col, Checkbox, message } from 'antd';
import { AllStaffs, GetBatches, createSchedule } from '../../../../services';
import moment from 'moment';


const Schedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[batch, setBatch] = useState([]);
  const[trainers, setTrainers]=useState([]);

  const [form] = Form.useForm();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

 
  const handleSubmit = async (values) => {
    try {
      // Prepare the data in the required format
      const selectedDays = values.schedule.filter((day) => day.selected);
  
      // Debug: Check the values of startTime and endTime
      console.log("Start Time and End Time:", selectedDays.map((day) => ({
        startTime: day.startTime, 
        endTime: day.endTime,
      })));
  
      const formattedData = {
        batch: values.batch,  // Batch ID
        days: selectedDays.map((day) => daysOfWeek[values.schedule.indexOf(day)]), // Array of selected days
        trainers: selectedDays.map((day) => day.trainer), // Array of selected trainers
        timings: selectedDays.map((day) => ({
          startTime: moment(day.startTime).isValid() ? moment(day.startTime).format("hh:mm A") : "Invalid Start Time", // Format start time as '03:00 PM'
          endTime: moment(day.endTime).isValid() ? moment(day.endTime).format("hh:mm A") : "Invalid End Time", // Format end time as '04:00 PM'
          subject: day.subject, // Subject
        })),
      };
  
      // Debug: Check formattedData before sending
      console.log("Formatted Data to send:", formattedData);
  
      // Now, send the formatted data to the API
      const response = await createSchedule(formattedData);
  
      if (response.status === 200) {
        message.success("Schedule created successfully!");
        form.resetFields(); // Reset form fields
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      message.error("Failed to create schedule. Please try again.");
    }
  };
  
  

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches();
        setBatch(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        message.error("Failed to fetch batches. Please try again.");
      }
    };
    fetchBatches();
  }, []);
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await AllStaffs();
        setTrainers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
        message.error("Failed to fetch trainer. Please try again.");
      }
    };
    fetchTrainer();
  }, []);




  return (
    <div className="p-4">
      <Button
        type="primary"
        onClick={handleOpenModal}
        className="mb-4 bg-purple-500 hover:bg-purple-600 text-white"
      >
        Add Schedule
      </Button>

      <Modal
        title={<span className="text-lg font-semibold">Add Schedule</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Batch Field */}
         
        <Form.Item
  name="batch"
  label="Batch"
  rules={[{ required: true, message: 'Batch is required' }]}
>
  <Select placeholder="Select batch">
    {batch.map((item) => (
      <Select.Option key={item._id} value={item._id}>
        {item.batchName}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

        

          {/* Table Header */}
          <Row gutter={[16, 16]} className="font-medium text-gray-700 border-b pb-2 mb-2">
            <Col span={2} className="text-center">Select</Col>
            <Col span={4}>Day</Col>
            <Col span={6}>Trainer</Col>
            <Col span={6}>Subject</Col>
            <Col span={3} className="text-center">Start Time</Col>
            <Col span={3} className="text-center">End Time</Col>
          </Row>

          {/* Days Schedule */}
          {daysOfWeek.map((day, index) => (
            <Row key={day} gutter={[16, 16]} align="middle" className="mb-2">
              {/* Checkbox */}
              <Col span={2} className="text-center">
                <Form.Item
                  name={['schedule', index, 'selected']}
                  valuePropName="checked"
                  initialValue={false}
                  className="mb-0"
                >
                  <Checkbox />
                </Form.Item>
              </Col>

              {/* Day */}
              <Col span={4} className="font-medium text-gray-800">
                {day}
              </Col>

              {/* Trainer */}
              <Col span={6}>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.schedule?.[index]?.selected !== curValues.schedule?.[index]?.selected
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={['schedule', index, 'trainer']}
                      rules={[{
                        required: getFieldValue(['schedule', index, 'selected']),
                        message: 'Trainer is required',
                      }]}
                      className="mb-0"
                    >
                      <Select
                        placeholder="Select trainer"
                        disabled={!getFieldValue(['schedule', index, 'selected'])}
                      >
                        {trainers.map((trainer) => (
                          <Select.Option key={trainer._id} value={trainer._id}>
                          
                          <div className='flex gap-4'><img src={trainer.profilePic}   alt={trainer.fullName}
            className="w-8 h-8 rounded-full" />  {trainer.fullName}</div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              {/* Subject */}
              <Col span={6}>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.schedule?.[index]?.selected !== curValues.schedule?.[index]?.selected
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={['schedule', index, 'subject']}
                      rules={[{
                        required: getFieldValue(['schedule', index, 'selected']),
                        message: 'Subject is required',
                      }]}
                      className="mb-0"
                    >
                        <Select placeholder="Select a subject">
              {[
                "Html/Css",
                "Javascript",
                "J-Query",
                "React.Js",
                "Node.Js/Mongodb",
                "Python",
                "Figma",
                "PHP",
                "Flutter",
              ].map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              {/* Start Time */}
              <Col span={3}>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.schedule?.[index]?.selected !== curValues.schedule?.[index]?.selected
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={['schedule', index, 'startTime']}
                      rules={[{
                        required: getFieldValue(['schedule', index, 'selected']),
                        message: 'Start time is required',
                      }]}
                      className="mb-0"
                    >
                    <TimePicker
  use12Hours
  format="h:mm A"
  className="w-full"
  value={moment(day.startTime)}  // Make sure you set a valid moment object here
  disabled={!getFieldValue(['schedule', index, 'selected'])}
/>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              {/* End Time */}
              <Col span={3}>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.schedule?.[index]?.selected !== curValues.schedule?.[index]?.selected
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <Form.Item
                      name={['schedule', index, 'endTime']}
                      rules={[{
                        required: getFieldValue(['schedule', index, 'selected']),
                        message: 'End time is required',
                      }]}
                      className="mb-0"
                    >
                    <TimePicker
  use12Hours
  format="h:mm A"
  className="w-full"
  value={moment(day.startTime)}  // Make sure you set a valid moment object here
  disabled={!getFieldValue(['schedule', index, 'selected'])}
/>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            </Row>
          ))}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedule;

