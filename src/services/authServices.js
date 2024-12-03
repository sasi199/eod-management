const config = require("../config/config");
const { AssignedBatchModel } = require("../models/assignedBatchesModel");
const AttendanceModel = require("../models/attendance");
const Auth = require("../models/authModel");
const ApiError = require("../utils/apiError");
const utils = require("../utils/utils");
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');



exports.loginByEmailAndLogId = async(req)=>{
    const { email, password, latitude,longitude,} = req.body
    const user = await Auth.findOne({email});
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, {message:"Invalid credantials",status:false,});
      }

      const today = new Date().toISOString().slice(0.10);
      const now = new Date();

      const workStart = new Date();
      workStart.setHours(10,0,0)
      const workEnd = new Date();
      workEnd.setHours(18,30,0)



      const isPasswordCorrect = await utils.comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid password"});
      }

      const allowedDistance = 0.5;
      const isWithinRange = config.companyLocations.some(company=>{ 
        const distance = utils.haversinDistance(latitude, longitude, company.latitude, company.longitude);
        return distance <= allowedDistance;
      })

      if (!isWithinRange && user.hybrid !== "WFH" && user.hybrid !== "Online") {
        throw new ApiError(httpStatus.BAD_REQUEST,"Login denied. You are not within the allowed location range.");
        
      }   

        const newAttendance = new AttendanceModel({
          user: user._id,
          date: today,
          checkIn: now,
          status: workStart > now ? "Late" : "Present",
          islate: now > workStart,
          location:{
            latitude: latitude,
            longitude: longitude,
          },
        })

      await newAttendance.save();

      

      const token = jwt.sign(
        {id:user._id, role:user.role},
        config.jwt.secret,
        // {expiresIn: config.jwt.accessExpirationMinutes}
      )

      return token;
}


exports.getAttendance = async(req)=>{
  const attendance = await AttendanceModel.find().populate({
    path:'user',
    select:'fullName profilePic role',
  });

  if (!attendance) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"Attendance not found password"});
  }

  return attendance;
}



exports.logoutUser = async (req) => {
  const { authId } = req;
  const now = new Date();

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const attendance = await AttendanceModel.findOne({
    user:authId,
    date: { $gte: startOfDay, $lte: endOfDay },
  })

  console.log(attendance,"atten");
  

  if (!attendance) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"No attendance record found for today."});
  }

  if (attendance.checkOut) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"User has already logged out."});
  }

  attendance.checkOut = now;
  await attendance.save();

  return { message: "Logout time recorded successfully." };
};


exports.authCreation = async(req)=>{
    const { email,logId,password,role,profilePic} = req.body
    let auth = await Auth.findOne({email});
    if (auth) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"User already exist",status:false,field:"email"});
    }

    
  // if (!userRole.includes(role)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role");
  // }

  const validRoles = ["SuperAdmin","Admin","Trainer","Trainee"];
  if (!validRoles.includes(role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  const hashedPassword = await utils.hashPassword(password)

    const newAuth = await Auth.create({
        ...req.body,
        password: hashedPassword
    })
    await newAuth.save();
    return newAuth;
}


exports.authUpdate = async(req) =>{
    const { id } = req.params
    const {userId, role, ...updateData } = req.body;

    const user = await Auth.findById(id);
    
    if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "User not found", status: false });
  }
    

    let authUpdate = await Auth.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return authUpdate
}


