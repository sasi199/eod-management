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
import EOD from "../Panel/SuperAdmin/Pages/Task/EOD";
import Course from "../Panel/SuperAdmin/Pages/Course/Course";
import TraineeTask from "../Panel/Trainer/Pages/Task/Task";
import TrainerTask from "../Panel/Trainer/Pages/Task/Task";
import ProjectTask from "../Panel/Trainer/Pages/Task/ProjectTask";

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
        path: "trainer",
        element: <Trainer />,
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
        path: "task/eod",
        element: <EOD />,
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
        path: "attendance",
        element: <Attendance />,
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
        path: "syllabus",
        element: <TrainerSyllabus />,
      },
      // {
      //   path: "notifications",
      //   element: <TraineeNotificaitons />,
      // },
      {
        path: "assessment",
        element: <TrainerAssessment />,
      },
      {
        path: "attendance",
        element: <TrainerAttendace />,
      },
      // {
      //   path: "attendance/create",
      //   element: <CreatePage />,
      // },
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
