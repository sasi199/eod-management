import React, { useState } from 'react';
import { Table, Card, Row, Col, Tabs, Badge, Tag, Modal, Button } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaUser, FaCalendarAlt, FaExclamationTriangle, FaTag, FaClock, FaCheckCircle, FaCircleNotch } from 'react-icons/fa';

const { TabPane } = Tabs;

const EOD = () => {
  // State for List View
  const [listData, setListData] = useState([
    {
      key: 1,
      task: 'Trainee, hr, coordinator panel UI building',
      assignee: 'John Doe',
      assigneeImage: 'https://www.example.com/john.jpg',
      dueDate: '2024-11-30',
      priority: 'High',
      status: 'To Do',
      subtasks: [
        { name: 'Design UI mockup', assignee: 'John Doe', status: 'To Do' },
        { name: 'Develop UI components', assignee: 'Alice Smith', status: 'In Progress' },
      ],
    },
    {
      key: 2,
      task: 'Super admin panel trainee and employee integration and UI building.',
      assignee: 'Alice Smith',
      assigneeImage: 'https://www.example.com/alice.jpg',
      dueDate: '2024-12-01',
      priority: 'Medium',
      status: 'In Progress',
      subtasks: [
        { name: 'Set up API endpoints', assignee: 'Bob Johnson', status: 'Done' },
        { name: 'Create admin dashboard', assignee: 'Alice Smith', status: 'In Progress' },
      ],
    },
    {
      key: 3,
      task: 'Task 3',
      assignee: 'Bob Johnson',
      assigneeImage: 'https://www.example.com/bob.jpg',
      dueDate: '2024-11-25',
      priority: 'Low',
      status: 'Done',
      subtasks: [
        { name: 'Write documentation', assignee: 'John Doe', status: 'Done' },
      ],
    },
  ]);

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
  

  // State for Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const showModal = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
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
          {text}
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
            src={record.assigneeImage}
            alt={record.assignee}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span>{text}</span>
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
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          'To Do': 'blue',
          'In Progress': 'orange',
          Done: 'green',
        };
        return <Badge color={colors[status]} text={status} />;
      },
    },
  ];

  return (
    <div className="p-6">
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

export default EOD;
