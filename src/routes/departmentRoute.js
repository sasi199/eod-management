const express = require('express');
const logger = require('../config/logger');
const departmentController = require('../controller/department.controller');

const departmentRouter = express.Router();

departmentRouter.use((req,res,next)=>{
    logger.info("Department route is being used");
    next();
})

departmentRouter.post('/create', departmentController.createDepartment);

departmentRouter.get('/get-all', departmentController.getAllDepartments);

departmentRouter.put('/update/:department_id', departmentController.updateDepartment);

departmentRouter.delete('/delete-h/:department_id', departmentController.deleteDepartment)

module.exports = {path:'/department', route: departmentRouter};