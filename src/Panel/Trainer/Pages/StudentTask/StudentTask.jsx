import Modal from 'antd/es/modal/Modal';
import React, { useEffect, useState } from 'react';
import { CreateProject, DeleteProject, EditProjectId, GetProjects } from '../../../../services';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { FaDeleteLeft, FaEye, FaFolderOpen, FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setProjectId, setProjectTitle} from '../../../../Redux/TrainerRedux';
import { store } from '../../../../Redux/Store';
import DataTable from 'react-data-table-component';

const StudentTask = () => {
 
    
    const reports = [
      { id: 1, taskName: "Math Assignment", batch: "Batch A", studentName: "John Doe" },
      { id: 2, taskName: "Science Project", batch: "Batch B", studentName: "Jane Smith" },
      { id: 3, taskName: "History Essay", batch: "Batch C", studentName: "Alice Brown" },
      { id: 4, taskName: "Physics Lab", batch: "Batch A", studentName: "Bob Johnson" },
    ];
  
    // Columns for the DataTable
    const columns = [
      {
        name: "S.No",
        selector: (row, index) => index + 1, // Auto-generate serial numbers
        sortable: false,
        // width: "70px",
        center:true
      },
      {
        name: "Task Name",
        selector: (row) => row.taskName,
        sortable: true,
        center:true

      },
      {
        name: "Batch",
        selector: (row) => row.batch,
        sortable: true,
        center:true

      },
      {
        name: "Student Name",
        selector: (row) => row.studentName,
        sortable: true,
        center:true

      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-2">
          <Button className="border border-green-500 text-green-500 px-2">
            <FaEye/>
          </Button>
          <Button
            onClick={() => handleEditBatch(row)}
            className="border border-blue-500 text-blue-500 px-2"
          >
            <FaEdit />
          </Button>
          <Button
            onClick={() => handleDeleteBatch(row.id)}
            className="border border-red-500 text-red-500 px-2"
          >
            <FaTrash />
          </Button>
        </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        center:true

        // button: true,
      },
    ];
  
    // Custom Styles for the table
    const customStyles = {
      headCells: {
        style: {
          backgroundColor: "#ff9800",
          color: "#ffffff",
          fontSize: "16px",
        
        },
      },
      rows: {
        style: {
          minHeight: "50px", // override the row height
        },
      }
    };
  
   
  

  return (
<>
<div className='p-4'>
<DataTable
        columns={columns}
        data={reports}
        pagination
        customStyles={customStyles}
        responsive
        highlightOnHover
        className="border border-gray-300 rounded-md"
      />
</div>
   
      <div className='group inline-block top-18 right-4 absolute'>
     <button onClick={()=>setIsModalVisible(true)} className='bg-orange-500 rounded-lg px-3 py-2 group-hover:bg-white group-hover:border group-hover:border-orange-500 transition-all transform duration-300 ease-in-out'>
     <span className='text-white font-bold group-hover:text-orange-500 transition-all transform duration-300 ease-in-out'> Create Project</span>
      </button>
     </div>
     
</>
   
      
    
  )
}

export default StudentTask
