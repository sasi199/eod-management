import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { GetAttendance } from "../../../../services";

const Attendance = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const [attendanceData, setAttendanceData] = useState([]);
  const [roles, setRoles] = useState([]); // Added the state for roles
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayDate);

  // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const res = await GetAttendance();
        if (res?.data?.data) {
          setAttendanceData(res.data.data);
          console.log(res.data.data); 

          
          const extractedRoles = [
            ...new Set(res.data.data.map((item) => item.user?.role)),
          ];
          setRoles(extractedRoles);
        } else {
          console.error("Invalid response structure:", res);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleRoleChange = (e) => setSelectedRole(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleToggleStatus = (id) => {
    setAttendanceData((prevData) =>
      prevData.map((item) =>
        item._id === id
          ? { ...item, status: item.status === "Present" ? "Absent" : "Present" }
          : item
      )
    );
  };

  const filteredData = (attendanceData || []).filter((item) => {
    const matchesSearch = item.user?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate
      ? new Date(item.date).toISOString().split("T")[0] === selectedDate
      : true;
    const matchesRole = selectedRole ? item.user?.role === selectedRole : true;
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
      name: "Profile",
      selector: (row) => (
       
          <img
            src={row.user?.profilePic || "/placeholder.jpg"} 
            alt="Profile Pic"
            className="w-10 h-10 rounded-full"
          />
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Name",
      selector: (row) => (
        <p className="text-sm">{row.user?.fullName || "N/A"}</p> 
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Role",
      selector: (row) => (
        <p className="text-sm">{row.user?.role || "N/A"}</p> 
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Present / Absent",
      selector: (row) => (
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === "Present"}
            onChange={() => handleToggleStatus(row._id)}
            className="sr-only peer"
          />
          <span className="w-11 h-6 bg-gray-200 peer-checked:bg-orange-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white peer-checked:after:ring-0 rounded-full after:content-[''] after:absolute after:left-2 after:top-1 after:bg-white after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></span>
        </label>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Check-In Time",
      selector: (row) => new Date(row.checkIn).toLocaleTimeString(),
      sortable: true,
      center: true,
    },
    {
      name: "Check-Out Time",
      selector: (row) => new Date(row.checkOut).toLocaleTimeString(),
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
      <div className="flex justify-around items-center mb-4">
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="py-2 px-4 border border-gray-300 rounded-lg"
        >
          <option value="">Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {!selectedRole && attendanceData.length === 0 && (
        <div className="text-center text-red-500 font-semibold mt-4">
          Please choose a role to view the attendance data.
        </div>
      )}
      {selectedRole && attendanceData.length > 0 && (
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
