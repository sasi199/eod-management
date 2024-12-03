// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { Modal, Input, Select, Button, Form, message } from "antd";
// import {
//   AddBatches,
//   GetBatches,
//   EditBatches,
//   DeleteBatches,
//   AllStaffs,
// } from "../../../../services";
// import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

// const { Option } = Select;

// const Batches = () => {
//   const [batches, setBatches] = useState([]);
//   const [staffs, setStaffs]= useState([])
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBatch, setEditingBatch] = useState(null); // To track the batch being edited
//   const [form] = Form.useForm();

//  useEffect(()=>{
//   const fetchStaffs = async ()=>{
//     try {
//       const response = await AllStaffs();
//       setStaffs(response.data.data);
//       console.log(response.data.data);
    
//     } catch (error) {
//       console.error("Error fetching Staffs:", error);
//     }
//   }
//   fetchStaffs();
//  },[])
//   // Fetch batches data from API
//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const response = await GetBatches();
//         // Map `_id` to `id` for consistency
//         const mappedBatches = response.data.data.map((batch) => ({
//           ...batch,
//           id: batch._id,
//         }));
//         setBatches(mappedBatches);
//         console.log(response.data.data);

//       } catch (error) {
//         console.error("Error fetching batches:", error);
//       }
//     };

//     fetchBatches();
//   }, []);

//   const handleAddBatch = () => {
//     setEditingBatch(null);
//     form.resetFields();
//     setIsModalOpen(true);
//   };

//   const handleEditBatch = (batch) => {
//     setEditingBatch(batch); // Set the batch to edit
//     form.setFieldsValue(batch); // Prefill the form with batch data
//     setIsModalOpen(true);
//   };

//   const handleDeleteBatch = (id) => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this batch?",
//       content: "This action cannot be undone.",
//       okText: "Yes",
//       cancelText: "No",
//       onOk: async () => {
//         try {
//           await DeleteBatches(id);
//           setBatches((prevBatches) =>
//             prevBatches.filter((batch) => batch.id !== id)
//           );
//           message.success("Batch deleted successfully.");
//         } catch (error) {
//           console.error("Error deleting batch:", error);
//           message.error("Failed to delete the batch. Please try again.");
//         }
//       },
//       onCancel: () => {
//         message.info("Deletion canceled.");
//       },
//     });
//   };

//   const handleOk = () => {
//     form
//       .validateFields()
//       .then(async (values) => {
//         console.log(values, "qwertyu");
//         if (editingBatch) {
//           // Edit batch
//           try {
//             const response = await EditBatches(editingBatch.id, values);
//             setBatches((prevBatches) =>
//               prevBatches.map((batch) =>
//                 batch.id === editingBatch.id ? { ...batch, ...values } : batch
//               )
//             );
//             console.log("Batch updated:", response);
//           } catch (error) {
//             console.error("Error updating batch:", error);
//           }
//         } else {
//           // Add new batch
//           try {
//             const response = await AddBatches(values);
//             const newBatch = {
//               ...values,
//               id: response.data.id, // Use the id from API response
//             };
//             setBatches([...batches, newBatch]);
//             console.log("Batch added:", response);
//           } catch (error) {
//             console.error("Error adding batch:", error);
//           }
//         }

//         form.resetFields();
//         setIsModalOpen(false);
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   const handleCancel = () => {
//     form.resetFields();
//     setIsModalOpen(false);
//   };

//   const handleDelete = (id) => {
//     setBatches(batches.filter((batch) => batch.id !== id));
//   };

//   const columns = [
//     {
//       name: "S.No",
//       selector: (row,i) => i+1,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: "Batch ID",
//       selector: (row) => row.batchId,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: "Batch Name",
//       selector: (row) => row.batchName,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: "Course Name",
//       selector: (row) => row.courseName,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: "Batch Timings",
//       selector: (row) => row.batchTimings,
//       sortable: true,
//       center: true,
//     },
//     {
//       name: "Course Duration",
//       selector: (row) => row.courseDuration,
//       sortable: true,
//       center: true,
//     },
//     // {
//     //   name: "Trainers",
//     //   selector: (row) => row.trainers || "N/A",
//     //   sortable: true,
//     //   center: true,
//     // },
//     {
//       name: "Actions",
//       center: true,
//       cell: (row) => (
//         <div className="flex gap-2">
//           <Button className="border border-green-500 text-green-500 px-2">
//             <FaEye />
//           </Button>
//           <Button
//             onClick={() => handleEditBatch(row)}
//             className="border border-blue-500 text-blue-500 px-2"
//           >
//             <FaEdit />
//           </Button>
//           <Button
//             onClick={() => handleDeleteBatch(row.id)}
//             className="border border-red-500 text-red-500 px-2"
//           >
//             <FaTrash />
//           </Button>
//         </div>
//       ),
//     },
//   ];
//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: "#ff9800",
//         color: "#ffffff",
//         fontSize: "16px",
//         paddingRight: "0px",
//       },
//     },
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Batches</h2>
//         <button
//           onClick={handleAddBatch}
//           className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-white hover:text-orange-600 hover:border border-orange-600 transition"
//         >
//           Add Batch
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={batches}
//         customStyles={customStyles}
//         pagination
//         highlightOnHover
//         pointerOnHover
//         className="border rounded shadow-sm"
//       />

//       <Modal
//         title={editingBatch ? "Edit Batch" : "Add New Batch"}
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="cancel" onClick={handleCancel}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={handleOk}
//             className="bg-orange-500 text-white hover:bg-orange-600"
//           >
//             {editingBatch ? "Save Changes" : "Add"}
//           </Button>,
//         ]}
//         centered
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{
//             courseName: "",
//             batchTimings: "",
//             courseDuration: "",
//             trainers: [],
//           }}
//         >
//           <Form.Item
//             name="courseName"
//             label="Course Name"
//             rules={[{ required: true, message: "Please select a course name" }]}
//           >
//             <Select placeholder="Select a course">
//               <Option value="Full Stack">Full Stack</Option>
//               <Option value="Digital Marketing">Digital Marketing</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="batchTimings"
//             label="Batch Timings"
//             rules={[
//               { required: true, message: "Please select the batch timings" },
//             ]}
//           >
//             <Select placeholder="Select batch timings">
//               <Option value="10 am to 02 pm">10 am to 02 pm</Option>
//               <Option value="02 pm to 06 pm">02 pm to 06 pm</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="courseDuration"
//             label="Course Duration"
//             rules={[
//               { required: true, message: "Please select the course duration" },
//             ]}
//           >
//             <Select placeholder="Select course duration">
//               <Option value="3 Months">3 Months</Option>
//               <Option value="6 Months">6 Months</Option>
//               <Option value="9 Months">9 Months</Option>
//               <Option value="12 Months">12 Months</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="trainers"
//             label="Add Trainers"
//             rules={[
//               { required: true, message: "Please select at least one trainer" },
//             ]}
//           >
//            <Select mode="multiple" placeholder="Select trainers">
//   {staffs.map((trainer) => (
//     <Option key={trainer._id} value={trainer._id}>
//       <div className="flex items-center gap-2">
//         <img
//           src={trainer.profilePic}
//           alt={trainer.fullName}
//           className="w-8 h-8 rounded-full"
//         />
//         {trainer.fullName}
//       </div>
//     </Option>
//   ))}
// </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Batches;

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Input, Select, Button, Form, message } from "antd";
import {
  AddBatches,
  GetBatches,
  EditBatches,
  DeleteBatches,
  AllStaffs,
} from "../../../../services";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const { Option } = Select;

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // For view modal
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null); // To track the batch being edited
  const [form] = Form.useForm();

  // Fetch staff details
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await AllStaffs();
        setStaffs(response.data.data);
      } catch (error) {
        console.error("Error fetching staffs:", error);
        message.error("Failed to fetch trainers.");
      }
    };
    fetchStaffs();
  }, []);

  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await GetBatches();
        const mappedBatches = response.data.data.map((batch) => ({
          ...batch,
          id: batch._id,
        }));
        setBatches(mappedBatches);
      } catch (error) {
        console.error("Error fetching batches:", error);
        message.error("Failed to fetch batches.");
      }
    };
    fetchBatches();
  }, []);

  const handleAddBatch = () => {
    setEditingBatch(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setIsViewModalOpen(true);
  };

  

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
    form.setFieldsValue(batch);
    setIsModalOpen(true);
  };

  const handleDeleteBatch = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this batch?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        className: "bg-orange-500 text-white hover:bg-orange-600",
      },
      cancelButtonProps: {
        className: "bg-gray-500 text-white hover:bg-gray-600",
      },
      onOk: async () => {
        try {
          await DeleteBatches(id);
          setBatches((prevBatches) =>
            prevBatches.filter((batch) => batch.id !== id)
          );
          message.success("Batch deleted successfully.");
        } catch (error) {
          console.error("Error deleting batch:", error);
          message.error("Failed to delete the batch. Please try again.");
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBatch) {
        // Edit batch
        await EditBatches(editingBatch.id, values);
        setBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === editingBatch.id ? { ...batch, ...values } : batch
          )
        );
        message.success("Batch updated successfully.");
      } else {
        // Add new batch
        const response = await AddBatches(values);
        const newBatch = {
          ...values,
          id: response.data.id, // Use ID from API response
        };
        setBatches([...batches, newBatch]);
        message.success("Batch added successfully.");
      }
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving batch:", error);
      message.error("Failed to save batch. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

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
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button
          onClick={()=>handleViewBatch(row)}
            className="border border-green-500 text-green-500 px-2"
          >
            <FaEye />
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
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ff9800",
        color: "#ffffff",
        fontSize: "16px",
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Batches</h2>
        <button
          onClick={handleAddBatch}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-white hover:text-orange-600 hover:border border-orange-600 transition"
        >
          Add Batch
        </button>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        customStyles={customStyles}
        pagination
        highlightOnHover
        pointerOnHover
        className="border rounded shadow-sm"
      />

      <Modal
        title={editingBatch ? "Edit Batch" : "Add New Batch"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: "Please select a course name" }]}
          >
            <Select placeholder="Select a course">
              <Option value="Full Stack">Full Stack</Option>
              <Option value="Digital Marketing">Digital Marketing</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="batchTimings"
            label="Batch Timings"
            rules={[{ required: true, message: "Please select batch timings" }]}
          >
            <Select placeholder="Select batch timings">
              <Option value="10 am to 02 pm">10 am to 02 pm</Option>
              <Option value="02 pm to 06 pm">02 pm to 06 pm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="courseDuration"
            label="Course Duration"
            rules={[{ required: true, message: "Please select course duration" }]}
          >
            <Select placeholder="Select course duration">
              <Option value="3 Months">3 Months</Option>
              <Option value="6 Months">6 Months</Option>
              <Option value="9 Months">9 Months</Option>
              <Option value="12 Months">12 Months</Option>
            </Select>
          </Form.Item>

          <Form.Item
  name="trainer"
  label="Assign Trainers"
  rules={[
    { required: true, message: "Please select at least one trainer." },
  ]}
>
  <Select
    mode="multiple"
    placeholder="Select trainers"
    value={form.getFieldValue("trainers")}
    onChange={(value) => form.setFieldsValue({ trainers: value })}
  >
    {staffs.map((trainer) => (
      <Option key={trainer._id} value={trainer._id}>
        <div className="flex items-center gap-2">
          <img
            src={trainer.profilePic}
            alt={trainer.fullName}
            className="w-8 h-8 rounded-full"
          />
          {trainer.fullName}
        </div>
      </Option>
    ))}
  </Select>
</Form.Item>
        </Form>
        <div className="flex justify-end items-center gap-1">
        <button key="cancel" onClick={handleCancel} className="border px-4 py-1 rounded-lg border-gray-300 hover:border-orange-500 hover:text-orange-500 ">
            Cancel
          </button>,
          <button
            key="submit"
            type="primary"
            onClick={handleOk}
            className="bg-orange-500 px-4 py-1 rounded-lg  text-white hover:bg-orange-600"
          >
            {editingBatch ? "Save Changes" : "Add"}
          </button>
          </div>
      </Modal>
      <Modal
        title="Batch Details"
        open={isViewModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
  {selectedBatch && (
  <div className="p-6 bg-orange-500 max-w-lg rounded-lg ">
    {/* Batch Details */}
    <h2 className="text-2xl font-bold  mb-4">Batch Details</h2>
    <div className="space-y-3 text-white">
      <p className="mx-auto">
        <strong className="text-black">Batch ID:</strong> {selectedBatch.batchId}
      </p>
      <p>
        <strong className="text-black">Batch Name:</strong> {selectedBatch.batchName}
      </p>
      <p>
        <strong className="text-black">Course Name:</strong> {selectedBatch.courseName}
      </p>
      <p>
        <strong className="text-black">Batch Timings:</strong> {selectedBatch.batchTimings}
      </p>
      <p>
        <strong className="text-black">Course Duration:</strong> {selectedBatch.courseDuration}
      </p>
    </div>

    {/* Trainers Section */}
    <div className="mt-6">
      <h3 className="text-xl font-semibold  mb-3">Trainers</h3>
      <div className="flex flex-wrap gap-4">
        {selectedBatch.trainerDetails.map((trainer) => (
          <div
            key={trainer._id}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-md w-full sm:w-1/2"
          >
            <img
              src={trainer.profilePic}
              alt={`${trainer.fullName}'s profile`}
              className="w-12 h-12 rounded-full border-2 border-orange-600"
            />
            <span className="text-sm font-medium text-gray-800">{trainer.fullName}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        
      </Modal>
    </div>
  );
};

export default Batches;
