const StaffModel = require("../models/staffModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const validator = require('validator');
const uploadCloud = require("../utils/uploadCloud");
const Auth = require("../models/authModel");
const utils = require("../utils/utils");


const generateStaffLogId = async(role)=>{
    const rolePrefixMap = {
        Admin: 'ADM',
        HR: 'HR',
        Coordinator: 'CDR',
        Employee: 'EMP'
    };

    const prefix = rolePrefixMap[role]
    const lastStaffMember = await StaffModel.findOne({role})
    .sort({createdAt: -1})
    .select('logId')
    .lean();

    let newIdNumber = 1;
    if (lastStaffMember && lastStaffMember.logId) {
        const lastIdNumber = parseInt(lastStaffMember.logId.split('-')[2],10);
        newIdNumber = lastIdNumber +1
    }

    const formattedId = String(newIdNumber).padStart(3,'0')
    return `${prefix}-ID-${formattedId}`
}


exports.createStaff = async(req)=>{
    const {email, fullName , role, password, hybrid} = req.body

    const existingStaff = await StaffModel.findOne({email});
    if (existingStaff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Staff already exist"});  
    }

    if (req.user.role !== 'SuperAdmin') {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Only super admin can create staff"});
        
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email"});
      }

      const hashedPassword = await utils.hashPassword(password);

    let profilePic;
    if (req.file) {
         profilePic = await uploadCloud('staff-Profile',req.file)
    }

    const logId = await generateStaffLogId(role);

    const newStaff = new StaffModel({
        ...req.body,
        logId,
        password: hashedPassword,
        profilePic
    })

    const newAuth = new Auth({
        staffId: newStaff._id,
        email,
        logId,
        hybrid,
        password:hashedPassword,
        role
    })

    await newStaff.save();
    await newAuth.save();

    return newStaff;
}