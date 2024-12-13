const { default: status } = require("http-status");
const config = require("../config/config");
const { AssignedBatchModel } = require("../models/assignedBatchesModel");
const AttendanceModel = require("../models/attendance");
const Auth = require("../models/authModel");
const StaffModel = require("../models/staffModel");
const TraineeModel = require("../models/traineeModel");
const ApiError = require("../utils/apiError");
const utils = require("../utils/utils");
const jwt = require('jsonwebtoken');



exports.loginByEmailAndLogId = async(req)=>{
    const { email, password, latitude,longitude,} = req.body
    const user = await Auth.findOne({email}).populate({
      path:'role',
      select:'roleName'
    });
    if (!user) {
        throw new ApiError(status.UNAUTHORIZED, {message:"Invalid credantials",status:false,});
      }

    
      const now = new Date();
      const startOfDay = utils.Currentdate();
      // const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      const workStart = new Date();
      workStart.setHours(10, 0, 0);
      const workEnd = new Date();
      workEnd.setHours(18, 30, 0);



      const isPasswordCorrect = await utils.comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new ApiError(status.BAD_REQUEST, {message:"Invalid password"});
      }

      const allowedDistance = 0.5;
      const isWithinRange = config.companyLocations.some(company=>{ 
        const distance = utils.haversinDistance(latitude, longitude, company.latitude, company.longitude);
        return distance <= allowedDistance;
      })

      if (!isWithinRange && user.hybrid !== "WFH" && user.hybrid !== "Online") {
        throw new ApiError(status.BAD_REQUEST,"Login denied. You are not within the allowed location range.");
        
      }   

      console.log("stata",startOfDay);
      // console.log("stata",endOfDay);
      

      let attendance = await AttendanceModel.findOne({
        user: user.accountId, 
        dateString: startOfDay
      });
      console.log("aaaaaaaa",attendance);
      

      if (attendance) {
        // Update existing attendance record
        attendance.checkIn = now;
        attendance.status = workStart > now ? "Late" : "Present";
        attendance.islate = now > workStart;
        attendance.location = { latitude, longitude };
        await attendance.save();
      } 

      const token = jwt.sign(
        {id:user._id, role:user.role},
        config.jwt.secret,
        // {expiresIn: config.jwt.accessExpirationMinutes}
      )

      return {token,role:user.role};
}

exports.createAttendance = async(req)=>{
  const todayDate = utils.Currentdate();


  const allEmployees = await Auth.find({ active: true, archive: false });
  if (!allEmployees || allEmployees.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No active employees found");
  }


  const existingAttendance = await AttendanceModel.find({date:todayDate});
  const existingUserIds = existingAttendance.map(att => att.user);

    // Step 3: Filter employees who don't have attendance recorded yet
    const employeesWithoutAttendance = allEmployees.filter(
      employee => !existingUserIds.includes(employee._id)
    );


    const attendanceData = employeesWithoutAttendance.map(employee => ({
      dateString: todayDate,
      checkIn: null,
      checkOut: null,
      user: employee._id,
      location: { latitude: 0, longitude: 0 },
      status: 'Absent',
      islate: false,
      isApprovedLeave: false,
      isApprovedPermission: false,
      isApprovedCompoff: false,
      modifiedBy: null
    }));

    if (attendanceData.length > 0) {
      await AttendanceModel.insertMany(attendanceData);
      return { message: "Default attendance created for employees", count: attendanceData.length };
    }

}

exports.getAttendance = async(req)=>{
  const attendance = await AttendanceModel.find().populate({
    path:'user',
    select:'fullName profilePic',
    populate:{
      path:'role',
      model:'Role',
      select:'name'
    }
  });

  console.log(attendance,"aljalkjljal");
  

  if (!attendance) {
    throw new ApiError(status.BAD_REQUEST, {message:"Attendance not found password"});
  }

  return attendance;
}

exports.getTraineeAttendance = async(req)=>{
  const { accountId } = req

  const assignedBatches = await AssignedBatchModel.find({ trainer: accountId }).select('batchId');
    if (!assignedBatches || assignedBatches.length === 0) {
        throw new ApiError(status.NOT_FOUND, { message: "No batches assigned to this trainer" });
    }

    console.log(assignedBatches,"aaaaaaaaaa");

    const batchIds = assignedBatches.map(batch => batch.batchId);

    const trainees = await TraineeModel.find({batch:{$in:batchIds}}).select('_id');
    if (!trainees || trainees.length === 0) {
      throw new ApiError(status.BAD_REQUEST, {message:"Trainee not found"});
    }
    console.log(trainees,"ddddddddd");
    
    const traineeIds = trainees.map(trainee => trainee._id);

    const authAccounts = await Auth.find({
      accountId: { $in: traineeIds },
  }).select('accountId');
  
  const authAccountIds = authAccounts.map(account => account._id);

  const traineeAttendance = await AttendanceModel.find({
    'user': {$in: authAccountIds},
  }).populate({
    path: 'user',
    select: 'fullName profilePic role',
  })

  console.log(traineeAttendance,"lalalalalla");
  

  if (!traineeAttendance || traineeAttendance.length === 0) {
    throw new ApiError(status.BAD_REQUEST, {message:"No attendance records found for these trainees"});
  }

  return traineeAttendance;
}


exports.editTraineeAttendance = async(req)=>{
  const { date, status, } = req.body;
  const { _id } = req.params;
  const { accountId } = req;

  const trainer = await StaffModel.findOne({ _id: accountId, isTrainer:true});
    if (!trainer) {
        throw new ApiError(status.FORBIDDEN, { message: "Only trainers can modify attendance" });
    }

    const attendance = await AttendanceModel.findById({ _id:_id, date });
    if (!attendance) {
        throw new ApiError(status.NOT_FOUND, { message: "Attendance record not found for the given trainee and date" });
    }

    if (status) attendance.status = status;
    attendance.modifiedBy = trainer;

    await attendance.save();

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
    throw new ApiError(status.BAD_REQUEST, {message:"No attendance record found for today."});
  }

  if (attendance.checkOut) {
    throw new ApiError(status.BAD_REQUEST, {message:"User has already logged out."});
  }

  attendance.checkOut = now;
  await attendance.save();

  return { message: "Logout time recorded successfully." };
};


exports.authCreation = async(req)=>{
    const { email,logId,password,role,profilePic} = req.body
    let auth = await Auth.findOne({email});
    if (auth) {
        throw new ApiError(status.BAD_REQUEST, {message:"User already exist",status:false,field:"email"});
    }

    
  // if (!userRole.includes(role)) {
  //   throw new ApiError(status.BAD_REQUEST, "Invalid user role");
  // }

  const validRoles = ["SuperAdmin","Admin","Trainer","Trainee"];
  if (!validRoles.includes(role)) {
    throw new ApiError(status.BAD_REQUEST, "Invalid user role");
  }

  const hashedPassword = await utils.hashPassword(password)

    const newAuth = await Auth.create({
        ...req.body,
        password: hashedPassword,
    })

    newAuth.accountId = newAuth._id;

    await newAuth.save();
    return newAuth;
}


exports.authUpdate = async(req) =>{
    const { id } = req.params
    const {userId, role, ...updateData } = req.body;

    const user = await Auth.findById(id);
    
    if (!user) {
    throw new ApiError(status.NOT_FOUND, { message: "User not found", status: false });
  }
    

    let authUpdate = await Auth.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return authUpdate
}


