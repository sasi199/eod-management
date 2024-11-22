import interceptors from "../interceptors/axios";

export const functionName = async () => {
  const res = await interceptors.get("/end/point");
  return res;
};

//login 

export const login = async (data)=>{
  const res = await interceptors.post("/v1/auth/login",data);
  return res;
}

//logout

export const logout = async ()=>{
  const res = await interceptors.post("/v1/auth/logOut",)
return res;
}

//staffs

//add staffs

export const AddStaffs = async (staffData)=>{
  const res = await interceptors.post("/v1/staff/createStaff",staffData);
  return res;
}

//get staffs

export const AllStaffs = async () =>{
  const res = await interceptors.get("/v1/staff/getStaffAll");
  return res;
}

//edit staffs

export const EditStaffs = async (id , data) =>{
  const res= await interceptors.put(`/v1/staff/editStaff/${id}`,data)
  return res;
}


//batches

//add Batches
export const AddBatches= async (data)=>{
  const res = await interceptors.post('/v1/batch/createBatch',data)
return res;
}

//Get Batches

export const GetBatches = async ()=>{
  const res= await interceptors.get('/v1/batch/getBatchAll')
  return res;
}

//Edit batches

export const EditBatches= async  (id,data)=>{
  const res= await interceptors.put(`/v1/batch/editBatch/${id}`,data)
  return res;
}

//delete Batches

export const DeleteBatches = async (id)=>{
  const res = await interceptors.delete(`/v1/batch/deleteBatch/${id}`)
  return res;
}


//superAdmin Attendance

export const GetAttendance= async ()=>{
  const res =await interceptors.get('/v1/auth/getAttendance')
  return res;
}



//add Trainee

export const AddTrainee= async (data)=>{
  const res = await interceptors.post('/v1/trainee/createTrainee',data)
  return res;
}

//get trainee

export const GetTrainee = async ()=>{
  const res = await interceptors.get('/v1/trainee/getTraineeAll')
  return res;
}