import Modal from 'antd/es/modal/Modal';
import React, { useEffect, useState } from 'react';
import { CreateProject, DeleteProject, EditProjectId, GetProjects } from '../../../../services';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { FaDeleteLeft, FaFolderOpen } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
// import ProjectTask from './ProjectTask';
import { useDispatch } from 'react-redux';
import { setProjectId, setProjectTitle} from '../../../../Redux/TrainerRedux';
import { store } from '../../../../Redux/Store';

const Task = () => {

  const projectInitialState = {
    projectName:""
  };

  const[isModalVisible, setIsModalVisible]=useState(false);//project modal
  const[isEditModalVisible, setIsEditModalVisible]=useState(false);//project modal
  const[projectName, setProjectName]=useState(projectInitialState);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [isDeleteModalVisible, setisDeleteModalVisible] = useState(false);
  

  const location = useLocation();
  let isProjectDataFetched = false;

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleProjectId = (project) => {
   const projectTitle = project.projectName
  //  console.log("projectId", project._id)
    dispatch(setProjectId(project._id));
    dispatch(setProjectTitle(project.projectName));
    console.log("Updated projectId in Redux:", store.getState().trainer.projectId);
  console.log("Updated projectTitle in Redux:", store.getState().trainer.projectTitle);
    // navigate(`projecttask/${projectTitle}`);
  }

   //project fetch 
   const fetchProjects = () => {

    console.warn("location",location.pathname)
    GetProjects()
    .then((res)=>{
      setProjectData(res.data.data);
      isProjectDataFetched = true;
      console.log("fetch project",res)
    }).catch((err)=>{
      message.error(error?.response?.data?.message ||"Failed to list project")

    })
  }

  //project create
  const handleOk = () => {
    console.log('Project add:', projectName);
    // console.log('Selected Members:', selectedMembers);
    CreateProject( projectName)
    .then((res)=>{
      if(res.data.status){
       message.success("Project added successfully");
       setProjectName(projectInitialState);
      setIsModalVisible(false);
      fetchProjects();
      } 
    }). catch ((error)=>{
      message.error(error?.response?.data?.message ||"Failed to add project")
    })
   
  };

  //project edit 
  const handleEditOk = () => {
    console.log('Project edit:', projectName,selectedProject._id);
    // console.log('Selected Members:', selectedMembers);
    EditProjectId({...projectName},selectedProject._id)
    .then((res)=>{
      if(res.data.status){
       message.success("Project updated successfully");
       setProjectName(projectInitialState);
      setIsEditModalVisible(false);
      fetchProjects();
      } 
    }). catch ((error)=>{
      message.error(error?.response?.data?.message ||"Failed to update project")
    })
   
  };

  //project delete
  const handleDeleteOk = () => {
     DeleteProject(selectedProject._id).
    then((res)=>{
      if(res.data?.status){
        setisDeleteModalVisible(false);
        message.success("Project deleted successfully");
        fetchProjects();
      }
    })
    .catch((error)=>{
      console.log(error)
      message.error(error?.response?.data?.message ||"Failed to delete project")
    })
  }

  const handleEditProject = (project) =>{
    setSelectedProject(project);
    setIsEditModalVisible(true);
    setProjectName({projectName:project.projectName});
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setisDeleteModalVisible(true);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setProjectName(projectInitialState);
    
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setProjectName(projectInitialState);
    setSelectedProject(null);
  }
  
const handleDeleteCancel = () => {
  setisDeleteModalVisible(false);
  setSelectedProject(null);
}



  useEffect(()=>{


  if(location.pathname = '/trainersidebar/task' && !isProjectDataFetched){
    
    fetchProjects();
  }

  },[location.pathname])


  const convertToIST = (utcDate) =>{
    const date = new Date(utcDate);
    const options = {
      timeZone:"Asia/Kolkata",
      year:"numeric",
      month:"long",
      day:"numeric",
      hour:"numeric",
      minute:"numeric",
      hour12:true
    };

    const formatTime = new Intl.DateTimeFormat("en-Us", options);
    return formatTime.format(date)
  }

  const sortedAlphabeticalProject = [...projectData].sort((a,b) => {
    return a.projectName.localeCompare(b.projectName);
  })

  return (
    <>
    <div>
     {projectData.length >0 ?(
      <>
      <div className='h-screen flex flex-col overflow-x-hidden relative'>
      <div className='group inline-block top-18 right-4 absolute'>
     {/* <button onClick={()=>setIsModalVisible(true)} className='bg-orange-500 rounded-lg px-3 py-2 group-hover:bg-white group-hover:border group-hover:border-orange-500 transition-all transform duration-300 ease-in-out'>
     <span className='text-white font-bold group-hover:text-orange-500 transition-all transform duration-300 ease-in-out'> Create Project</span>
      </button> */}
     </div>
      <div className='mt-10 p-4 rounded-lg relative'>
      <ul className="space-y-6">
          {sortedAlphabeticalProject.map((project, i) => (
           <li
           key={i}
           onClick={()=>handleProjectId(project)}
           className="py-3 px-4 w-[90%] mx-auto cursor-pointer shadow-lg bg-white rounded-lg hover:shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all transform ease-in-out duration-300"
         >
          <div className='flex items-center gap-3'>
         <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold' >
            {project.projectName.charAt(0).toUpperCase()}
         </div>
           <div className="text-base font-medium text-gray-800">
             {project.projectName}
           </div>
           {/* <div className='absolute right-8'>
            <div className='flex gap-4'>
            <FaEdit onClick={()=>handleEditProject(project)} className='text-lg cursor-pointer'/>
            <FaDeleteLeft onClick={()=>handleDeleteProject(project)} className='text-lg cursor-pointer'/>
            </div>
           </div> */}
           </div>
           <div className="text-sm text-gray-500 mt-1">
             Created on: {convertToIST(project.createdAt)}
           </div>
         
         </li>
          ))}
        </ul>
      </div>
      
      </div>
      
      </>
     ):
     (
      <>
       <div className='flex flex-col items-center justify-center mt-20'>
        <FaFolderOpen className='text-[70px] text-gray-300'/>
        <p className='text-sm text-center mt-2'>You don’t have any projects yet. Start creating your first project to see it here.</p>

     {/* <div className='group inline-block mt-4'>
     <button onClick={()=>setIsModalVisible(true)} className='bg-orange-500 rounded-lg px-3 py-2 group-hover:bg-white group-hover:border group-hover:border-orange-500 transition-all transform duration-300 ease-in-out'>
     <span className='text-white font-bold group-hover:text-orange-500 transition-all transform duration-300 ease-in-out'> Create Project</span>
      </button>
     </div> */}
     </div>
      </>
     )

     }
      {/* <div>
        <Modal
         title="Create New Project"
         open={isModalVisible}
         onOk={handleOk}
         onCancel={handleCancel}
         footer={null}
       >
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-semibold mb-2 py-1">Project Name</label>
             <Input
             name='projectName'
               value={projectName.projectName}
               onChange={(e) =>  setProjectName({ ...projectName, projectName: e.target.value })}
               placeholder="Enter project name"
             />
           </div>
 
           <div className="flex justify-start gap-4 mt-6 pt-1 ">
             {/* <Button onClick={handleCancel}>Cancel</Button> */}
             {/* <Button type="primary" onClick={handleOk}>
               Create Project
             </Button>
           </div>
         </div>
       </Modal>
    </div>  */}

    {/* edit model 
    <div>
        <Modal
         title="Edit Project"
         open={isEditModalVisible}
         onOk={handleEditOk}
         onCancel={handleEditCancel}
         footer={null}
       >
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-semibold mb-2 py-1">Project Name</label>
             <Input
             name='projectName'
               value={projectName.projectName}
               onChange={(e) =>  setProjectName({ ...projectName, projectName: e.target.value })}
               placeholder="Enter project name"
             />
           </div>
 
           <div className="flex justify-start gap-4 mt-6 pt-1 "> */}
             {/* <Button onClick={handleCancel}>Cancel</Button> */}
             {/* <Button type="primary" onClick={handleEditOk}>
               Update Project
             </Button>
           </div>
         </div>
       </Modal>
    </div> */}

    {/* delete */}
    {/* <Modal
    open={isDeleteModalVisible}
    onOk={handleDeleteOk}
    onCancel={handleDeleteCancel}
    okText="Yes"
    cancelText="No"
    >
      <p>Are you sure to delete the project?</p>
    </Modal> */}
    </div>

    </>
  )
  
}

export default Task;
