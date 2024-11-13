
// const pages = [
//   {
//     title: "login",
//     path: "/",
//     element: <Login />,
//     access: ["open"],
//     layout: true,
//   },
// ];

import Admin from "../Panel/SuperAdmin/Pages/Staffs/Admin";
import Coordinator from "../Panel/SuperAdmin/Pages/Staffs/Coordiator";
import Dashboard from "../Panel/SuperAdmin/Pages/Dashboard/Dashboard";
import HR from "../Panel/SuperAdmin/Pages/Staffs/HR";
import Sidebar from "../Panel/SuperAdmin/Sidebar";
import Login from "../components/login";
import Staffs from "../Panel/SuperAdmin/Pages/Staffs/Staffs";
import Trainer from "../Panel/SuperAdmin/Pages/Staffs/Trainer";
import Trainee from "../Panel/SuperAdmin/Pages/Trainee/Trainee";
// import Task from "../Panel/SuperAdmin/Pages/Task/Task";
import Chat from "../Panel/SuperAdmin/Pages/Chat/Chat";
import Batches from "../Panel/SuperAdmin/Pages/Batches/Batches";
import Attendance from "../Panel/SuperAdmin/Pages/Attendance/Attendance";
import Notifications from "../Panel/SuperAdmin/Pages/Notifications/Notifications";
import Schedule from "../Panel/SuperAdmin/Pages/Schedule/Schedule";


// export default pages;

export const pages = [
  {
    title: "login",
    path: "/",
    element: <Login />,
  },
  
  //superadmin 

  {
    title: "SuperSidebar",
    path: "/sidebar",
    element: <Sidebar />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "batches",
        element: <Batches />,
      },
    
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "hr",
        element: <HR/>,
      },
      {
        path: "Coordinator",
        element: <Coordinator/>,
      },
      {
        path: "staffs",
        element: <Staffs/>,
      },
    
     
      {
        path: "trainer",
        element: <Trainer />,
      },
      {
        path: "trainee",
        element: <Trainee    />,
      },
     
      {
        path: "chat",
        element: <Chat    />,
      },
      {
        path: "attendance",
        element: <Attendance   />,
      },
      {
        path: "notifications",
        element: <Notifications   />,
      },
      {
        path: "schedule",
        element: <Schedule   />,
      },
    
    ],
  },


];
