const express = require('express');
const logger = require('../config/logger');
const designationController = require('../controller/designation.controller');

const designationRouter = express.Router();

designationRouter.use((req,res,next)=>{
    logger.info("Designation route is being used");
    next();
})

designationRouter.post('/create', designationController.createDesignation);

designationRouter.get('/get-all', designationController.getAllDesignations);

designationRouter.put('/update/:designation_id', designationController.updateDesignation);

designationRouter.delete('/delete', designationController.deleteDesignation);


module.exports = {path:'/designation', route:designationRouter}