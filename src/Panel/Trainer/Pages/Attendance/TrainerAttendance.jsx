import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";

const TrainerAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (isLoggedIn) {
     
      setAttendanceData((prevData) => [
        ...prevData,
        {
          id: prevData.length + 1,
          name: "John Doe", 
          status: "Present",
          date: today,
          loginTime: new Date().toLocaleTimeString(),
          logoutTime: "",
        },
      ]);
    }
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    const today = new Date().toISOString().split("T")[0];
    const logoutTime = new Date().toLocaleTimeString();

    setAttendanceData((prevData) =>
      prevData.map((item) =>
        item.date === today && item.status === "Present"
          ? { ...item, status: "Absent", logoutTime }
          : item
      )
    );
  };

  const handleToggleHistory = () => {
    setIsHistoryVisible((prev) => !prev);
  };

  const columns = [
    { name: "Date", selector: (row) => row.date, sortable: true, center: true },
    { name: "Login Time", selector: (row) => row.loginTime || "N/A", center: true },
    { name: "Logout Time", selector: (row) => row.logoutTime || "N/A", center: true },
    { name: "Status", selector: (row) => row.status, sortable: true, center: true },
    {
      name: "Action",
      cell: (row) => (
        <button className="bg-orange-500 text-white px-2 py-1 rounded">
          <FaEye size={16} />
        </button>
      ),
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: { backgroundColor: "#ff9800", color: "#ffffff", fontSize: "16px" },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-around mb-4">
        {!isLoggedIn ? (
          <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        ) : (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        )}
        <button onClick={handleToggleHistory} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          {isHistoryVisible ? "Hide History" : "View Attendance History"}
        </button>
      </div>

      {isHistoryVisible && (
        <div className="mt-4">
          <DataTable
            title="Attendance History"
            columns={columns}
            data={attendanceData}
            pagination
            highlightOnHover
            customStyles={customStyles}
          />
        </div>
      )}
    </div>
  );
};

export default TrainerAttendance;
