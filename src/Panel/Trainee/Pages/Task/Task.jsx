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
  List,
  Tag,
  Avatar
} from "antd";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import moment from "moment";
import { FaBook, FaClipboardList, FaUser } from "react-icons/fa6";
import { GetStudentTask } from "../../../../services";
const { Title, Text } = Typography;

const TraineeTask = () => {
  const initialTaskState = {
    id: null,
    taskTitle: "",
    batch: "",
    student: "",
    dueDate: "",
    status: "",
    description: "",
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      taskTitle: "Math Assignment",
      batch: "Batch A",
      student: "John Doe",
      dueDate: "2024-12-01",
      status: "Pending",
      description: "Solve all algebra questions.",
    },
    {
      id: 2,
      taskTitle: "Science Project",
      batch: "Batch B",
      student: "Jane Smith",
      dueDate: "2024-12-05",
      status: "Completed",
      description: "Create a volcano model.",
    },
  ]);

  const [modals, setModals] = useState({
    create: false,
    view: false,
    update: false,
    delete: false,
  });
  const [selectedTask, setSelectedTask] = useState(initialTaskState);
  const [traineeTaskData, setTraineeTaskData] = useState([]);

  const [form] = Form.useForm();

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

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      center: true,
    },
    {
      name: "Task Title",
      selector: (row) => row.taskTitle,
      sortable: true,
      center: true,
    },
    {
      name: "Batch",
      selector: (row) => row.batch,
      sortable: true,
      center: true,
    },
    {
      name: "Student",
      selector: (row) => row.student,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2 pl-6">
          <Tooltip title="View">
            <Button
              className="text-green-500 border border-green-500"
              onClick={() => handleModalToggle("view", row)}
            >
              <FaEye />
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              className="text-blue-500 border border-blue-500"
              onClick={() => handleModalToggle("update", row)}
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


  //list trainee task based on batch id

  const fetchTraineeTaskByBatchId = async () => {
    try {
      const response = await GetStudentTask();
      console.log("response in trainee task", response)
      if(response.data.status){
        setTraineeTaskData(response.data.data);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to list trainee task");
    }
  };

  useEffect(()=>{
    fetchTraineeTaskByBatchId();
  },[])

  return (
    <div className="p-4">
    
      <div className="p-6 min-h-screen">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Trainee Task List</h2>
      <div className="space-y-4">
        {traineeTaskData.map((item) => (
          <div
            key={item._id}
            className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
         
            <Avatar size={64} src={item.trainerId.profilePic} className="mr-4" />

            <div className="flex-grow">
              <div className="flex justify-between items-center">
             
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <Tag color={item.priority === "high" ? "red": "medium"?"orange":"normal"?"green":"blue"}>
                  {item.priority}
                </Tag>
              </div>

           
              <p className="text-gray-600">{item.description}</p>

              <div className="text-sm text-gray-500 flex justify-between mt-2">
                <span>Trainer: {item.trainerId.fullName}</span>
                <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
     


    </div>
  );
};

export default TraineeTask;
