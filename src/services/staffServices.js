const StaffModel = require("../models/staffModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const validator = require('validator');
const uploadCloud = require("../utils/uploadCloud");
const Auth = require("../models/authModel");
const utils = require("../utils/utils");
const { log } = require("winston");
const { DepartmentModel } = require("../models/department.model");
const { DesignationModel } = require("../models/designation.model");
const { RoleModel } = require("../models/role.model");
const { CompanyModel } = require("../models/company.model");


const generateStaffLogId = async(companyId,departmentId)=>{
    const company = await CompanyModel.findById(companyId).lean();
    if (!company || !company.companyCode) {
        throw new Error('Invalid or missing company details.');
    }

    const department = await DepartmentModel.findById(departmentId).lean();
    if (!department || !department.departmentCode) {
        throw new Error('Invalid or missing department details.');
    }

    const companyCode = company.companyCode;
    const departmentCode = department.departmentCode;

    const lastStaffMember = await StaffModel.findOne({ company_id:companyId,department_id:departmentId })
        .sort({ createdAt: -1 })
        .select('staffId')
        .lean();

    let newIdNumber = 1;
    if (lastStaffMember && lastStaffMember.logId) {
        const lastIdNumber = parseInt(lastStaffMember.logId.split('-')[2], 10);
        newIdNumber = lastIdNumber + 1;
    }

    const formattedId = String(newIdNumber).padStart(3, '0');
    return `${companyCode}-${departmentCode}-${formattedId}`;
}


exports.createStaff = async(req)=>{
    const staffData = req.body;

    if (!validator.isEmail(staffData.profetionalEmail)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email" });
    }

    const existingStaff = await StaffModel.findOne({profetionalEmail:staffData.profetionalEmail});
    if (existingStaff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Staff already exist"});  
    }

    if (!staffData) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "staffData is required" });
    }

    const company = await CompanyModel.findById({_id:staffData.company_id});
    console.log("al;lalala",company);
    
    if (!company) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"company not found"});  
    }

    const department = await DepartmentModel.findById({_id:staffData.department_id});
    console.log("al;lalala",department);
    
    if (!department) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"department not found"});  
    }

    const designation = await DesignationModel.findById({_id:staffData.designation});
    console.log("lalalala",designation);
    
    if (!designation) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"designation not found"});  
    }

    const role = await RoleModel.findById({_id:staffData.role});
    if (!role) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"role not found"});  
    }

    if (req.user.role !== 'SuperAdmin') {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Only super admin can create staff"});
        
    }

    if (!validator.isEmail(staffData.profetionalEmail)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email"});
      }

      const hashedPassword = await utils.hashPassword(staffData.password);

    let profilePic;
    if (req.file) {
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`
        profilePic = await uploadCloud(`staff-Profile/${fileName}`,req.file)
    }

    const staffId = await generateStaffLogId(staffData.company_id,staffData.department_id);

    const isTrainer = staffData.isTrainer;
    let isTrainerBoolean = false;
    if (role.name === 'Employee') {
        if (isTrainer !== 'Yes' && isTrainer !== 'No') {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "Invalid value for isTrainer. Use 'Yes' or 'No'." });
        }
        isTrainerBoolean = isTrainer === 'Yes';
    }


    const newStaff = new StaffModel({
        ...req.body,
        staffId,
        password: hashedPassword,
        profilePic,
        isTrainer: isTrainerBoolean
    })

    const newAuth = new Auth({
        accountId: newStaff._id,
        email: staffData.profetionalEmail,
        fullName: staffData.fullName,
        profilePic,
        logId:staffId,
        hybrid: staffData.hybrid,
        password: hashedPassword,
        role: staffData.role
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

exports.getFilterStaff = async(req)=>{
    const staff = await StaffModel.find({}).select('_id fullName role profilePic')
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

    if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Auth not found"});
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
    const {authId}= req;
    const {_id} = req.params;

    const staff = await StaffModel.findById(_id);
    console.log("adadda",staff);
    
    const auth = await Auth.findOne({accountId:_id});
    console.log("ggdsdsd",auth);
    

    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Staff not found"});
     }
  
     if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
     }

     await  StaffModel.findByIdAndDelete(_id);
     await Auth.findOneAndDelete();

}


exports.staffCount = async(req)=>{
    const staff = await StaffModel.countDocuments({});
    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainee not found"});
    }

    return staff;
}

exports.staffProfile = async (req)=>{
    const { accountId } = req;

    const staff = await  StaffModel.findById(accountId);

    if (!staff) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainee not found"});
    }

    return staff;
}