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
import { GetStudentTask, UpdateStudentStatusById } from "../../../../services";
const { Title, Text } = Typography;

const TraineeTask = () => {
  const [traineeTaskData, setTraineeTaskData] = useState([]);
  // const [selectedTaskData, setSelectedTaskData] = useState([]);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [taskStatus, setTaskStatus] = useState();
  const [form] = Form.useForm();


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

  //update status of the trainee


  const handleUpdateStatus = async(status, task) => {
 
    try {
      console.log("status",status)
      const taskId = task._id
      const response = await UpdateStudentStatusById({status:status},taskId);
      if(response.data.status){
        message.success(`Task ${status} successfully`)
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update the status of task");
      console.error(`error in update task ${status}`, error);
    }
  }

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

  
    <div className="flex justify-around w-full">
    
      <div className="flex flex-col justify-center items-start">
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <span className="text-sm text-gray-600">Trainer: {item.trainerId.fullName}</span>
      </div>

    
      <div className="flex flex-col justify-center items-center">
        <p className="text-gray-600">{item.description}</p>
      </div>

      <div className="flex flex-col justify-center items-center space-y-2">
        {!showCompleteButton ?(
            <button onClick={()=>{handleUpdateStatus("in progress",item); setShowCompleteButton(true)}} className="px-2 py-2 bg-orange-500 text-white w-24 rounded-md hover:bg-orange-600">
            Start
          </button>
        ):(
          <button onClick={()=>{handleUpdateStatus("completed",item); setShowCompleteButton(false)}} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Complete
        </button>
        )

        }
      
      
     
      </div>

    
      <div className="flex flex-col justify-center items-end">
        <Tag
          color={
            item.priority === "high"
              ? "red"
              : item.priority === "medium"
              ? "orange"
              : item.priority === "normal"
              ? "green"
              : "blue"
          }
        >
          {item.priority}
        </Tag>
        <span className="text-sm text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
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
