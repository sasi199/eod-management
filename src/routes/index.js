const express = require("express");
const router = express.Router();
const adminRouter = require("../routes/adminRoute");
const superAdmin = require("../routes/superAdminRoute");
const authRouter = require("../routes/authRoute");



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
//   {
//     path: "/deliveryPerson",
//     route: deliveryPersonRouter,
//   },


];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;