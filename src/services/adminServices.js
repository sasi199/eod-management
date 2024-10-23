const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");
const {AdminModel} = require("../models/adminModel");


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
   const {Body}  = req.body;
   console.log(Body,"body");
   

   if (req.role !== 'superAdmin') {
      throw new ApiError(httpStatus.FORBIDDEN, { message: "Only super admins can create an admin" });
    }    

   if (!validator.isEmail(Body.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, {message:"Provide email"});      
  }

  if (Body.password.length < 8) {
     throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid password"});
  }

  const imageFile = req.file
  if (imageFile) {
   throw new ApiError(httpStatus.BAD_REQUEST, {message:"No upload file"});
  }

  const existingAdmin = await AdminModel.findOne({email})
  if (existingAdmin) {
   throw new ApiError(httpStatus.BAD_REQUEST, {message:"Admin already exist"});
  }

  const logId = await generateAdminLogId();

  const newAdmin = new AdminModel({
   ...Body,
   logId,
   imageFile
  })

  await newAdmin.save();
  return newAdmin;
  
}



