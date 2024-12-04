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
  Typography
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
      {/* <button
        type="primary"
        onClick={() => handleModalToggle("create")}
        className="mb-4 bg-orange-500 border text-white hover:border-orange-500 hover:text-orange-500 hover:bg-white transition-all transform duration-300 px-3 py-1 rounded-lg"
      >
        Create Task
      </button> */}

      <DataTable
        columns={columns}
        data={tasks}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="border border-gray-300 rounded-md mt-8"
      />

      {/* Create Task Modal */}
      <Modal
        title="Create Task"
        visible={modals.create}
        onCancel={() => handleModalToggle("create")}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item
            label="Task Title"
            name="taskTitle"
            rules={[{ required: true, message: "Please enter task title!" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item
            label="Batch"
            name="batch"
            rules={[{ required: true, message: "Please select a batch!" }]}
          >
            <Select placeholder="Select Batch">
              <Select.Option value="Batch A">Batch A</Select.Option>
              <Select.Option value="Batch B">Batch B</Select.Option>
            </Select>
          </Form.Item>
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
  visible={modals.view}
  onCancel={() => handleModalToggle("view")}
  footer={null}
  width={600}
  style={{ padding: "20px" }}
>
  <Row gutter={[16, 16]}>
    <Col span={24}>
      <Title level={4}>Task Detailssss</Title>
    </Col>

    {/* Task Title */}
    <Col span={24}>
      <Row align="middle">
        <Col flex="32px">
          <FaBook size={20} color="#1890ff" />
        </Col>
        <Col>
          <Text strong>Title:</Text> {selectedTask.taskTitle}
        </Col>
      </Row>
    </Col>

    {/* Batch */}
    <Col span={24}>
      <Row align="middle">
        <Col flex="32px">
          <FaClipboardList size={20} color="#1890ff" />
        </Col>
        <Col>
          <Text strong>Batch:</Text> {selectedTask.batch}
        </Col>
      </Row>
    </Col>

    {/* Student */}
    <Col span={24}>
      <Row align="middle">
        <Col flex="32px">
          <FaUser size={20} color="#1890ff" />
        </Col>
        <Col>
          <Text strong>Student:</Text> {selectedTask.student}
        </Col>
      </Row>
    </Col>

    {/* Due Date */}
    <Col span={24}>
      <Row align="middle">
        <Col flex="32px">
          <FaCalendarAlt size={20} color="#1890ff" />
        </Col>
        <Col>
          <Text strong>Due Date:</Text> {selectedTask.dueDate}
        </Col>
      </Row>
    </Col>

    {/* Description */}
    <Col span={24}>
      <Divider />
      <Row align="middle">
        <Col flex="32px">
          <FaClipboardList size={20} color="#1890ff" />
        </Col>
        <Col>
          <Text strong>Description:</Text>
        </Col>
      </Row>
      <Text>{selectedTask.description}</Text>
    </Col>
  </Row>
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
  visible={modals.update}
  onCancel={() => handleModalToggle("update")}
  footer={null}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleUpdateTask}
    initialValues={{
      ...selectedTask,
      dueDate: selectedTask.dueDate ? moment(selectedTask.dueDate) : null,
    }}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form.Item
          label="Task Title"
          name="taskTitle"
          rules={[{ required: true, message: "Please enter task title!" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Batch"
          name="batch"
          rules={[{ required: true, message: "Please select a batch!" }]}
        >
          <Select placeholder="Select Batch">
            <Select.Option value="Batch A">Batch A</Select.Option>
            <Select.Option value="Batch B">Batch B</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
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
      </Col>
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
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
          </Select>
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
        Are you sure you want to delete the task **{selectedTask.taskTitle}**?
      </Modal>
    </div>
  );
};

export default TraineeTask;
