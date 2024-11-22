const StaffModel = require("../models/staffModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const validator = require('validator');
const uploadCloud = require("../utils/uploadCloud");
const Auth = require("../models/authModel");
const utils = require("../utils/utils");
const { log } = require("winston");


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
    const {email, fullName , role, password, hybrid, isTrainer} = req.body

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
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`
        profilePic = await uploadCloud(`staff-Profile/${fileName}`,req.file)
    }

    const logId = await generateStaffLogId(role);

    const isTrainerBoolean = role === 'Employee' && isTrainer === 'Yes';
    if (role === 'Employee' && isTrainer !== 'Yes' && isTrainer !== 'No') {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Invalid value for isTrainer. Use 'Yes' or 'No'." });
    }


    const newStaff = new StaffModel({
        ...req.body,
        logId,
        password: hashedPassword,
        profilePic,
        isTrainer:isTrainerBoolean
    })

    const newAuth = new Auth({
        accountId: newStaff._id,
        email,
        fullName,
        profilePic,
        logId,
        hybrid,
        password:hashedPassword,
        role
    })

    await newStaff.save();
    await newAuth.save();

    return newStaff;
}


exports.getStaffAll = async(req)=>{
    const staff = await StaffModel.find({})
    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Staff not found"});
     }
  
     return staff;
}

exports.getStaffId = async(req)=>{
    const {authId} = req
    console.log(authId,"pppppppp");
    
    const { _id } = req.params;
    console.log(_id,"mmmmm");
    

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Staff Id required"});
     }

     const staff = await StaffModel.findById(_id)
     console.log(staff,"ssssssssss");
     

     if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Staff not Found"});
     }
  
     return staff;
}


exports.editStaff = async(req)=>{
    const { authId } = req
    
    const { _id } = req.params;
    const staff = await StaffModel.findById(_id);
    const auth = await Auth.findOne({accountId:_id});

    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Staff not found"});
    }

    const updateData = {...req.body}
    if(req.file){
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${_id}-${Date.now()}.${fileExtension}`
        const profilePic = await uploadCloud(`staff-Profile${fileName}`,req.file)
        updateData.profilePic = profilePic;
    }

    const updateAuth = await Auth.findOneAndUpdate({accountId: _id}, updateData, {
        new: true,
        runValidators: true
    });

    const updateStaff = await StaffModel.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true
    });

        return updateStaff;
}

exports.deleteStaff = async(req)=>{
    const {authId}= req._id;
    const {staffId} = req.user;

    const staff = await StaffModel.findById(staffId);
    const auth = await Auth.findById(authId);

    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Admin not found"});
     }
  
     if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
     }

     await  StaffModel.findByIdAndDelete();
     await Auth.findByIdAndDelete();

}