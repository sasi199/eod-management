// const pages = [
//   {
//     title: "login",
//     path: "/",
//     element: <Login />,
//     access: ["open"],
//     layout: true,
//   },
// ];

import Dashboard from "../Panel/SuperAdmin/Pages/Dashboard/Dashboard";
import Sidebar from "../Panel/SuperAdmin/Sidebar";
import Staffs from "../Panel/SuperAdmin/Pages/Staffs/Staffs";
import Trainer from "../Panel/SuperAdmin/Pages/Staffs/Trainer";
import Trainee from "../Panel/SuperAdmin/Pages/Trainee/Trainee";
// import Task from "../Panel/SuperAdmin/Pages/Task/Task";
import Chat from "../Panel/SuperAdmin/Pages/Chat/Chat";
import Batches from "../Panel/SuperAdmin/Pages/Batches/Batches";
import Attendance from "../Panel/SuperAdmin/Pages/Attendance/Attendance";
import Notifications from "../Panel/SuperAdmin/Pages/Notifications/Notifications";
import Schedule from "../Panel/SuperAdmin/Pages/Schedule/Schedule";
import TraineeSidebar from "../Panel/Trainee/TraineeSidebar";
import TraineeDashboard from "../Panel/Trainee/Pages/Dashboard/TraineeDashboard";
import TraineeSyllabus from "../Panel/Trainee/Pages/Syllabus/TraineeSyllabus";
import TraineeNotificaitons from "../Panel/Trainee/Pages/Notifications/TraineeNotificaitons";
import TraineeReports from "../Panel/Trainee/Pages/Report/TraineeReports";
import TrainerSidebar from "../Panel/Trainer/TrainerSidebar";
import TrainerChat from "../Panel/Trainer/Pages/Chat/TrainerChat";
import TrainerReports from "../Panel/Trainer/Pages/Report/TrainerReport";
import TrainerNotificaitons from "../Panel/Trainer/Pages/Notifications/TrainerNotifications";
import TrainerSyllabus from "../Panel/Trainer/Pages/Syllabus/TrainerSyllabus";
import TrainerAttendance from "../Panel/Trainer/Pages/Attendance/TrainerAttendance";
import TrainerAttendace from "../Panel/Trainer/Pages/Attendance/TrainerAttendance";
import TrainerAssessment from "../Panel/Trainer/Pages/Assessment/TrainerAssessment";
// import CreatePage from "../Panel/Trainer/Pages/Assessment/CreateAssessment";
import Login from "../components/login";
import SuperAssessment from "../Panel/SuperAdmin/Pages/Assessment/TrainerAssessment";
import SuperReports from "../Panel/SuperAdmin/Pages/Report/SuperReport";
import Task from "../Panel/SuperAdmin/Pages/Task/Task";
// import EOD from "../Panel/SuperAdmin/Pages/Task/EOD";
import Course from "../Panel/SuperAdmin/Pages/Course/Course";
import TraineeTask from "../Panel/Trainee/Pages/Task/Task";
import TrainerTask from "../Panel/Trainer/Pages/Task/Task";
import ProjectTask from "../Panel/Trainer/Pages/Task/ProjectTask";
import StudentTask from "../Panel/Trainer/Pages/StudentTask/StudentTask";
import MyBatch from "../Panel/Trainer/Pages/MyBatch/MyBatch";
import TraineeAssessment from "../Panel/Trainee/Pages/Assesment/TraineeAssessment";

import Profile from "../Panel/Trainer/Pages/Profile/Profile";
import Eod from "../Panel/Trainer/Pages/EOD/Eod";
import TrainerEod from "../Panel/Trainer/Pages/EOD/Eod";
import SuperEod from "../Panel/SuperAdmin/Pages/EOD/SuperEod";
import AddRole from "../Panel/SuperAdmin/Pages/BasicDetails/AddRole";
import AddCompany from "../Panel/SuperAdmin/Pages/BasicDetails/AddCompany";
import SalaryConfig from "../Panel/SuperAdmin/Pages/SalaryConfig/SalaryConfig";



const initialSalaryConfig = {
  _id: "someUUID",
  isEmployerEsi: true,
  isEmployerPf: true,
  pf: 0.12,
  employerPF: 0.12,
  esi: 0.0075,
  employerEsi: 0.0325,
  basic: 0.4,
  hra: 0.3,
  conveyance: 0.1,
  otherAllowance: 0.2,
  sickLeave: 1,
  casualLeave: 1,
  permission: 2,
  permissionDuration: 5400,
  checkInTime: "09:55",
  checkOutTime: "18:30",
  graceTime: 300,
  workingHours: 270000,
  approvedLate: 3,
  startDeductFrom: 4,
  lastModified: [],
};

const history = [
  {
    _id: "uuid1",
    date: "10/12/2024",
    modifiedFields: ["pf", "esi"]
  },
  {
    _id: "uuid2",
    date: "11/12/2024",
    modifiedFields: ["basic", "hra"]
  },
];

const handleSave = (updatedConfig, historyEntry) => {
  console.log('Updated Config:', updatedConfig);
  console.log('History Entry:', historyEntry);
};


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
        path: "courses",
        element: <Course />,
      },

      {
        path: "staffs",
        element: <Staffs />,
      },
{
  path:"basicdetails/addRole",
  element:<AddRole/>
},
{
  path:"basicdetails/addCompany",
  element:<AddCompany/>
},

      {
        path: "trainer",
        element: <Trainer />,
      },
      {
        path: "SuperEod",
        element: <SuperEod />,
      },
      {
        path: "trainee",
        element: <Trainee />,
      },

      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },

    
      {
        path: "task",
        element: <Task />,
      },
      {
        path: "SuperAssessment",
        element: <SuperAssessment />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "report",
        element: <SuperReports />,
      },
      {
        path: "salary-config",
        element: <SalaryConfig
        salaryConfig={initialSalaryConfig}
        history={history}
        onSave={handleSave}
      />,
      },
    ],
  },

  // Trainee

  {
    title: "TraineeSidebar",
    path: "/traineesidebar",
    element: <TraineeSidebar />,
    children: [
      {
        path: "dashboard",
        element: <TraineeDashboard />,
      },

      {
        path: "syllabus",
        element: <TraineeSyllabus />,
      },
      
      {
        path: "notifications",
        element: <TraineeNotificaitons />,
      },
      {
        path: "assessment",
        element: <TraineeAssessment />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path:"task",
        element:<TraineeTask/>
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "reports",
        element: <TraineeReports />,
      },
    ],
  },

  // Trainer

  {
    title: "TrainerSidebar",
    path: "/trainersidebar",
    element: <TrainerSidebar />,
    children: [
      {
        path: "dashboard",
        element: <TraineeDashboard />,
      },
      {
        path: "chat",
        element: <TrainerChat />,
      },
      {
        path: "task",
        element: <TrainerTask />,
      },
      {
        path:"studenttask",
        element: <StudentTask/>
      },
      {
        path:"eod",
        element: <TrainerEod/>
      },
    
      {
        path:"profile",
        element:<Profile/>
      },

      {
        path: "syllabus",
        element: <TrainerSyllabus />,
      },
      {
        path: "myBatch",
        element: <MyBatch />,
      },
      {
        path: "assessment",
        element: <TrainerAssessment />,
      },
    
      {
        path: "notifications",
        element: <TrainerNotificaitons />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "reports",
        element: <TrainerReports />,
      },
      {
        path: "projecttask",
        element: <ProjectTask />,
      },
    ],
  },
];
