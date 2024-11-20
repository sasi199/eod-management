import { Button, Modal, Input, DatePicker, Select, Table } from "antd";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

const { Option } = Select;

const Schedule = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "Batch A",
      students: 30,
      course: "Full Stack Developer",
      date: "2024-11-01",
      timetable: [
        { subject: "React", instructor: "VIGNESH", time: "10:00 AM" },
        { subject: "Node.js ", instructor: "Gopal", time: "2:00 PM" },
      ],
    },
    {
      id: 2,
      name: "Batch B",
      students: 25,
      course: "Digital Marketing",
      date: "2024-02-01",
      timetable: [
        { subject: "PHP", instructor: "ASHOK", time: "9:30 AM" },
        { subject: "Communication", instructor: "Magimai", time: "1:00 PM" },
      ],
    },
    {
      id: 3,
      name: "Batch C",
      students: 20,
      course: "Full Stack Developer",
      date: "2024-03-01",
      timetable: [
        { subject: "JavaScript Advanced", instructor: "Chris Evans", time: "11:00 AM" },
        { subject: "Database Design", instructor: "Robert Downey", time: "3:00 PM" },
      ],
    },
  ]);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: "", students: "", course: "", date: "", timetable: [] });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [newTimetable, setNewTimetable] = useState({ subject: "", instructor: "", time: "" });

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, center: true },
    { name: "Batch Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Students", selector: (row) => row.students, sortable: true, center: true },
    { name: "Course", selector: (row) => row.course, sortable: true, center: true },
    { name: "Date", selector: (row) => row.date, sortable: true, center: true },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button onClick={() => handleAddTimetable(row)} className="border border-blue-500 text-blue-500">
            Add Timetable
          </Button>
          <Button onClick={() => handleEdit(row)} className="border border-green-500 text-green-500">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} className="border border-red-500 text-red-500">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const timetableColumns = [
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Instructor", dataIndex: "instructor", key: "instructor" },
    { title: "Time", dataIndex: "time", key: "time" },
  ];

  const handleAddBatch = () => {
    setBatches((prev) => [
      ...prev,
      { ...newBatch, id: prev.length + 1, date: dayjs(newBatch.date).format("YYYY-MM-DD") },
    ]);
    setIsBatchModalOpen(false);
    setNewBatch({ name: "", students: "", course: "", date: "", timetable: [] });
  };

  const handleAddTimetable = (batch) => {
    setSelectedBatch(batch);
    setIsTimetableModalOpen(true);
  };

  const handleSaveTimetable = () => {
    setBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.id === selectedBatch.id
          ? { ...batch, timetable: [...batch.timetable, newTimetable] }
          : batch
      )
    );
    setIsTimetableModalOpen(false);
    setNewTimetable({ subject: "", instructor: "", time: "" });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2>Schedule</h2>
        <button
          onClick={() => setIsBatchModalOpen(true)}
          className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
        >
          Add Schedule
        </button>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        pagination
        highlightOnHover
        customStyles={{
          headCells: {
            style: { backgroundColor: "#ff9800", color: "#ffffff", fontSize: "16px" },
          },
        }}
        className="border rounded shadow-sm"
      />

      <Modal
        title="Add New Schedule"
        visible={isBatchModalOpen}
        onCancel={() => setIsBatchModalOpen(false)}
        footer={null}
      >
        <Input
          placeholder="Batch Name"
          value={newBatch.name}
          onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
          className="mb-3"
        />
        <Input
          type="number"
          placeholder="Number of Students"
          value={newBatch.students}
          onChange={(e) => setNewBatch({ ...newBatch, students: e.target.value })}
          className="mb-3"
        />
        <Select
          placeholder="Select Course"
          value={newBatch.course}
          onChange={(value) => setNewBatch({ ...newBatch, course: value })}
          className="w-full mb-3"
        >
          <Option value="Full Stack Developer">Full Stack Developer</Option>
          <Option value="Digital Marketing">Digital Marketing</Option>
        </Select>
        <DatePicker
          placeholder="Select Date"
          onChange={(date) => setNewBatch({ ...newBatch, date })}
          className="w-full"
        />
        <button
          onClick={handleAddBatch}
          className="w-full bg-orange-500 text-white hover:bg-orange-600 py-1 mt-4 rounded-lg text-lg"
        >
          Add Schedule
        </button>
      </Modal>

      <Modal
        title={`Add Timetable for ${selectedBatch?.name}`}
        visible={isTimetableModalOpen}
        onCancel={() => setIsTimetableModalOpen(false)}
        onOk={handleSaveTimetable}
        okText="Add Timetable"
      >
        <Input
          placeholder="Subject"
          value={newTimetable.subject}
          onChange={(e) => setNewTimetable({ ...newTimetable, subject: e.target.value })}
          className="mb-3"
        />
        <Input
          placeholder="Instructor"
          value={newTimetable.instructor}
          onChange={(e) => setNewTimetable({ ...newTimetable, instructor: e.target.value })}
          className="mb-3"
        />
        <Input
          placeholder="Time"
          value={newTimetable.time}
          onChange={(e) => setNewTimetable({ ...newTimetable, time: e.target.value })}
          className="mb-3"
        />
      </Modal>

      {selectedBatch && (
        <div className="mt-4">
          <h3>Timetable for {selectedBatch.name}</h3>
          <Table
            columns={timetableColumns}
            dataSource={selectedBatch.timetable}
            pagination={false}
            rowKey="time"
          />
        </div>
      )}
    </div>
  );
};

export default Schedule;
