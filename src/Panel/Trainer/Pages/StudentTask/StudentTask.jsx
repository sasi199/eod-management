import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Select,
  DatePicker,
  message,
  Tooltip,
  Row,
  Col,
  Divider,
  Typography,
  Tag,
  Card,
  Avatar,
  Badge
} from "antd";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import moment from "moment";
import { FaBook, FaClipboardList, FaSpinner, FaUser } from "react-icons/fa6";
import { createStudentTask, GetAllStudentTask, GetBatches, GetStudentTaskById, UpdateStudentTaskById } from "../../../../services";
import { split } from "postcss/lib/list";
const { Title, Text } = Typography;

const StudentTask = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Math Assignment",
      batchId: "Batch A",
      student: "John Doe",
      dueDate: "2024-12-01",
      priority: "Pending",
      description: "Solve all algebra questions.",
    },
    {
      id: 2,
      title: "Science Project",
      batchId: "Batch B",
      student: "Jane Smith",
      dueDate: "2024-12-05",
      priority: "Completed",
      description: "Create a volcano model.",
    },
  ]);
  const initialTaskState = {
    title: "",
    batchId: "",
    trainerId:"774095d5-5de9-428f-b457-b8c7a2558fcb",
    dueDate: "",
    priority: "",
    description: "",
  };


  const [taskData, setTaskData] = useState(initialTaskState);
  const [selectedTaskData, setSelectedTaskData] = useState([]);
  const [createTaskModalVisible, setCreateTaskModalVisible] = useState(false);
  const [listTaskModalVisible, setListTaskModalVisible] = useState(false);
  const [updateTaskModalVisible, setUpdateTaskModalVisible] = useState(false);
  const [listTaskData, setListTaskData] = useState([]);
  const [listTaskDataById, setListTaskDataById] = useState([]);
  const [updateTaskData, setUpdateTaskData] = useState([]);
  const [modals, setModals] = useState({
    create: false,
    view: false,
    update: false,
    delete: false,
  });
  const [selectedTask, setSelectedTask] = useState(initialTaskState);
  const [batches, setBatches] = useState([]);
  const [form] = Form.useForm();


  const handleOnChange = (name, value) => {
    // const {key, value} = e.target
    setTaskData((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  const handleModalToggle = (modalType, task = null) => {
    setSelectedTask(task || initialTaskState);
    setModals({ ...modals, [modalType]: !modals[modalType] });
  };

  const handleCreateTask = (values) => {
    const newTask = { ...values, id: tasks.length + 1 };
    setTasks([...tasks, newTask]);
    message.success("Task created successfully!");
    handleModalToggle("create");
  };

  const handleUpdateTask = (values) => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, ...values } : task
    );
    setTasks(updatedTasks);
    message.success("Task updated successfully!");
    handleModalToggle("update");
  };

  const handleDeleteTask = () => {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks(filteredTasks);
    message.success("Task deleted successfully!");
    handleModalToggle("delete");
  };


  const handleListTask = (tasks) => {
    setListTaskModalVisible(true)
    setSelectedTaskData(tasks);
  }

  const handleListTaskCancel = (tasks) => {
    setListTaskModalVisible(false)
    setSelectedTaskData([]);
  }

  const handleUpdateTaskModal = (tasks) => {
    setUpdateTaskModalVisible(true);
    setSelectedTaskData(tasks);
  }

  const handleUpdateTaskModalCancel = (tasks) => {
    setUpdateTaskModalVisible(false);
    setSelectedTaskData([]);
  }

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      center: true,
    },
    {
      name: "Task Title",
      selector: (row) => row.title,
      sortable: true,
      center: true,
    },
    {
      name: "Batch",
      selector: (row) => row.batchDetails[0].batchName,
      sortable: true,
      center: true,
    },
    {
      name: "DueDate",
      selector: (row) =>  moment(row.dueDate).utcOffset("+05:30").format("DD-MM-YYYY"),
      sortable: true,
      center: true,
    },
    {
      name: "Priority",
      selector: (row) =>{
        const color =
        row.priority === 'high'
          ? 'red'
          : row.priority === 'medium'
          ? 'orange'
          : row.priority === 'normal'
          ?'green'
          :'blue';
      return <Tag color={color} style={{width:60, display:'flex', alignItems:'center', justifyContent:'center'}}>{row.priority}</Tag>
      },
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Tooltip title="View">
            <Button
              className="text-green-500 border border-green-500"
              onClick={()=>handleListTask(row)}
            >
              <FaEye />
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              className="text-blue-500 border border-blue-500"
              onClick={() => handleUpdateTaskModal(row)}
            >
              <FaEdit />
            </Button>
          </Tooltip>
          {/* <Tooltip title="Delete">
            <Button
              className="text-red-500 border border-red-500"
              onClick={() => handleModalToggle("delete", row)}
            >
              <FaTrash />
            </Button>
          </Tooltip> */}
        </div>
      ),
      center: true,
    },
  ];

 
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ffA500",
        color: "#ffffff",
        fontSize: "16px",
        paddingRight: "0px",
      },
    },
  };

  // const handleBatchOptions = () => {
  //    setBatches.map((batch,i)=>{
  //     return(
  //       <label htmlFor="">{batch.batchName}</label>
  //       value= {batch._id}
  //     )
  //   })
    
  // };

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
  };

  const fetchGetBatch = async () => {
    try {
      const response = await GetBatches();
      //console.log("response in batch",response)
      if(response.data.status){
        setBatches(response.data.data);
      }
    } catch (error) {
      //console.error("err in batches",error);
    }
  };

  useEffect(()=>{
    fetchGetBatch()
  },[]);

//create task

  const handleCreateTaskSubmit = async (values) => {
    const payload = {
      ...values,
      trainerId:taskData.trainerId
    }
    try {
      const response = await createStudentTask(payload);
      //console.log("response", response)
      if(response.data.status){
        setTaskData(initialTaskState);
        form.resetFields();
        fetchGetAllTask();
        message.success("Student task created successfully");
        setCreateTaskModalVisible(false);
      }
    } catch (error) {
      //console.error("error in stu task",error);
      message.error(error?.response?.data?.message || "Failed to create student task");
    }
  }

  //list task all
  const fetchGetAllTask = async() => {
    try {
      const response = await GetAllStudentTask();
      //console.log("res in all task", response)
      if(response.data.status){
        setListTaskData(response.data.data)
      
      }
    } catch (error) {
      //console.error("err in all task", error);
      message.error(error?.response?.data?.message || "Failed to list tasks")
    }
  }


  const fetchTaskById = async (selectedTaskData) => {
    console.log("selected",selectedTaskData)
    try {
      const response = await GetStudentTaskById();
      if(response.data.status){
        setListTaskDataById(response.data.data);
      }
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    fetchTaskById(selectedTaskData)
  },[selectedTaskData])

useEffect(()=>{
fetchGetAllTask();
},[]);


//updatetask by id

const handleUpdateTaskByIdSubmit = async (values) => {
try {
  const response = await UpdateStudentTaskById(values,selectedTaskData._id);
  if(response.data.status){
    setUpdateTaskData(response.data.data);
    setSelectedTaskData([]);
    handleUpdateTaskModalCancel();
    message.success("Task updated successfully");
    fetchGetAllTask();
  }
} catch (error) {
  message.error(error?.response?.data?.message || "Failed to update task");
  console.error("error in update task", error);
}
} 

const TaskProgressCards = () => {
  const statusIcons = {
    "not attended": <FaTimesCircle color="#ff4d4f" size={20} />,
    "in progress": <FaSpinner color="#faad14" size={20} />,
    completed: <FaCheckCircle color="#52c41a" size={20} />,
  };

  const statusTitles = {
    "not attended": "Not Attended",
    "in progress": "In Progress",
    completed: "Completed",
  };

  // Mock Data
  const groupedData = listTaskDataById.flatMap((task) =>
    task.progressDetails.map((progressDetail) => {
      const trainee = task.traineeDetails.find(
        (trainee) => trainee._id === progressDetail.traineeId
      );
      return {
        fullName: trainee?.fullName || "Unknown",
        profilePic: trainee?.profilePic || "Default URL",
        status: progressDetail.status,
        startTime: progressDetail.startTime || "09:00 AM",
        endTime: progressDetail.endTime || "05:00 PM",
      };
    })
  );

  const groupedByStatus = groupedData.reduce((acc, trainee) => {
    const { status } = trainee;
    if (!acc[status]) acc[status] = [];
    acc[status].push(trainee);
    return acc;
  }, {});

  const orderedStatuses = ["not attended", "in progress", "completed"];

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      {orderedStatuses.map((status) => {
        // Check if there is data for the current status
        const statusData = groupedByStatus[status];
        if (!statusData || statusData.length === 0) return null; // Skip rendering if no data

        return (
          <div key={status}>
            {/* Status Title */}
            <Title
              level={4}
              style={{
                textTransform: "capitalize",
                marginBottom: "16px",
                borderBottom: "2px solid #e0e0e0",
                paddingBottom: "8px",
                color:
                  status === "not attended"
                    ? "#ff4d4f"
                    : status === "in progress"
                    ? "#faad14"
                    : "#52c41a",
              }}
            >
              {statusTitles[status]}
            </Title>


            <Row gutter={[16, 16]}>
              {statusData.map(
                ({ fullName, profilePic, startTime, endTime }, index) => (
                  <Col key={index} span={24}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          flex: "1",
                          gap: "32px",
                        }}
                      >
                        <Avatar size={50} src={profilePic} />
                        <div
                          style={{
                            textAlign: "center",
                            width: "120px",
                            marginLeft: "10px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              margin: 0,
                            }}
                          >
                            {fullName}
                          </p>
                        </div>

                        <div style={{ textAlign: "center", marginLeft: "40px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              margin: 0,
                              color: "gray",
                            }}
                          >
                            Start: {startTime}
                          </p>
                        </div>

                        <div style={{ textAlign: "center", marginLeft: "40px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              margin: 0,
                              color: "gray",
                            }}
                          >
                            End: {endTime}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              )}
            </Row>
          </div>
        );
      })}
    </div>
  );
};







  return (
    <div className="p-4">
      <button
        type="primary"
        onClick={() => setCreateTaskModalVisible(true)}
        className="mb-4 bg-orange-500 border text-white hover:border-orange-500 hover:text-orange-500 hover:bg-white transition-all transform duration-300 px-3 py-1 rounded-lg"
      >
        Create Task
      </button>

      <DataTable
        columns={columns}
        data={listTaskData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="border border-gray-300 rounded-md"
      />

      {/* Create Task Modal */}
      <Modal
        title="Create Task"
        // visible={modals.create}
        open={createTaskModalVisible}
        onCancel={() => setCreateTaskModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTaskSubmit} initialValues={{...initialTaskState}}>
          <Form.Item
            label="Task Title"
            name="title"
            rules={[{ required: true, message: "Please enter task title!" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item
            label="Batch"
            name="batchId"
            rules={[{ required: true, message: "Please select a batch!" }]}
          >
            <Select placeholder="Select Batch"
            // onChange={handleOnChange}
            // options={}
            >
             {batches.map((batch,i)=>(
                 <Select.Option key={i} value={batch._id} >
                  {/* {//console.log("select batch",batch)} */}
                 {`${batch.batchName} (${batch.batchId.split('-')[0]})`}
               </Select.Option>
             ))

             }
            </Select>
          </Form.Item>
 
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please select a due date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
      <Select options={handlePriorityOptions()} placeholder="Select Priority" />
    </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Task
          </Button>
        </Form>
      </Modal>



{/* View Task Modal */}
<Modal
  // title="View Task"
  open={listTaskModalVisible}
  onCancel={handleListTaskCancel}
  // onClose={()=>setListTaskModalVisible(false)}
  footer={null}
  width="50%"
  centered
  >
    <div style={{ padding: "20px" }}>
    <Title level={4} className="pb-4">Task Progress</Title>
    <TaskProgressCards />
  </div>
</Modal>



    {/* Update Task Modal */}
<Modal
  title={
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>Update Task</h3>
      {/* <Button
        onClick={() => handleModalToggle("update")}
        style={{ border: "none", background: "none", fontSize: 18 }}
      >
        ✖
      </Button> */}
    </div>
  }
  // visible={modals.update}
  open={updateTaskModalVisible}
  onCancel={handleUpdateTaskModalCancel}
  footer={null}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleUpdateTaskByIdSubmit}
    initialValues={{
      ...selectedTaskData,
      dueDate: selectedTaskData.dueDate ? moment(selectedTaskData.dueDate) : null,
    }}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form.Item
          label="Task Title"
          name="title"
          rules={[{ required: true, message: "Please enter task title!" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Batch"
          name="batchId"
          rules={[{ required: true, message: "Please select a batch!" }]}
        >
           <Select placeholder="Select Batch"
            // onChange={handleOnChange}
            // options={}
            >
             {batches.map((batch,i)=>(
                 <Select.Option key={i} value={batch._id} >
                  {/* {//console.log("select batch",batch)} */}
                 {`${batch.batchName} (${batch.batchId.split('-')[0]})`}
               </Select.Option>
             ))

             }
            </Select>
        </Form.Item>
      </Col>
      {/* <Col span={12}>
        <Form.Item
          label="Student"
          name="student"
          rules={[{ required: true, message: "Please select a student!" }]}
        >
          <Select placeholder="Select Student">
            <Select.Option value="John Doe">John Doe</Select.Option>
            <Select.Option value="Jane Smith">Jane Smith</Select.Option>
          </Select>
        </Form.Item>
      </Col> */}
      <Col span={12}>
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: "Please select a due date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
             <Select options={handlePriorityOptions()} placeholder="Select Priority" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Enter task description"
            rows={4}
          />
        </Form.Item>
      </Col>
    </Row>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button onClick={() => handleModalToggle("update")} type="default">
        Cancel
      </Button>
      <Button type="primary" htmlType="submit">
        Update Task
      </Button>
    </div>
  </Form>
</Modal>


      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Task"
        visible={modals.delete}
        onCancel={() => handleModalToggle("delete")}
        onOk={handleDeleteTask}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete the task **{selectedTask.title}**?
      </Modal>
    </div>
  );
};

export default StudentTask;
