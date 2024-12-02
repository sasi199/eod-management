import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { GetBatches } from '../../../../services';

const MyBatch = () => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch batch data from the API
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches(); 
        setBatchData(response.data.data); 
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching batch data", error);
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const columns = [
    
    {
      name: "S.No",
      selector: (row, i) => i + 1,
      sortable: true,
      center: true,
    },
    {
      name: "Batch ID",
      selector: (row) => row.batchId,
      sortable: true,
      center: true,
    },
    {
      name: "Batch Name",
      selector: (row) => row.batchName,
      sortable: true,
      center: true,
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
      center: true,
    },
    {
      name: "Batch Timings",
      selector: (row) => row.batchTimings,
      sortable: true,
      center: true,
    },
    {
      name: "Course Duration",
      selector: (row) => row.courseDuration,
      sortable: true,
      center: true,
    },
  
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ff9800",
        color: "#ffffff",
        fontSize: "16px",
        paddingRight: "0px",
      },
    },
  };

  return (
    <div className='p-4'>
    
      <DataTable
        columns={columns}
        data={batchData}
        pagination
        highlightOnHover
        className="border border-gray-300 rounded-md"
      customStyles={customStyles}
      />
    </div>
  );
};

export default MyBatch;
