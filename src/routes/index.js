const express = require("express");
const router = express.Router();
const adminRouter = require("../routes/adminRoute");
const superAdmin = require("../routes/superAdminRoute");
const authRouter = require("../routes/authRoute");
const trainerRouter = require("../routes/trainerRoute");
const staffRouter = require("../routes/staffRoute");
const traineeRouter = require("../routes/traineeRoute");
const batchRouter = require("../routes/batchRoute");
const taskRouter = require("../routes/taskRoute");
const scheduleRouter = require("../routes/scheduleRoute");
const assessmentRouter = require("../routes/assessmentRoute");
const reportRouter = require("../routes/reportRoute");
const projectRouter = require("../routes/projectRoute");
const syllabusRouter = require("../routes/syllabusRoute");
const chatRouter = require("../routes/chatRoute");
const traineeTaskRouter = require("../routes/traineeTaskRoute");
const studentAttendanceRouter = require("../routes/studentAttendanceRoute");



const Routes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/superAdmin",
    route: superAdmin,
  },
  {
    path: "/trainer",
    route: trainerRouter,
  },
  {
    path: "/staff",
    route: staffRouter,
  },
  {
    path: "/trainee",
    route: traineeRouter,
  },
  {
    path: "/batch",
    route: batchRouter,
  },
  {
    path: "/task",
    route: taskRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
  {
    path: "/assessment",
    route: assessmentRouter,
  },
  {
    path: "/report",
    route: reportRouter,
  },
  {
    path: "/project",
    route: projectRouter,
  },
  {
    path: "/syllabus",
    route: syllabusRouter,
  },
  {
    path: "/chat",
    route: chatRouter,
  },
  {
    path: "/traineeTask",
    route: traineeTaskRouter,
  },
  {
    path: "/studentAttendance",
    route: studentAttendanceRouter,
  },


];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;