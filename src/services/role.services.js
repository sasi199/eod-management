const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { RoleModel } = require("../models/role.model");
const { allPermissions, permissionGroups } = require("../config/permissions");

exports.createRole = async(req)=>{
    const {roleName,hierarchyLevel} = req.body;
    console.log(req.body);

    if(!roleName){
        throw new ApiError(status.BAD_REQUEST,'Please provide a name for role');
    }
    if(!hierarchyLevel){
        throw new ApiError(status.BAD_REQUEST,'Please provide a hierarchy level for role');
    }
    const createdRole = await RoleModel.create(req.body);

    if(!createdRole){
        throw new ApiError(status.INTERNAL_SERVER_ERROR,'Failed to create role');
    }
    return createdRole;
}

exports.getAllRoles = async (req)=>{
    const {p} = req.query;
    let roles = await RoleModel.find({active:true});

    if(roles.length<1){
        throw new ApiError(status.NOT_FOUND,'No roles found');
    }

    if(p){
        return {roles,permissions:allPermissions, permissionGroups}
    }

    return roles;
}

exports.getRoleById = async(req)=>{
    const {user} = req;
    
}

exports.updateRole = async (req)=>{
    const {roleName} = req.body;
    const {role_id} = req.params;

    if(roleName){
       const role = await RoleModel.findOne({_id: {$ne: role_id}, roleName: roleName,active:true});
        if(role){
            throw new ApiError(status.BAD_REQUEST,`Role name ( ${roleName} ) already exist`);
        }
    }
    const updatedRole = await RoleModel.findByIdAndUpdate(role_id,req.body,{new:true});

    if(!updatedRole){
        throw new ApiError(status.INTERNAL_SERVER_ERROR,'Failed to update role');
    }

    return updatedRole;
}

exports.deleteRole = async (req)=>{
    const {role_id} = req.params;

    const isExist = await RoleModel.exists({_id:role_id});

    if(!isExist){
        throw new ApiError(status.NOT_FOUND,'Role not found');
    }

    const deletedRole = await RoleModel.findByIdAndUpdate(role_id,{active:false,isArchive:true},{new:true});

    if(!deletedRole){
        throw new ApiError(status.INTERNAL_SERVER_ERROR,'Failed to delete role');
    }

    return deletedRole;
}