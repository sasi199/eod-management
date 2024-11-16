import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaClipboardList, FaBook, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUsers, FaChevronDown, FaBell, FaComment, FaCalendarAlt, FaFileAlt, FaTasks, FaComments } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import logo from '../../assets/Login/NavbarLogo.png'

const Navbar = () => {
  const location = useLocation();

  const pageNames = {
    '/trainersidebar/dashboard': 'Dashboard',
   
  };

  const currentPageName = pageNames[location.pathname] || 'Page';
  const user = {
    name: 'Trainer', 
    profileImage: 'https://via.placeholder.com/150', 
  };

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-orange-600">{currentPageName}</h2>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-orange-600">{user.name}</span>

        <img
          src={user.profileImage}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
};

const TrainerSidebar = () => {
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  const toggleStaffDropdown = () => {
    setIsStaffDropdownOpen(!isStaffDropdownOpen);
  };

  return (
    <div className="flex h-screen">
      <div className=" [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300 fixed top-0 bg-orange-500 text-white p-4 shadow-lg h-full overflow-y-auto">
    <div className='flex flex-col items-center'>
    <img src={logo} alt="" className='w-16  ' />
        <h2 className="text-2xl font-semibold mb-8 text-center">Why Global Services</h2>
        </div>
        <div className="space-y-4">
          <Link 
            to="/trainersidebar/dashboard" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaTachometerAlt />
            Dashboard
          </Link>
          <Link 
            to="/trainersidebar/myBatch" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaClipboardList />
            My Batches
          </Link>
          <Link 
            to="/trainersidebar/myBatch" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaTasks />
            Task
          </Link>
          <Link 
            to="/trainersidebar/assessment" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <MdAssignment/>
            Assessment
          </Link>
          <Link 
            to="/trainersidebar/attendance" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaCalendarAlt />
            Attendance
          </Link>
          <Link 
            to="/trainersidebar/syllabus" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaBook />
            Syllabus
          </Link>
          <Link 
            to="/trainersidebar/notifications" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaBell/>
            Notifications
          </Link>
          <Link 
            to="/trainersidebar/chat" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaComments />
            Chat
          </Link>
          <Link 
            to="/trainersidebar/reports" 
            className="flex items-center gap-4 px-4 text-lg font-semibold py-2 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200">
            <FaFileAlt />
            Report
          </Link>
          
          
        </div>
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

export default TrainerSidebar;
