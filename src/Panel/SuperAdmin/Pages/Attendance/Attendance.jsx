import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";

const Attendance = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "John Doe", status: "Present", wfo: "WFO", remarks: "", role: "HR", date: "2024-11-11" },
    { id: 2, name: "Gopi", status: "Absent", wfo: "WFO", remarks: "", role: "HR", date: "2024-11-10" },
    { id: 3, name: "Jane Smith", status: "Absent", wfo: "WFH", remarks: "", role: "Coordinator", date: "2024-11-11" },
    { id: 4, name: "Mark Johnson", status: "Present", wfo: "Leave", remarks: "", role: "Trainer", date: "2024-11-11" },
    { id: 5, name: "Alice Brown", status: "Present", wfo: "WFO", remarks: "", role: "Trainee", date: "2024-11-11" },
    { id: 6, name: "Bob White", status: "Absent", wfo: "WFH", remarks: "", role: "Admin", date: "2024-11-11" },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayDate);

  useEffect(() => {
    // Add dummy data for today's date if none exists
    const newEntries = [
      { id: 7, name: "David Miller", status: "Present", wfo: "WFO", remarks: "", role: "Admin", date: todayDate },
      { id: 8, name: "Emma Watson", status: "Absent", wfo: "WFH", remarks: "", role: "Coordinator", date: todayDate },
    ];
    setAttendanceData((prevData) => [...prevData, ...newEntries]);
  }, [todayDate]);

  const handleRoleChange = (e) => setSelectedRole(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleToggleStatus = (id) => {
    setAttendanceData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: item.status === "Present" ? "Absent" : "Present" } : item
      )
    );
  };

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate ? item.date === selectedDate : true;
    const matchesRole = selectedRole ? item.role === selectedRole : true;
    return matchesSearch && matchesDate && matchesRole;
  });

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: true,
      center: true,
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      center: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === "Present"}
            onChange={() => handleToggleStatus(row.id)}
            className="sr-only peer"
          />
          <span className="w-11 h-6 bg-gray-200 peer-checked:bg-orange-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white peer-checked:after:ring-0 rounded-full after:content-[''] after:absolute after:left-2 after:top-1 after:bg-white after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></span>
        </label>
      ),
      sortable: true,
    },
    {
      name: "Work Mode",
      selector: (row) => (
        <select value={row.wfo} className="p-2 border border-gray-300 rounded">
          <option value="WFO">WFO</option>
          <option value="WFH">WFH</option>
          <option value="Leave">Leave</option>
        </select>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Remarks",
      selector: (row) => (
        <input
          type="text"
          value={row.remarks}
          placeholder="Enter remarks"
          className="p-2 border border-gray-300 rounded"
        />
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          <FaEye size={16} />
        </button>
      ),
      button: true,
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ff9800",
        color: "#ffffff",
        fontSize: "16px",
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-around items-center">
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="mb-4 py-2 px-4 border border-gray-300 rounded-lg"
        >
          <option value="">Select Role</option>
          <option value="HR">HR</option>
          <option value="Coordinator">Coordinator</option>
          <option value="Trainer">Trainer</option>
          <option value="Trainee">Trainee</option>
          <option value="Admin">Admin</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="mb-4 p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mb-4 p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {!selectedRole && (
        <div className="text-center text-red-500 font-semibold mt-32">
          Please choose a role to view the attendance data.
        </div>
      )}
      {selectedRole && (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          customStyles={customStyles}
        />
      )}
    </div>
  );
};

export default Attendance;
