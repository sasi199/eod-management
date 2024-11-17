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

//add staffs

export const AddStaffs = async (staffData)=>{
  const res = await interceptors.post("/v1/staff/createStaff",staffData);
  return res;
}