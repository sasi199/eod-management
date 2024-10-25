const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");
const {AdminModel} = require("../models/adminModel");
const validator = require('validator');


const generateAdminLogId = async () => {
   // Find the last created admin based on the logId in descending order
   const lastAdmin = await AdminModel.findOne().sort({ logId: -1 });

   let newLogId;
   if (lastAdmin && lastAdmin.logId) {
       // Extract the numeric part from the last logId
       const lastLogIdNumber = parseInt(lastAdmin.logId.split('-')[2], 10);

       // Increment the numeric part by 1 and pad it to ensure it's 3 digits
       const newLogIdNumber = (lastLogIdNumber + 1).toString().padStart(3, '0');

       // Generate the new logId with the incremented number
       newLogId = `ADM-ID-${newLogIdNumber}`;
   }

   return newLogId;
};



exports.adminLogin = async(req)=>{
   const { email, password } = req.body;

   const admin = await AdminModel.findOne({email})
   if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid Email",status:false,field:"email"});
    
   }

   const isPasswordCorrect = await utils.comparePassword(password, admin.password);
   if (isPasswordCorrect) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid password"});
   }
   return admin;
}


exports.createAdmin = async(req)=>{
   const { email,userName} = req.body;
   console.log(req.body,"llllll");

   const existingAdmin = await AdminModel.findOne({email})
   if (existingAdmin) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message:"Admin already exist"});
   }

   if (req.role !== 'superAdmin') {
      throw new ApiError(httpStatus.FORBIDDEN, { message: "Only super admins can create an admin" });
    }    

    if (!email) {
      throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email" });
    }

  let imageFile;
  if (req.file) {
   imageFile = await uploadFileToS3(req.file);
  }

  const logId = await generateAdminLogId();

  const newAdmin = new AdminModel({
   ...req.body,
   logId,
   imageFile
  })

  await newAdmin.save();
  return newAdmin;
  
}



