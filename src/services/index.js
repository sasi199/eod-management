import interceptors from "../interceptors/axios";

export const functionName = async () => {
  const res = await interceptors.get("/end/point");
  return res;
};

//login

export const login = async (data) => {
  const res = await interceptors.post("/auth/login", data);
  return res;
};

//logout

export const logout = async () => {
  const res = await interceptors.post("/auth/logOut");
  return res;
};

//report

export const replyReport = async (id,data)=>{
  const res = await interceptors.post(`/report/replayReport/${id}`,data)
  return res;
}


//staffs

//add staffs

export const AddStaffs = async (staffData) => {
  const res = await interceptors.post("/staff/createStaff", staffData);
  return res;
};

//get staffs


export const AllStaffs = async () => {
  const res = await interceptors.get("/staff/getStaffAll");
  return res;
};
export const staffId = async (id) => {
  const res = await interceptors.get(`/staff/getStaff/${id}`);
  return res;
};
//edit staffs

export const EditStaffs = async (id, data) => {
  const res = await interceptors.put(`/staff/editStaff/${id}`, data);
  return res;
};

export const DeleteStaffs = async (id) => {
  const res = await interceptors.delete(`/staff/deleteStaff/${id}`);
  return res;
};

//batches

//add Batches
export const AddBatches = async (data) => {
  const res = await interceptors.post("/batch/createBatch", data);
  return res;
};

//Get Batches

export const GetBatches = async () => {
  const res = await interceptors.get("/batch/getBatchAll");
  return res;
};

//Edit batches

export const EditBatches = async (id, data) => {
  const res = await interceptors.put(`/batch/editBatch/${id}`, data);
  return res;
};

//delete Batches

export const DeleteBatches = async (id) => {
  const res = await interceptors.delete(`/batch/deleteBatch/${id}`);
  return res;
};

//superAdmin Attendance

export const GetAttendance = async () => {
  const res = await interceptors.get("/auth/getAttendance");
  return res;
};

//add Trainee

export const AddTrainee = async (data) => {
  const res = await interceptors.post("/trainee/createTrainee", data);
  return res;
};

//get trainee

export const GetTrainee = async () => {
  const res = await interceptors.get("/trainee/getTraineeAll");
  return res;
};
export const EditTrainee = async (id,data) => {
  const res = await interceptors.put(`/trainee/editTrainee/${id}`, data);
  return res;
};
export const DeleteTrainee = async (id) => {
  const res = await interceptors.delete(`/trainee/deleteTrainee/${id}`);
  return res;
};

// courses

export const CreateSyllabus = async (data) => {
  const res = await interceptors.post("/syllabus/createSyllabus", data);
  return res;
};

export const GetSyllabus = async () => {
  const res = await interceptors.get("/syllabus/getSyllabusAll");
  return res;
};
export const GetSyllabusId = async (id) => {
  const res = await interceptors.get(`/syllabus/getSyllabusAll/${id}`);
  return res;
};

export const EditSyllabus = async (id, data) => {
  const res = await interceptors.put(`/syllabus/editSyllabus/${id}`, data);
  return res;
};

export const DeleteSyllabus = async (id) => {
  const res = await interceptors.delete(`/syllabus/deleteSyllabus/${id}`);
  return res;
};

// assessment

export const CreateAssessment = async (data) => {
  const res = await interceptors.post("/assessment/createAssessment", data);
  return res;
};

export const GetAssessment = async () => {
  const res = await interceptors.get("/assessment/getAssessmentAll");
  return res;
};

export const GetAssessmentId = async (id) => {
  const res = await interceptors.get(`/assessment/getAssessmentAll/${id}`);
  return res;
};

export const EditAssessment = async (id, data) => {
  const res = await interceptors.put(`/assessment/editAssessment/${id}`, data);
  return res;
};

export const DeleteAssessment = async (id) => {
  const res = await interceptors.delete(`/assessment/deleteAssessment/${id}`);
  return res;
};

// Project
export const CreateProject = async (data) => {
  const res = await interceptors.post("/project/createProject",data);
  return res;
};

export const GetProjects = async () => {
  const res = await interceptors.get("/project/getProjectAll");
  return res;
};

export const GetProjectById = async (id) => {
  const res = await interceptors.get(`/project/getProjectId/:${id}`);
  return res;
}

export const EditProjectId = async (data,_id) => {
  console.log("data",data,_id)
  const res = await interceptors.put(`/project/editProject/${_id}`, data);
  return res;
};
export const DeleteProject = async (_id) => {
  const res = await interceptors.delete(`/project/deleteProject/${_id}`);
  return res;
};

// report
export const CreateReport = async (data) => {
  const res = await interceptors.post("/report/createReport", data);
  return res;
};

export const GetReportAll = async () => {
  const res = await interceptors.get("/report/getReportAll");
  return res;
};
export const GetReportId = async () => {
  const res = await interceptors.get("/report/getReportId");
  return res;
};

export const EditReport = async(id,data)=>{
  const res = await interceptors.put(`report/editReport/${id}`,data);
  return res;
}

export const DeleteReport = async(id)=>{
  const res = await interceptors.delete(`report/deleteReport/${id}`);
  return res;
}
//Staff filter

export const GetStaffFilter = async() => {
  const res = await interceptors.get(`/staff/getFilterStaff`);
  return res; 
}


//task

export const CreateTask = async (data) => {
  console.log("routes data", data)
  const res = await interceptors.post(`/task/createTask`,data);
  return res;
}

export const GetTasksAll = async () => {
  const res = await interceptors.get(`/task/getTaskAll`);
  return res;
}

export const GetTaskById = async (taskId) => {
  const res = await interceptors.get(`/task/getTaskId/${taskId}`);
  return res;
}

export const GetTaskByProjectId = async (projectId) => {
  const res = await interceptors.get(`/project/getTaskById/${projectId}`);
  return res;  
}

export const EditTaskById = async (data,taskId) => {
  const res = await interceptors.put(`/task/editTask/${taskId}`,data);
  return res;  
}

export const DeleteTaskById = async (taskId) => {
  const res = await interceptors.delete(`/task/deleteTask/${taskId}`);
  return res;  
}


//traineeTask or batch task

export const createStudentTask = async (data)=>{
  const res= await interceptors.post('/traineeTask/createTraineeTask',data);
  return res;
}

export const GetAllStudentTask = async ()=>{
  const res= await interceptors.get('/traineeTask/getTraineeTaskAll');
  return res;
}

export const GetStudentTaskById = async ()=>{
  const res= await interceptors.get(`traineeTask/getTraineeTaskId`);
  return res;
}

export const UpdateStudentTaskById = async (data,taskId)=>{
  const res= await interceptors.put(`traineeTask/editTraineeTask/${taskId}`,data);
  return res;
}

export const GetStudentTask = async ()=>{
  const res= await interceptors.get(`traineeTask/getTraineeTask`);
  return res;
}

export const UpdateStudentStatusById = async (taskId)=>{
  const res= await interceptors.put(`traineeTask/updateTraineeStatus/${taskId}`);
  return res;
}




//scuhdule

export const createSchedule = async (data)=>{
  const res= await interceptors.post('/schedule/createSchedule',data);
  return res;
}

export const getSchedule = async ()=>{
  const res = await interceptors.get("/schedule/getScheduleAll")
  return res;
}
