import React, { useState } from "react";
import { Modal, Checkbox, Button, Select } from "antd";

const students = [
  { id: 1, name: "John Doe", image: "https://via.placeholder.com/40" },
  { id: 2, name: "Jane Smith", image: "https://via.placeholder.com/40" },
  { id: 3, name: "Sam Brown", image: "https://via.placeholder.com/40" },
  { id: 4, name: "Lisa White", image: "https://via.placeholder.com/40" },
];

const pointOptions = [
  { value: 10, label: "10 Points" },
  { value: 20, label: "20 Points" },
  { value: 30, label: "30 Points" },
  { value: 40, label: "40 Points" },
  { value: 50, label: "50 Points" },
];

const Sidebar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [points, setPoints] = useState(null);

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setDueTime(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (e, studentId) => {
    if (e.target.checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const getButtonLabel = () => {
    if (selectedStudents.length === students.length) {
      return "All Students";
    } else if (selectedStudents.length > 0) {
      const selectedNames = students
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => student.name, students.image)
        .join(", ");
      return `  ${selectedNames}`;
    }
    return "All Students";
  };

  return (
    <div className="w-1/5 border-l border-orange-300 p-4 h-[600px]">
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="">Assign To </label>
          <button
            className=" border border-gray-300  py-2 text-md font-semibold"
            onClick={handleOpenModal}
          >
            {getButtonLabel()}
          </button>
        </div>
        <div>
          <div className=" flex flex-col gap-2">
            <label htmlFor="points">Points</label>
            <Select
              id="points"
              value={points}
              onChange={(value) => setPoints(value)}
              placeholder="Select Points"
              options={pointOptions}
              className=" "
            />
          </div>
        </div>
       
          <div className="flex flex-col gap-2">
            <label htmlFor="due" className="text-sm font-semibold">
              Due Date
            </label>
            <input
              type="date"
              id="due"
              value={dueDate}
              onChange={handleDateChange}
              className=" border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {dueDate && (
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-semibold">
                Due Time (Optional)
              </label>
              <input
                type="time"
                id="time"
                value={dueTime}
                onChange={handleTimeChange}
                className=" border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          )}
     
      </div>

      <Modal
        title="Select Students"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCloseModal}>
            Submit
          </Button>,
        ]}
      >
        <div>
          <Checkbox
            onChange={handleSelectAll}
            checked={selectedStudents.length === students.length}
          >
            Select All
          </Checkbox>
          <div className="mt-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => handleSelectStudent(e, student.id)}
                />
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{student.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
