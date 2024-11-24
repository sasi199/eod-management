import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBook,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaChevronDown,
  FaBell,
  FaComment,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { MdAssignment } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import logo from "../../assets/Login/NavbarLogo.png";
import { logout } from "../../services";

const Navbar = () => {
  const location = useLocation();

  const pageNames = {
    "/sidebar/dashboard": "Dashboard",
    "/sidebar/batches": "Batches",
    "/sidebar/courses": "Courses",
    "/sidebar/admin": "Admin",
    "/sidebar/hr": "Human Resource",
    "/sidebar/trainer": "Trainer",
    "/sidebar/Coordinator": "Coordinator",
    "/sidebar/staffs": "Staffs",
    "/sidebar/trainee": "Trainee",
    "/sidebar/attendance": "Attendance",
    "/sidebar/chat": "Chat",
    "/sidebar/schedule": "Schedule",
    "/sidebar/notifications": "Notifications",
  };

  const currentPageName = pageNames[location.pathname] || "Page";
  const user = {
    name: "Super Admin",
    profileImage: "https://via.placeholder.com/150",
  };

  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    console.log("out");
    // try {
    const res = await logout();
    console.log(res.data);

    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
    // } catch (error) {
    //   console.error('Error logging out:', error.message);
    // }

    setDropdown(false); // Assuming this closes a dropdown
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-orange-600">
        {currentPageName}
      </h2>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-orange-600">{user.name}</span>
        <div className="relative dropdown-container">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-8 h-8 rounded-full"
            onClick={toggleDropdown}
          />
          {dropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-orange-600 "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  const toggleStaffDropdown = () => {
    setIsStaffDropdownOpen(!isStaffDropdownOpen);
  };

  const [isTaskView, setIsTaskView] = useState(false);

  const toggleTaskVIew = () => {
    setIsTaskView(!isTaskView);
  };

  return (
    <div className="flex h-screen">
      <div
        className=" [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300 fixed top-0 bg-orange-500 text-white p-4 shadow-lg h-full overflow-y-auto"
      >
        <div className="flex flex-col items-center">
          <img src={logo} alt="" className="w-16  " />
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Why Global Services
          </h2>
        </div>

        {!isTaskView ? (
          <div className="space-y-4">
            <Link
              to="/sidebar/dashboard"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaTachometerAlt />
              Dashboard
            </Link>

            <Link
              to="/sidebar/batches"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaClipboardList />
              Batches
            </Link>

            <Link
              to="/sidebar/courses"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaBook />
              Courses
            </Link>

            <div>
              <Link
                to="/sidebar/staffs"
                onClick={toggleStaffDropdown}
                className="flex items-center gap-4 px-4 text-lg font-semibold py-2 w-full rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                <FaUsers />
                Staffs
                {/* <FaChevronDown
                className={`${
                  isStaffDropdownOpen ? "transform rotate-180" : ""
                } ml-auto transition-transform`}
              /> */}
              </Link>
              {/* 
            {isStaffDropdownOpen && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  to="/sidebar/trainer"
                  className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
                >
                  <FaUserGraduate />
                  Trainer
                </Link> */}
              {/* </div> */}
              {/* )} */}
            </div>

            <Link
              to="/sidebar/trainee"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaUserGraduate />
              Trainee
            </Link>
            <Link
              to="/sidebar/attendance"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <SlCalender />
              Attendance
            </Link>
            <Link
              to="/sidebar/task"
              onClick={toggleTaskVIew}
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <MdAssignment />
              Task
            </Link>
            <Link
              to="/sidebar/SuperAssessment"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <GiNotebook />
              Assessment
            </Link>
            <Link
              to="/sidebar/notifications"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaBell />
              Notifications
            </Link>
            <Link
              to="/sidebar/chat"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaComment />
              Chat
            </Link>
            <Link
              to="/sidebar/schedule"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaCalendarAlt />
              Schedule
            </Link>
            <Link
              to="/sidebar/report"
              className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              <FaFileAlt />
              Reports
            </Link>
          </div>
        ) : (
          <div className="space-y-4 ">
            <button
              onClick={toggleTaskVIew}
              className="flex items-center gap-4 w-full text-lg font-semibold py-2 px-4 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              ← Go Back
            </button>
            <div className="mt-4 ">
              <Link
                to="/sidebar/task/eod"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                EOD Management
              </Link>
              <Link
                to="sidebar/task/hire-expert"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Hire an Expert
              </Link>
              <Link
                to="sidebar/task/project-analysis"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Project Analysis
              </Link>
              <Link
                to="sidebar/task/project-analysis"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Anil
              </Link>
              <Link
                to="sidebar/task/project-analysis"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                HRMS
              </Link>
              <Link
                to="/tasks/project-analysis"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                CRM
              </Link>
              <Link
                to="/tasks/project-analysis"
                className="flex items-center gap-4 px-4 text-sm font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                EOD
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 h-screen ml-64 py-1  ">
        <Navbar />
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
