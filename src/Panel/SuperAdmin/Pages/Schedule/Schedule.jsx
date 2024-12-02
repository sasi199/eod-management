// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Input, TimePicker, Select, message } from 'antd';
// import { AllStaffs, GetBatches } from '../../../../services';

// const { Option } = Select;

// const Schedule = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const[staffs,setStaffs]=useState([]);
//   const [form] = Form.useForm();

//   // Mock data for trainers
  

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const handleSubmit = async (values) => {
//     const payload = {
//       batch: values.batch,
//       day: values.day,
//       timeTable: values.timeTable.map((item) => ({
//         trainer: item.trainer,
//         startTime: item.startTime.format('HH:mm'),
//         endTime: item.endTime.format('HH:mm'),
//         subject: item.subject,
//       })),
//     };

//     console.log('Payload:', payload);

//     try {
//       const response = await fetch('http://localhost:8010/v1/schedule', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         message.success('Schedule added successfully!');
//         form.resetFields();
//         handleCloseModal();
//       } else {
//         message.error('Failed to add schedule. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       message.error('Failed to add schedule. Please try again.');
//     }
//   };

//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const response = await GetBatches();
//         setBatches(response.data.data);
//         console.log(response.data.data);
//       } catch (error) {
//         console.error('Error fetching batches:', error.message);
//       }
//     };
//     fetchBatches();
//   }, []);

//   useEffect(() => {
//     const fetchStaffs = async () => {
//       try {
//         const response = await AllStaffs();
//         setStaffs(response.data.data);
//         console.log(response.data.data);
//       } catch (error) {
//         console.error('Error fetching batches:', error.message);
//       }
//     };
//     fetchStaffs();
//   }, []);

//   return (
//     <div className="p-4">
//       <Button type="primary" onClick={handleOpenModal}>
//         Add Schedule
//       </Button>

//       <Modal
//         title="Add Schedule"
//         visible={isModalOpen}
//         onCancel={handleCloseModal}
//         footer={null}
//         centered
//         width={800}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//           initialValues={{
//             timeTable: [{ trainer: '', startTime: null, endTime: null, subject: '' }],
//           }}
//           className="space-y-6"
//         >
//           {/* Select Batch */}
//           <Form.Item
//             label="Batch"
//             name="batch"
//             rules={[{ required: true, message: 'Please select the batch!' }]}
//           >
//             <Select placeholder="Select batch">
//               {batches.map((batch) => (
//                 <Option key={batch._id} value={batch._id}>
//                   {batch.batchName}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Select Day */}
//           <Form.Item
//             label="Day"
//             name="day"
//             rules={[{ required: true, message: 'Please select the day!' }]}
//           >
//             <Select placeholder="Select day">
//               <Option value="Monday">Monday</Option>
//               <Option value="Tuesday">Tuesday</Option>
//               <Option value="Wednesday">Wednesday</Option>
//               <Option value="Thursday">Thursday</Option>
//               <Option value="Friday">Friday</Option>
//               <Option value="Saturday">Saturday</Option>
//               <Option value="Sunday">Sunday</Option>
//             </Select>
//           </Form.Item>

//           {/* Add Subjects, Trainers, Start Time, and End Time */}
//           <Form.List name="timeTable">
//             {(fields, { add, remove }) => (
//               <div className="space-y-4">
//                 {fields.map(({ key, name, fieldKey, ...restField }) => (
//                   <div key={key} className="border px-4 rounded-md">
//                     {/* Grid Layout for Horizontal Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
//                       {/* Subject */}
//                       {/* Subject */}
// <Form.Item
//   {...restField}
//   label="Subject"
//   name={[name, 'subject']}
//   fieldKey={[fieldKey, 'subject']}
//   rules={[{ required: true, message: 'Please select the subject!' }]}
// >
//   <Select placeholder="Select subject">
//     {[
//       'Html/Css',
//       'Javascript',
//       'J-Query',
//       'React.Js',
//       'Node.Js/Mongodb',
//       'Python',
//       'Figma',
//       'PHP',
//       'Flutter',
//     ].map((subject) => (
//       <Option key={subject} value={subject}>
//         {subject}
//       </Option>
//     ))}
//   </Select>
// </Form.Item>


//                       {/* Trainer */}
//                       <Form.Item
//                         {...restField}
//                         label="Trainer"
//                         name={[name, 'trainer']}
//                         fieldKey={[fieldKey, 'trainer']}
//                         rules={[{ required: true, message: 'Please select a trainer!' }]}
//                       >
//                         <Select placeholder="Select trainer">
//                           {staffs.map((trainer) => (
//                             <Option key={trainer._id} value={trainer._id}>
//                               <div className='flex gap-4 items-center'>
//                               <img src={trainer.profilePic} alt=""  className='w-10 h-10 rounded-full object-contain'/> {trainer.fullName}
//                               </div>
//                             </Option>
//                           ))}
//                         </Select>
//                       </Form.Item>

//                       {/* Start Time */}
//                       <Form.Item
//                         {...restField}
//                         label="Start Time"
//                         name={[name, 'startTime']}
//                         fieldKey={[fieldKey, 'startTime']}
//                         rules={[{ required: true, message: 'Please select start time!' }]}
//                       >
//                         <TimePicker className="w-full" />
//                       </Form.Item>

//                       {/* End Time */}
//                       <Form.Item
//                         {...restField}
//                         label="End Time"
//                         name={[name, 'endTime']}
//                         fieldKey={[fieldKey, 'endTime']}
//                         rules={[{ required: true, message: 'Please select end time!' }]}
//                       >
//                         <TimePicker className="w-full" />
//                       </Form.Item>
//                     </div>

//                     {/* Remove Time Slot Button */}
//                     <Button
//                       danger
//                       type="link"
//                       onClick={() => remove(name)}
//                       className=""
//                     >
//                       Remove Time Slot
//                     </Button>
//                   </div>
//                 ))}

//                 {/* Add Another Subject Button */}
//                 <Button type="dashed" onClick={() => add()} className="w-full">
//                   + Add Another Subject
//                 </Button>
//               </div>
//             )}
//           </Form.List>

//           {/* Submit Button */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit" className="w-full">
//               Submit Schedule
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Schedule;

import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, TimePicker, Select, DatePicker, message, Table } from 'antd';
import { AllStaffs, GetBatches, getSchedule, createSchedule } from '../../../../services';

const { Option } = Select;

const Schedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [scheduleData, setScheduleData] = useState([]); // State to store fetched schedule data
  const [form] = Form.useForm();

  // Open and close modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    if (!values.batch || !values.date || !values.timeTable) {
      message.error('Please ensure all required fields are filled!');
      return;
    }

    const payload = {
      batch: values.batch,
      date: values.date.format('YYYY-MM-DD'),
      timeTable: values.timeTable.map((item) => ({
        trainer: item.trainer,
        startTime: item.startTime.format('HH:mm'),
        endTime: item.endTime.format('HH:mm'),
        subject: item.subject,
      })),
    };

    console.log('Payload:', payload);

    try {
      const response = await createSchedule(payload);

      if (response.status === 200) {
        message.success('Schedule added successfully!');
        form.resetFields();
        handleCloseModal();
        fetchSchedule(); // Refetch schedule data after successfully adding
      } else {
        message.error('Failed to add schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add schedule. Please try again.');
    }
  };

  // Fetch batches, staffs, and schedules on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches();
        setBatches(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching batches:', error.message);
      }
    };

    const fetchStaffs = async () => {
      try {
        const response = await AllStaffs();
        setStaffs(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching staffs:', error.message);
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await getSchedule(); // Fetch schedule data
        setScheduleData(response.data); // Set schedule data to state
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error.message);
      }
    };

    fetchBatches();
    fetchStaffs();
    fetchSchedule(); // Call the function to fetch schedule data
  }, []);

  // Define columns for the timetable
  const columns = [
    {
      title: 'Batch',
      dataIndex: 'batchName',
      key: 'batchName',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Batch Timings',
      dataIndex: 'batchTimings',
      key: 'batchTimings',
    },
    {
      title: 'Trainer',
      dataIndex: 'trainer',
      key: 'trainer',
      render: (trainerId) => {
        const trainer = staffs.find((staff) => staff._id === trainerId);
        return trainer ? (
          <div className="flex items-center">
            <img src={trainer.profilePic} alt={trainer.fullName} className="w-10 h-10 rounded-full object-cover mr-2" />
            {trainer.fullName}
          </div>
        ) : 'N/A';
      },
    },
    {
      title: 'Trainees',
      dataIndex: 'trainees',
      key: 'trainees',
      render: (traineeList) => (
        <div>
          {traineeList.map((trainee) => (
            <div key={trainee._id} className="flex items-center">
              <img
                src={trainee.profilePic}
                alt={trainee.fullName}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              {trainee.fullName}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="link">View More</Button>,
    },
  ];

  // Prepare the schedule data for the table
  const timetableData = scheduleData.map((schedule) => ({
    key: schedule._id,
    batchName: schedule.batchName,
    courseName: schedule.courseName,
    batchTimings: schedule.batchTimings,
    trainer: schedule.trainerDetails[0]?._id, // Assuming each batch has only one trainer
    trainees: schedule.traineeDetails, // List of trainees
    date: schedule.date,
  }));

  return (
    <div className="p-4">
      <Button type="primary" onClick={handleOpenModal}>
        Add Schedule
      </Button>

      <Modal
        title="Add Schedule"
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            timeTable: [{ trainer: '', startTime: null, endTime: null, subject: '' }],
          }}
          className="space-y-6"
        >
          {/* Select Batch */}
          <Form.Item
            label="Batch"
            name="batch"
            rules={[{ required: true, message: 'Please select the batch!' }]}
          >
            <Select placeholder="Select batch">
              {batches.map((batch) => (
                <Option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Select Date */}
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          {/* Add Subjects, Trainers, Start Time, and End Time */}
          <Form.List name="timeTable">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className="border px-4 rounded-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
                      {/* Subject */}
                      <Form.Item
                        {...restField}
                        label="Subject"
                        name={[name, 'subject']}
                        fieldKey={[fieldKey, 'subject']}
                        rules={[{ required: true, message: 'Please select the subject!' }]}
                      >
                        <Select placeholder="Select subject">
                          {['Html/Css', 'Javascript', 'J-Query', 'React.Js', 'Node.Js/Mongodb', 'Python', 'Figma', 'PHP', 'Flutter'].map((subject) => (
                            <Option key={subject} value={subject}>
                              {subject}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {/* Trainer */}
                      <Form.Item
                        {...restField}
                        label="Trainer"
                        name={[name, 'trainer']}
                        fieldKey={[fieldKey, 'trainer']}
                        rules={[{ required: true, message: 'Please select a trainer!' }]}
                      >
                        <Select placeholder="Select trainer">
                          {staffs.map((trainer) => (
                            <Option key={trainer._id} value={trainer._id}>
                              <div className="flex gap-4 items-center">
                                <img
                                  src={trainer.profilePic}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-contain"
                                />
                                {trainer.fullName}
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {/* Start Time */}
                      <Form.Item
                        {...restField}
                        label="Start Time"
                        name={[name, 'startTime']}
                        fieldKey={[fieldKey, 'startTime']}
                        rules={[{ required: true, message: 'Please select start time!' }]}
                      >
                        <TimePicker className="w-full" format="HH:mm" />
                      </Form.Item>

                      {/* End Time */}
                      <Form.Item
                        {...restField}
                        label="End Time"
                        name={[name, 'endTime']}
                        fieldKey={[fieldKey, 'endTime']}
                        rules={[{ required: true, message: 'Please select end time!' }]}
                      >
                        <TimePicker className="w-full" format="HH:mm" />
                      </Form.Item>
                    </div>

                    <Button
                      type="dashed"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add timetable entry
                </Button>
              </div>
            )}
          </Form.List>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Schedule
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Timetable */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Timetable</h2>
        <Table
          dataSource={timetableData}
          columns={columns}
          rowKey="key"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Schedule;

