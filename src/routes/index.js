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
const eodRouter = require("../routes/eodRoute");
const leaveRouter = require("../routes/leaveRoute");
const { requireAll } = require("../utils/requireAll");
const roleRouter = require('./roleRoute');
const { path } = require("./roleRoute");
const AllRoutes = requireAll('./**.{js,ts}')

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
  {
    path: "/eod",
    route: eodRouter,
  },
  {
    path: "/leave",
    route: leaveRouter,
  },
  {
    path: "/role",
    route: roleRouter,
  },
];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

for (const routeFileName in AllRoutes) {
  if(routeFileName !== 'index'){
    if (Object.prototype.hasOwnProperty.call(AllRoutes, routeFileName)) {
     const {path,route} = AllRoutes[routeFileName];
      if(path && route){
        router.use(path, route)
        console.log("Route Created for ",path);
      }
    }
  }
}

module.exports = router;