import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Tabs, Badge, Tag, Modal, Button, Form, Input, Select, DatePicker, message, Avatar } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaUser, FaCalendarAlt, FaExclamationTriangle, FaTag, FaClock, FaCheckCircle, FaCircleNotch, FaClipboardList, FaSpinner, FaRegCheckCircle } from 'react-icons/fa';
import { AllStaffs, CreateTask, GetStaffFilter, GetTaskByProjectId } from '../../../../services';
import moment from "moment";
import { useSelector } from 'react-redux';
import { store } from '../../../../Redux/Store';

const { TabPane } = Tabs;

const ProjectTask = () => {
  // State for List View
  // const [listData, setListData] = useState([
  //   {
  //     key: 1,
  //     task: 'Trainee, hr, coordinator panel UI building',
  //     assignee: 'John Doe',
  //     assigneeImage: 'https://www.example.com/john.jpg',
  //     dueDate: '2024-11-30',
  //     priority: 'High',
  //     status: 'To Do',
  //     subtasks: [
  //       { name: 'Design UI mockup', assignee: 'John Doe', status: 'To Do' },
  //       { name: 'Develop UI components', assignee: 'Alice Smith', status: 'In Progress' },
  //     ],
  //   },
  //   {
  //     key: 2,
  //     task: 'Super admin panel trainee and employee integration and UI building.',
  //     assignee: 'Alice Smith',
  //     assigneeImage: 'https://www.example.com/alice.jpg',
  //     dueDate: '2024-12-01',
  //     priority: 'Medium',
  //     status: 'In Progress',
  //     subtasks: [
  //       { name: 'Set up API endpoints', assignee: 'Bob Johnson', status: 'Done' },
  //       { name: 'Create admin dashboard', assignee: 'Alice Smith', status: 'In Progress' },
  //     ],
  //   },
  //   {
  //     key: 3,
  //     task: 'Task 3',
  //     assignee: 'Bob Johnson',
  //     assigneeImage: 'https://www.example.com/bob.jpg',
  //     dueDate: '2024-11-25',
  //     priority: 'Low',
  //     status: 'Done',
  //     subtasks: [
  //       { name: 'Write documentation', assignee: 'John Doe', status: 'Done' },
  //     ],
  //   },
  // ]);

  // Drag-and-drop handling
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;

    const taskIndex = result.source.index;
    const task = listData.find(
      (item) => item.task === boardData[sourceStatus][taskIndex]
    );

    // Remove task from source and add to destination
    boardData[sourceStatus].splice(taskIndex, 1);
    boardData[destStatus].splice(result.destination.index, 0, task.task);

    // Update task status
    task.status = destStatus;
    setListData([...listData]);
  };

  const [boardData, setBoardData] = useState({
    'To Do': [
      {
        task: 'Trainee, hr, coordinator panel UI building',
        assignee: 'John Doe',
        assigneeImage: '/path/to/image.jpg',
        dueDate: '2024-11-30',
        priority: 'High',
      },
    ],
    'In Progress': [
      {
        task: 'Super admin panel trainee and employee integration and UI building.',
        assignee: 'Jane Smith',
        assigneeImage: '/path/to/image2.jpg',
        dueDate: '2024-11-25',
        priority: 'Medium',
      },
    ],
    Done: [
      {
        task: 'Task 3',
        assignee: 'Emily Clark',
        assigneeImage: '/path/to/image3.jpg',
        dueDate: '2024-11-20',
        priority: 'Low',
      },
    ],
  });
  
//task
const taskInitialValues = {
  title: "",
  description: "",
  status: "",
  assignees: null,
  dueDate: null,
  priority: "",
  projectId:""
}

const [task, setTask] = useState(taskInitialValues);


  // State for Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectAssignee, setSelectAssignee] = useState([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [form] = Form.useForm();
  const projectId = useSelector((state) => state.trainer.projectId);
  
  const showModal = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const showCreateTaskModal = () => {
    setTaskModalVisible(true);
  }

  const createTaskModalClose = () => {
    setTaskModalVisible(false);
  }

  // Columns for the List View
  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text, record) => (
        <span
          className="font-medium text-gray-700 hover:text-purple-600 cursor-pointer"
          onClick={() => showModal(record)}
        >
          {console.log("yyrgrfry",record)}
          {record.title}
        </span>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text, record) => (
        <div className="flex items-center">
          {/* <img
            src={record.assigneeImage}
            alt={record.assignee}
            className="w-8 h-8 rounded-full mr-3"
          /> */}
          <span>{record.assignees}</span>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => <span className="text-gray-500">{date}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const color =
          priority === 'High'
            ? 'red'
            : priority === 'Medium'
            ? 'orange'
            : 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status) => {
    //     // const colors = {
    //     //   'To Do': 'blue',
    //     //   'In Progress': 'orange',
    //     //   Done: 'green',
    //     // };
    //     {console.log("sttttt",status)}
    //     return  <div> <p>{ status}</p></div>;
    //   },
    // },
    {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  render: (status) => {
    console.log("sttttt", status); // Logs the correct value

    // Convert the first character to uppercase and keep the rest lowercase
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    // Define colors for each status
    const colors = {
      todo: 'purple',
      'in progress': 'orange',
      completed: 'green',
    };

    const color = colors[status.toLowerCase()] || 'gray'; // Fallback to gray if no match

    return (
      <div>
        <p style={{ color }}>{formattedStatus}</p>
      </div>
    );
  },
}

  ];

 

  const fetchAllAssignee = async() => {
    try {
      const response = await GetStaffFilter();
      // console.log("response assignee",response)
      if(response.data.status){
        setSelectAssignee(response?.data?.data)
      }
    } catch (error) {
      console.error("fetch assign",error)
    }
  }

  useEffect(()=>{
  fetchAllAssignee();
  },[]);

  const handleAssigneeOptions = () => {
    return  selectAssignee.map((assignee)=>({
       
                label:(
                  <div style={{display:"flex"}}>
                    {assignee.profilePic?(
                      <>
                       <Avatar src={assignee.profilePic} style={{ marginRight: 8 }} /><span>{assignee.fullName}</span>
                       </>   ):(
                        <>
                      <div style={{width:"30px", height:"30px", borderRadius:"100%", backgroundColor:"#ffA500", display:"flex", alignItems:"center", justifyContent:"center", color:"#FFFFFF"}} >{assignee.fullName.charAt(0).toUpperCase()}</div><div style={{display:"flex", justifyContent:"center", alignItems:"center", paddingLeft:"5px"}}><span>{assignee.fullName}</span></div>
                      </>  )

                    }
                  </div>
                ),value:assignee._id}
              ))
  }


  const handleStatsusOptions = () => {
    return [
      {label:(
        <div style={{ display: "flex", alignItems: "center" }}>
        <FaClipboardList style={{ marginRight: 8, color: "purple" }} />
        <span style={{ color: "purple" }}>To-Do</span>
      </div>
      ), value:"todo"},
      {label:(
        <div style={{ display: "flex", alignItems: "center" }}>
        <FaSpinner style={{ marginRight: 8, color: "orange" }} />
        <span  style={{color: "orange" }}>In-Progress</span>
      </div>
      ), value:"in progress"},
      {label:(
        <div style={{ display: "flex", alignItems: "center" }}>
        <FaRegCheckCircle style={{ marginRight: 8, color: "green" }} />
        <span style={{ color: "green" }} >Completed</span>
      </div>
      ), value:"completed"},
    ]
  }

const handlePriorityOptions = () => {
  return [ {label:(
    <span style={{ color: "red" }}>
      High
    </span>
  ), value:"high"},
  {label:(
    <span style={{ color: "orange" }}>
      Medium
    </span>
  ), value:"medium"},
  {label:(
    <span style={{ color: "green",  }}>
      Normal
    </span>
  ), value:"normal"},
  {label: (
    <span style={{ color: "blue", }}>
      Low
    </span>
  ), value:"low"}
  ]
}




  const handleTaskChange = (e) => {
    const {name, value} = e.target;
    setTask((prevTask)=>({
      ...prevTask,
      [name]:value
    }));
  }

  const handleSelectChange = (value, key) => {
    setTask((prevTask)=>({
      ...prevTask,
      [key]:value
    }))
  }

  //create task

  const handleSubmit = async(values) => {
    try {
      console.log("redux project",projectId)
      const taskData = {
        ...values,
        projectId:projectId
      }
      const response = await CreateTask(taskData);
      console.log("res",response)
      if(response.data.status){
        createTaskModalClose();
        message.success("Task added successfully");
        form.resetFields();
      }
    } catch (error) {
     message.error(error?.response?.data?.message);
    }
  }

//list task by projectId

const fetchTasksOfProject = async(projectId) => {
  console.log("projectIdddd",projectId)
  try {
    const response = await GetTaskByProjectId(projectId);
    console.log("fetch taskssss",response)
    if(response.data.status){
      // console.log("fetch taskssss",response)
      setListData(response.data.data)
      message.success("fetch task");
    }
  } catch (error) {
    console.log("error in tasks", error)
  }
}

useEffect(() => {
  if (projectId) {
    fetchTasksOfProject(projectId);
  } else {
    console.log("projectId is undefined or null.");
  }
}, [projectId]);


  return (
    <div className="p-6 relative">
       <div className='group inline-block  right-4 absolute z-10'>
     <button onClick={()=>setTaskModalVisible(true)} className='bg-orange-500 rounded-lg px-3 py-2 group-hover:bg-white group-hover:border group-hover:border-orange-500 transition-all transform duration-300 ease-in-out'>
     <span className='text-white font-bold group-hover:text-orange-500 transition-all transform duration-300 ease-in-out pb-2'> Create Task</span>
      </button>
     </div>
      <Tabs defaultActiveKey="1" className="text-gray-800">
        {/* List View */}
        <TabPane tab="List View" key="1">
          <Table
            dataSource={listData}
            columns={columns}
            pagination={false}
            className="border rounded-lg shadow"
          />
        </TabPane>

        {/* Board View */}
        <TabPane tab="Board View" key="2">
  <DragDropContext onDragEnd={handleDragEnd}>
    <Row gutter={[16, 16]}>
      {Object.keys(boardData).map((status) => (
        <Col span={8} key={status}>
          <Card
            title={status}
            className="rounded-lg shadow border"
            headStyle={{
              backgroundColor: '#f0f5ff',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[100px]"
                >
                  {boardData[status].map((task, index) => (
                    <Draggable
                      key={task.task}
                      draggableId={task.task}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded-lg shadow mb-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => showModal(task)}
                        >
                          <h4 className="font-semibold text-gray-800">{task.task}</h4>
                          <div className="mt-1 flex">
                           <p>Priority : </p>{" "}
                            <Tag
                              color={
                                task.priority === 'High'
                                  ? 'red'
                                  : task.priority === 'Medium'
                                  ? 'orange'
                                  : 'green'
                              }
                            >
                             {task.priority}
                            </Tag>
                          </div>
                          <div className="flex items-center mt-2">
                            <img
                              src={task.assigneeImage}
                              alt={task.assignee}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-600">{task.assignee}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Due: {task.dueDate}
                          </div>
                         
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
        </Col>
      ))}
    </Row>
  </DragDropContext>
</TabPane>

      </Tabs>

      {/* create task modal */}
      <Modal
      title="Create Task"
      open={taskModalVisible}
      onCancel={createTaskModalClose}
      footer={null}
      centered
      >
        <Form layout='vertical' form={form} onFinish={handleSubmit}>
            <Form.Item
            label="Task title"
            name="title"
            rules={[{required:true, message:"Please enter task title"}]}
            >
              <Input
              type="text"
              placeholder='Enter task title'
              value={task.title}
              name='title'
              onChange={handleTaskChange}
              />
            </Form.Item>
             <Form.Item
            label="Task Status"
            name="status"
            rules={[{required:true, message:"Please enter task status"}]}
            >
              {/* <Input
              type="text"
              placeholder='Enter task status'
              value={task.status}
              name='status'
              onChange={handleTaskChange}
              /> */}
              <Select
              placeholder="Select status"
              value={task.status}
              onChange={(value)=> handleSelectChange(value, "status")}
              options={handleStatsusOptions()}
              />
            </Form.Item>
            <Form.Item
            label='Assignees'
            name='assignees'
            rules={[{required:true, message:"Please select assignee"}]}
            >
            <Select
            placeholder="Select assignees"
            value={task.assignees}
            onChange={(value)=> handleSelectChange(value, "assignees")}
            options={handleAssigneeOptions()}
            />
            </Form.Item>
            <Form.Item
            label='DueDate'
            name='dueDate'
            rules={[{required:true, message:"Please enter dueDate"}]}
            >
            <DatePicker
            style={{width: "100%"}}
            value={task.dueDate ? moment(task.dueDate, "DD-MM-YYYY"):null}
            onChange={(date) => handleSelectChange(date ? date.format("DD-MM-YYYY") : null, "dueDate")}
            disabledDate={(current)=> current && current < moment().startOf("day")}
           format= "DD-MM-YYYY"
            showTime={false}
            ranges={{
              Today:[moment(), moment()],
              Tomorrow: [moment().add(1,"days"), moment().add(1,"days")],
              "This Weekwnd":[
                moment().day(6).startOf("day"),
                moment().day(6).endOf("day")
              ]
            }}
            />
            </Form.Item>
            <Form.Item
            label='Priority'
            name='priority'
            rules={[{required:true, message:"Please enter priority"}]}
            >
            <Select
            placeholder="Select priority"
            options={handlePriorityOptions()}
            onChange={(value)=> handleSelectChange(value,"priority")}
            />
            </Form.Item>
            <Form.Item
            label='Description'
            name='description'
            >
              <Input.TextArea
              placeholder='Enter task description'
              value={task.description}
              name='description'
              onChange={handleTaskChange}
              />
            </Form.Item>
            <Form.Item>
  <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
    Create Task
  </Button>
</Form.Item>
        </Form>
      </Modal>

      {/* Modal */}
      <Modal
        title="Task Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="50%"
        centered
      >
    {selectedTask && (
  <div className="bg-white p-6 space-y-6 max-w-4xl mx-auto">
    {/* Task Header */}
    <div className="flex justify-between items-center pb-4">
      <h2 className="text-3xl font-bold text-gray-800">{selectedTask.task}</h2>
      <span
        className={`font-bold px-4 py-2 rounded-full text-white ${
          selectedTask.status === 'To Do'
            ? 'bg-blue-600'
            : selectedTask.status === 'In Progress'
            ? 'bg-orange-600'
            : 'bg-green-600'
        }`}
      >
       {selectedTask?.status ? selectedTask.status?.toUpperCase() : 'UNKNOWN'}
      </span>
    </div>

    {/* Task Details */}
    <div className="space-y-4 ">
      <p className="text-lg text-gray-700 flex items-center">
        <FaUser className="mr-2 text-gray-500" />
        <span className="font-semibold">Assignee:</span> {selectedTask.assignee}
      </p>
      <p className="text-lg text-gray-700 flex items-center">
        <FaCalendarAlt className="mr-2 text-gray-500" />
        <span className="font-semibold">Due Date:</span> {selectedTask.dueDate}
      </p>
      <p className="text-lg text-gray-700 flex items-center">
        <FaExclamationTriangle className="mr-2 text-gray-500" />
        <span className="font-semibold">Priority:</span>{' '}
        <span
          className={`font-bold ${
            selectedTask.priority === 'High'
              ? 'text-red-600'
              : selectedTask.priority === 'Medium'
              ? 'text-orange-600'
              : 'text-green-600'
          }`}
        >
          {selectedTask.priority}
        </span>
      </p>
      <p className="text-lg text-gray-700 flex items-center">
        <FaTag className="mr-2 text-gray-500" />
        <span className="font-semibold">Tags:</span>{' '}
        <span className="text-purple-600">Design, Development</span>
      </p>
      <p className="text-lg text-gray-700 flex items-center">
        <FaClock className="mr-2 text-gray-500" />
        <span className="font-semibold">Time Estimate:</span> 5 hours
      </p>
    </div>

    {/* Subtasks Section */}
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800">Subtasks</h3>
      <ul className="mt-4 space-y-3">
        {selectedTask?.subtasks?.map((subtask, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-800">{subtask.name}</span>
            <div className="flex items-center space-x-2">
              {subtask.status === 'Done' ? (
                <FaCheckCircle className="text-green-600" />
              ) : (
                <FaCircleNotch className="text-orange-600 animate-spin" />
              )}
              <Tag color={subtask.status === 'Done' ? 'green' : 'orange'}>
                {subtask.status}
              </Tag>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
      </Modal>
    </div>
  );
};

export default ProjectTask;
