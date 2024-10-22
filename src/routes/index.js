const express = require("express");
const router = express.Router();
const adminRouter = require("../routes/adminRoute");



const Routes = [
  {
    path: "/admin",
    route: adminRouter,
  },
//   {
//     path: "/user",
//     route: userRouter,
//   },
//   {
//     path: "/deliveryPerson",
//     route: deliveryPersonRouter,
//   },


];

Routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;