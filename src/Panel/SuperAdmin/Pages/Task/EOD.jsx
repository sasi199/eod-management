import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Tabs, Badge, Tag, Modal, Button, Form, Input, Select, DatePicker, message, Avatar, Tooltip } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaUser, FaCalendarAlt, FaExclamationTriangle, FaTag, FaClock, FaCheckCircle, FaCircleNotch, FaClipboardList, FaSpinner, FaRegCheckCircle } from 'react-icons/fa';
import { AllStaffs, CreateTask, EditTaskById, GetStaffFilter, GetTaskByProjectId } from '../../../../services';
import moment from "moment";
import { useSelector } from 'react-redux';
import { store } from '../../../../Redux/Store';
import TextArea from 'antd/es/input/TextArea';

const { TabPane } = Tabs;


const EOD = () => {

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
  const [isEditing, setIsEditing] = useState({});
  const [formValues, setFormValues] = useState({...selectedTask});
  const [form] = Form.useForm();
  const projectId = useSelector((state) => state.trainer.projectId);

  // const formatDate = (isoDate) =>{
  //   const date = new Date(isoDate);
  //   return date.toLocaleDateString('en-GB');
  // }

  function formatToReadableDateTime(isoDateString) {
    const date = new Date(isoDateString);
  
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    return `${formattedDate} ${formattedTime}`;
  }
  
  const showModal = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
    setIsEditing({})
  };

  const showCreateTaskModal = () => {
    setTaskModalVisible(true);
  }

  const createTaskModalClose = () => {
    setTaskModalVisible(false);
  }

  const toggleEdit = (field) =>{
    console.log("edit",field)
    setIsEditing({...isEditing, [field]:!isEditing[field]});
  };

  const handleFieldChange = (field, value) => {
    console.log("fields", field,value)
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
          {/* {console.log("yyrgrfry",record)} */}
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
          <img
            src={record?.assignees[0]?.profilePic}
            alt={record?.assignees[0]?.fullName.charAt(0).toUpperCase()}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span>{record?.assignees[0]?.fullName}</span>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => <span className="text-gray-500">{moment(date).format("DD-MM-YYYY")}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const color =
          priority === 'high'
            ? 'red'
            : priority === 'medium'
            ? 'orange'
            : priority === 'normal'
            ?'green'
            :'blue';
        return <Tag color={color} style={{width:60, display:'flex', alignItems:'center', justifyContent:'center'}}>{priority}</Tag>;
      },
    },
    {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  render: (status) => {
    // console.log("sttttt", status); // Logs the correct value

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
      const taskData = {
        ...values,
        projectId:projectId
      }
      const response = await CreateTask(taskData);
      console.log("res",response)
      if(response.data.status){
        createTaskModalClose();
        message.success("Task added successfully");
        fetchTasksOfProject(projectId);
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
    // console.log("fetch taskssss",response)
    if(response.data.status){
      // console.log("fetch taskssss",response)
      setListData(response.data.data)
      const tasks = response.data.data;

      // Transform the response into boardData format
      const transformedData = {
        'To Do': tasks.filter((task) => task.status === 'todo'),
        'In Progress': tasks.filter((task) => task.status === 'in progress'),
        'Completed': tasks.filter((task) => task.status === 'completed'),
      };

      // Update the boardData state
      setBoardData(transformedData);
      // message.success("fetch task");

    }
  } catch (error) {
    console.log("error in tasks", error)
  }
}

useEffect(()=>{
  console.log("board",boardData)
},[boardData])

useEffect(() => {
  if (projectId) {
    fetchTasksOfProject(projectId);
  } else {
    console.log("projectId is undefined or null.");
  }
}, [projectId]);


useEffect(()=>{
  if(selectedTask){
    setFormValues(selectedTask)
  }
},[selectedTask])

useEffect(()=>{
console.log("task fffff",formValues)
},[formValues])

//update
const handleUpdate = async() => {
  console.log("trigger update")
  try {
    const response = await EditTaskById(formValues,formValues._id);
    if(response.data.status){
      console.log("fetch update", response);
      handleModalClose();
      message.success("Task updated successfully");
      fetchTasksOfProject(projectId);
      setIsEditing({});
    }
  } catch (error) {
    // message.error(error?.response?.data?.message);
    console.error("error iin update",error)
  }
}

  return (
    <div className="p-6 relative">
       <div className='group inline-block  right-4 absolute z-10'>
     {/* <button onClick={()=>setTaskModalVisible(true)} className='bg-orange-500 rounded-lg px-3 py-2 group-hover:bg-white group-hover:border group-hover:border-orange-500 transition-all transform duration-300 ease-in-out'>
     <span className='text-white font-bold group-hover:text-orange-500 transition-all transform duration-300 ease-in-out pb-2'> Create Task</span>
      </button> */}
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
    <Row gutter={[16, 16]} >
      {Object.keys(boardData).map((status) => (
        <Col span={8} key={status}>
          <Card
            title={status}
            className="rounded-lg shadow border"
            headStyle={{
              backgroundColor: status === 'To Do' 
              ? '#d8b4fe' // Purple
              : status === 'In Progress' 
              ? '#fed7aa' // Orange
              : '#c6f6d5', // Green for Complete,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            <Droppable droppableId={status} >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="max-h-[430px] min-h-[150px] overflow-y-auto"
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
                          <h4 className="font-semibold text-gray-800">{task.title}</h4>
                          <div className="mt-1 flex">
                           <p>Priority : </p>{" "}
                            <Tag
                              color={
                                task.priority === 'high'
                                  ? 'red'
                                  : task.priority === 'medium'
                                  ? 'orange'
                                  :task.priority === 'normal'
                                  ? 'green'
                                  :'blue'
                              }
                              style={{width:60, display:'flex', alignItems:'center', justifyContent:'center', marginLeft:5}}
                            >
                             {task.priority}
                            </Tag>
                          </div>
                          <div className="flex items-center mt-2">
                            <img
                              src={task?.assignees[0]?.profilePic}
                              alt={task?.assignees[0]?.fullName}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-600">{task?.assignees[0]?.fullName}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Due: {moment(task.dueDate).format("DD-MM-YYYY")}
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
      {/* <Modal
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
              {/* <Select
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
  showSearch
  placeholder="Search and select assignees"
  value={task.assignees}
  onChange={(value) => handleSelectChange(value, "assignees")}
  options={handleAssigneeOptions()}
  filterOption={(input, option) => {
    const fullName = option.label.props.children?.props?.children[1]?.props?.children;
    return fullName?.toLowerCase().includes(input.toLowerCase());
  }}
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
        </Form> */}
      {/* </Modal> */} 

      {/* Modal */}  {/* Task Details */}
      <Modal
        title="Task Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="50%"
        centered
        className='relative'
      >
    {selectedTask && (
 <div className="flex justify-between gap-6 p-6">
 {/* Task Details Section */}
 <div className="bg-white p-6 space-y-6 max-w-4xl w-[65%] rounded-lg shadow-md">
   {/* Task Header */}
   <div className="flex justify-between items-center pb-4 border-b">
    {/* Edit title */}
    {/* {isEditing.title ? (
      <Input
      value={formValues.title}
      onChange={(e)=> handleFieldChange("title", e.target.value)}
      onBlur={()=> toggleEdit("title")}
      className="font-bold text-2xl text-gray-800"
      />
    ):( */}
      <h2 onClick={()=> toggleEdit("title")} className="text-2xl font-bold text-gray-800 cursor-pointer">{formValues.title}</h2>

    {/* )

    } */}

    {/* Editing status */}
    {/* {isEditing.status ? (
         <Select
         placeholder="Select status"
         value={formValues.status}
         onChange={(value)=> handleFieldChange("status", value)}
         onBlur={() => toggleEdit("status")}
         options={handleStatsusOptions()}
         />
    ):( */}
      <span
      onClick={()=> toggleEdit("status")}
      className={`font-bold px-4 py-2 cursor-pointer rounded-full text-white ${
        formValues.status === 'todo'
          ? 'bg-purple-600'
          : formValues.status === 'in progress'
          ? 'bg-orange-400'
          : 'bg-green-500'
      }`}
    >
      {formValues?.status ? formValues.status?.toUpperCase() : 'UNKNOWN'}
    </span>
    {/* )

    } */}
   
   </div>

 
   <div className="space-y-4">
     {/*Editable Assignee */}
     <div className="flex items-center">
       <FaUser className="mr-2 text-gray-500" />
       <span className="font-semibold text-lg text-gray-700">Assignee:</span>
       {/* {isEditing.assignees ? (
          <Select
          placeholder="Select assignees"
          value={formValues.assignees[0].fullName}
          onChange={(value)=> handleFieldChange("assignees",[
            {_id:value._id, 
              fullName:value.fullName
              }
          ])}
          onBlur={()=> toggleEdit("assignees")}
          options={handleAssigneeOptions()}
          />
       ):( */}
        <Tooltip
        title={selectedTask?.assignees[0]?.fullName}
        placement="bottom"
        arrowPointAtCenter
        overlayInnerStyle={{
          backgroundColor: '#FFE0B2',
          color: '#333',
          borderRadius: '8px',
          fontSize: '14px',
          padding: '8px 12px',
        }}
      >
        <img
          src={selectedTask?.assignees[0]?.profilePic}
          alt={selectedTask?.assignees[0]?.fullName.charAt(0).toUpperCase()}
          className="w-10 h-10 rounded-full mx-2 shadow-md cursor-pointer"
          onClick={()=> toggleEdit("assignees")}
        />
      </Tooltip>

       {/* )

       } */}
      
     </div>

     {/*Editable Due Date */}
     <div className="flex items-center">
       <FaCalendarAlt className="mr-2 text-gray-500" />
       <span className="font-semibold text-lg text-gray-700 mr-2">Due Date:</span>
     
       {/* {isEditing.dueDate ? (
        <DatePicker
  style={{ width: "100%" }}
  value={formValues.dueDate ? moment(formValues.dueDate, "DD-MM-YYYY") : null} // Ensure proper moment parsing
  onChange={(date) => {
    console.log("Selected date:", date); // Debugging
    if (date) {
      handleFieldChange("dueDate",date);
    }
  }}// Pass the formatted value to handleFieldChange
  onBlur={() => toggleEdit("dueDate")}
  disabledDate={(current) => current && current < moment().startOf("day")}
  format="DD-MM-YYYY"
  showTime={false}
/>
) : ( */}

  <span 
    onClick={() => toggleEdit("dueDate")} 
    className="text-lg text-gray-800 cursor-pointer"
  >
    {formValues.dueDate ? moment(formValues.dueDate).format("DD-MM-YYYY") : ""}
  </span>
{/* )} */}

     </div>

     {/* Priority */}
     <div className="flex items-center">
       <FaExclamationTriangle className="mr-2 text-gray-500" />
       <span className="font-semibold text-lg text-gray-700 mr-2">Priority:</span>
       <span
         className={`font-bold text-lg ${
           selectedTask.priority === 'high'
             ? 'text-red-500'
             : selectedTask.priority === 'medium'
             ? 'text-orange-500'
             : selectedTask.priority === 'normal'
             ? 'text-green-500'
             : 'text-blue-500'
         }`}
       >
         {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
       </span>
     </div>
   </div>

   {/*Editable Task Description */}
   <div className="mt-6">
     <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-2">
       Description
     </label>
     {/* {isEditing.description? (
       <TextArea
       title="Description"
       value={formValues?.description}
       onChange={(e)=> handleFieldChange("description", e.target.value)}
       onBlur={() => toggleEdit("description")}
       className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
     />
     ):( */}
      <p
      className="text-gray-700 cursor-pointer"
      onClick={() => toggleEdit("description")}
    >
      {formValues.description}
    </p>
     {/* )

     } */}

   </div>
 </div>


 {/* Activity Section */}
 <div className="bg-gray-50 w-[35%] rounded-lg p-6 shadow-md overflow-y-auto">
   <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Activity</h3>
   <ul className="space-y-4">
     {selectedTask.activities.map((activity, index) => (
       <li
         key={index}
         className="flex flex-col bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
       >
         <div className="text-gray-800 font-medium">{activity.activity}</div>
         <span className="text-gray-500 text-sm mt-1">
           {formatToReadableDateTime(activity.date)}
         </span>
       </li>
     ))}
   </ul>
        {/* Update button */}

 </div>
 
</div>


)}
<div className='absolute right-6 bottom-2'>
 {/* {Object.values(isEditing).some((edit)=> edit) &&( */}
  
  {/* <Button type="primary" onClick={() => {
    console.log("Save button clicked");
    handleUpdate();
  }}>
    Save
  </Button> */}
 {/* ) */}

 {/* } */}
 {/* {console.log("isEditing state: ", isEditing)} */}
 
 </div>
      </Modal>
    </div>
  );
};

export default EOD;
