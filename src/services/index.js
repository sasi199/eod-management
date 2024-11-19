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