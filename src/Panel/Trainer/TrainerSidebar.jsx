import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaClipboardList, FaBook, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUsers, FaChevronDown, FaBell, FaComment, FaCalendarAlt, FaFileAlt, FaTasks, FaComments } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import logo from '../../assets/Login/NavbarLogo.png'
import { logout } from '../../services';
import {Modal, Input, Select, Button} from 'antd'
const Navbar = () => {
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
 

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    console.log("out");
    try {
      const res = await logout();
      console.log(res);
  
      
      localStorage.removeItem("token");
      window.location.href = "/"; 
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
    
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

const TrainerSidebar = () => {
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const[isTaskView,setIsTaskView]=useState(false);
  const[isModalVisible, setIsModalVisible]=useState(false);
  const[projectName, setProjectName]=useState('');
  const[selectedMembers, setSelectedMembers]=useState([]);
  const toggleStaffDropdown = () => {
    setIsStaffDropdownOpen(!isStaffDropdownOpen);
  };

  const teamMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Jim Brown' },
    { id: 4, name: 'Lucy Green' },
    { id: 5, name: 'Mark White' },
  ];


  const toggleTaskView=()=>{
    setIsTaskView(!isTaskView);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log('Project Name:', projectName);
    console.log('Selected Members:', selectedMembers);
    setIsModalVisible(false); 
  };

  const handleCancel = () => {
    setIsModalVisible(false);  
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

      {!isTaskView ? (<div className="space-y-4">
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
            to="/trainersidebar/task" 
            onClick={toggleTaskView}
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
          
          
        </div>):(
             <div className="space-y-4">
             <button
               onClick={toggleTaskView}
               className="flex items-center gap-4 w-full text-lg font-semibold py-2 px-4 rounded-md text-white hover:bg-white hover:text-orange-600 transition-all duration-200"
             >
               ← Go Back
             </button>
             <div className="flex items-center gap-4   p-3 mt-4">
  
  <input
    type="text"
    placeholder="Search"
    className="flex-1 text-sm text-gray-700 placeholder-white bg-transparent border border-white rounded-md py-2 px-3 outline-none focus:ring-2 focus:ring-orange-600"
  />

  <button
    onClick={showModal}
    className="flex items-center gap-2 bg-white text-orange-500 text-md font-semibold py-1 px-2 rounded-md hover:bg-white hover:text-orange-600 hover:border hover:border-orange-600 transition-all duration-200"
  >
    Add Project
  </button>
</div>

           </div>
         )}
       </div>
 
       <div className="flex-1 h-screen ml-64 py-1">
         <Navbar />
         <div className="mt-4">
           <Outlet />
         </div>
       </div>
 
       <Modal
         title="Create New Project"
         visible={isModalVisible}
         onOk={handleOk}
         onCancel={handleCancel}
         footer={null}
       >
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-semibold mb-2">Project Name</label>
             <Input
               value={projectName}
               onChange={(e) => setProjectName(e.target.value)}
               placeholder="Enter project name"
             />
           </div>
 
           <div>
             <label className="block text-sm font-semibold mb-2">Select Team Members</label>
             <Select
               mode="multiple"
               style={{ width: '100%' }}
               value={selectedMembers}
               onChange={setSelectedMembers}
               placeholder="Select members"
             >
               {teamMembers.map((member) => (
                 <Option key={member.id} value={member.id}>
                   {member.name}
                 </Option>
               ))}
             </Select>
           </div>
 
           <div className="flex justify-end gap-4 mt-4">
             <Button onClick={handleCancel}>Cancel</Button>
             <Button type="primary" onClick={handleOk}>
               Create Project
             </Button>
           </div>
         </div>
       </Modal>
     </div>
   );
 };
 
 export default TrainerSidebar;   