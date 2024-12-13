const express = require('express');
const RoleController = require('../controller/role.controller');
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();

Router.post('/create', RoleController.createRole);
Router.get('/get-all', RoleController.getAllRoles);
Router.put('/update/:role_id', RoleController.updateRole);
Router.delete('/delete-h/:role_id', RoleController.deleteRole);

module.exports = Router