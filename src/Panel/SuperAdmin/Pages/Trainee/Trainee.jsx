import React, { useState } from 'react';
import DataTable from 'react-data-table-component';


const batches = [
  { id: 1, name: '21 Feb Batch' },
  { id: 2, name: '1 March Batch' },
];

const studentsData = {
  1: [ 
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ],
  2: [ 
    { id: 3, name: 'Bob Brown', email: 'bob@example.com', status: 'Active' },
    { id: 4, name: 'Alice White', email: 'alice@example.com', status: 'Active' },
  ],
};

const Trainee = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false); 

 
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
  ];

 
  const handleBatchClick = (batchId) => {
    setSelectedBatch(batchId);
    setShowDetails(true); 
  };

  return (
    <div className="p-4">
 
      {!showDetails ? (
        <>
          <h2 className="text-3xl font-semibold text-center mb-6">Select a Batch</h2>

    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.map(batch => (
              <div
                key={batch.id}
                onClick={() => handleBatchClick(batch.id)}
                className="cursor-pointer p-6 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 rounded-lg shadow-lg text-white hover:scale-105 transition-all duration-300"
              >
                <div className="text-2xl font-semibold">{batch.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        
        <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl font-semibold text-center">Students in {batches.find(batch => batch.id === selectedBatch).name}</h3>
          <button
            onClick={() => setShowDetails(false)}
            className="text-lg text-orange-600 hover:text-orange-800"
          >
            Back to Batches
          </button>
        </div>

       
        <div className="">
          <DataTable
            columns={columns}
            data={studentsData[selectedBatch]}
            pagination
            
            
            noDataComponent="No students available"
            customStyles={{
              rows: {
                style: {
                  minHeight: '40px',
                  fontSize: '16px', 
                },
              },
              headCells: {
                style: {
                  backgroundColor: '#f9fafb',
                  color: '#4a4a4a',
                  fontWeight: 'bold',
                  fontSize: '18px', 
                },
              },
              cells: {
                style: {
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  fontSize: '16px', 
                },
              },
            }}
          />
        </div>
      </div>
    )}
  </div>
  );
};

export default Trainee;
