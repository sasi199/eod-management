const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");
const {AdminModel} = require("../models/adminModel");
const validator = require('validator');
const Auth = require("../models/authModel");
const config = require("../config/config");
const uploadCloud = require("../utils/uploadCloud");
const { Amplify } = require("aws-sdk");


const generateAdminLogId = async () => {
   // Find the last created admin based on the logId in descending order
   const lastAdmin = await AdminModel.findOne().sort({ logId: -1 });
   const lostLogIdNumber = lastAdmin ? parseInt(lastAdmin.logId.split('-')[2],10) : 0;
   const newLogIdNumber = (lostLogIdNumber + 1).toString().padStart(3, '0');

   return `ADM-ID-${newLogIdNumber}`
};


//ignore this adminlogin

// exports.adminLogin = async(req)=>{
//    const { email, logId} = req.body;

//    const admin = await Auth.findOne({email, logId, role:'admin'})
//    if (!admin) {
//     throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid Email",status:false,field:"email"});
    
//    }

//    const token = jwt.sign(
//       {id:admin._id, logId, role:admin.role},
//       config.jwt.secret,
//       {expiresIn: config.jwt.expiresIn}
//    )
   
   
//    return {admin, token};
// }


exports.createAdmin = async(req)=>{
   const { email,fullName, role} = req.body;
   console.log(req.body);
   

   const existingAdmin = await AdminModel.findOne({email})
   if (existingAdmin) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message:"Admin already exist"});
   }

   if (req.user.role !== 'superAdmin') {
      throw new ApiError(httpStatus.FORBIDDEN, { message: "Only super admins can create an admin" });
    }    

    if (!validator.isEmail(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email"});
    }

//   if (req.file) {
//    req.body.imageFile = uploadCloud('adminProfile',req.file)
//   }

  let profilePic;
   if (req.file) {
      profilePic = await uploadCloud('adminProfile', req.file);
      
   }


  const logId = await generateAdminLogId();

  const newAdmin = new AdminModel({
   ...req.body,
   logId,
   profilePic
  })

  const newAuth = new Auth({
   adminId:newAdmin._id,
   email,
   logId,
   role
  })

  await newAdmin.save();
  await newAuth.save();

  return newAdmin;
  
}


exports.getAdminAll = async(req)=> {
   const Admin = await AdminModel.find({})
   if (!Admin) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message:"Admin not found"});
   }

   return Admin;
}


exports.getAdminById = async(req)=>{
   const {authId} = req._id
   const {adminId} = req.user;
   

   if (!adminId) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message:"Admin Id required"});
   }

   const admin = await AdminModel.findById(adminId)

   if (!admin) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message: "Admin not Found"});
   }

   return admin;
}



exports.editAdmin = async(req)=>{
   const {authId} = req._id
   const {adminId} = req.user
   if (!adminId) {
      throw new ApiError(httpStatus.BAD_REQUEST,{message: "Admin id required"});
   }

   const admin = await AdminModel.findById(adminId);
   if (!admin) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message: "Admin not found"});
   }

   const updateData = {...req.body}
   // console.log(updateData,"eeeeee");
   

   if (req.file) {
      const profilePic = await uploadCloud('adminProfile',req.file);
      updateData.profilePic = profilePic;
   }

   const updateAdmin = await AdminModel.findByIdAndUpdate(adminId,updateData,
      { new:true, runValidators:true});

   const updateAuth = await Auth.findByIdAndUpdate(authId,updateData,
      {new:true, runValidators: true}
   )   

      return updateAdmin;
}


exports.deleteAdmin = async(req)=>{
   const {authId} = req._id
   const {adminId} = req.user
   if (!adminId) {
      throw new ApiError(httpStatus.BAD_REQUEST,{message: "Admin id required"});
   }

   const admin = AdminModel.findById(adminId)
   const auth = Auth.findById(authId)
   if (!admin) {
      throw new ApiError(httpStatus.BAD_REQUEST,{message: "Admin not found"});
   }

   if (!auth) {
      throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
   }

   await AdminModel.findByIdAndDelete(adminId);
   await Auth.findByIdAndDelete(authId);

}
