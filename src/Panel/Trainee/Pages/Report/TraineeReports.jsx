// import React, { useState, useEffect } from 'react';
// import DataTable from 'react-data-table-component';
// import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { Button, Modal, Form, Input, Avatar, Select, notification } from 'antd';
// import axios from 'axios';
// import { AllStaffs, CreateReport, GetReportAll } from '../../../../services';

// const { Option } = Select;
// const { TextArea } = Input;

// const TraineeReports = () => {
//   const [isReportOpen, setIsReportOpen] = useState(false);
//   const [reports, setReports] = useState([]);
//   const [staffs, setStaffs] = useState([]);
//   const[getReports,setGetReports]=useState([]);
//   const [form] = Form.useForm();

  
//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         const response = await AllStaffs(); 
//         if (response.data) {
//           setStaffs(response.data.data);
//           console.log(response.data.data); 
//         }
//       } catch (error) {
//         console.error('Error fetching staff data:', error);
//         notification.error({
//           message: 'Error fetching staff data',
         
//         });
//       }
//     };
//     fetchStaffData();
//   }, []);
  
//   useEffect(() => {
//     const fetchReportsData = async () => {
//       try {
//         const response = await GetReportAll(); 
//         if (response.data) {
//           setGetReports(response.data.data);
//           console.log(response.data.data); 
//         }
//       } catch (error) {
//         console.error('Error fetching staff data:', error);
//         notification.error({
//           message: 'Error fetching staff data',
         
//         });
//       }
//     };
//     fetchReportsData();
//   }, []);



//   const showModal = () => setIsReportOpen(true);

//   const closeModal = () => {
//     setIsReportOpen(false);
//     form.resetFields(); 
//   };


//   const handleFormSubmit = async (values) => {
//     const formData = {
//       title: values.title,
//       content: values.content,
//       reporter: values.reporter,
//       reportTo: values.reportTo,
//     };
// console.log(formData);
//     try {
//       const response = await CreateReport (formData); 
//       if (response.status === 201) {
//         setReports((prevReports) => [...prevReports, response.data]);
//         notification.success({
//           message: 'Report Added',
//           description: 'Your report has been successfully added.',
//         });
//         closeModal();
//       }
//     } catch (error) {
//       console.error('Error adding report:', error);
//       notification.error({
//         message: 'Error Adding Report',
        
//       });
//     }
//   };

  
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/reports/${id}`); 
//       setReports((prevReports) => prevReports.filter((report) => report.id !== id));
//       notification.success({
//         message: 'Report Deleted',
//       });
//     } catch (error) {
//       console.error('Error deleting report:', error);
//       notification.error({
//         message: 'Error Deleting Report',
//       });
//     }
//   };

//   // Table columns configuration
//   const columns = [
//     { name: 'S.No', selector: (row, index) => index + 1, center: true },
//     { name: 'Report Title', selector: (row) => row.title, sortable: true, center: true },
//     { name: 'Status', selector: (row) => row.status || 'Pending', sortable: true, center: true },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <div className="flex text-xl gap-4">
//           <FaEye className="text-blue-500 cursor-pointer" title="View Report" />
//           <FaEdit className="text-green-500 cursor-pointer" title="Edit Report" />
//           <FaTrash
//             className="text-red-500 cursor-pointer"
//             title="Delete Report"
//             onClick={() => handleDelete(row.id)}
//           />
//         </div>
//       ),
//       center: true,
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
//         <h2 className="text-xl font-semibold">Trainee Reports</h2>
//         <button className='bg-orange-500 text-white hover:bg-orange-600 px-4 py-1 rounded-md' onClick={showModal}>
//           Add Report
//         </button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={getReports}
//         customStyles={customStyles}
//         pagination
//         highlightOnHover
//         className="border border-gray-300 rounded-md"
//       />

//       <Modal
//         title="Add Report"
//         open={isReportOpen}
//         footer={null}
//         onCancel={closeModal}
//         destroyOnClose
//       >
//         <Form
//           layout="vertical"
//           form={form}
//           onFinish={handleFormSubmit}
//           initialValues={{
//             title: '',
//             content: '',
//             reporter: '',
//             reportTo: '',
//           }}
//         >
//           <Form.Item
//             label="Report Title"
//             name="title"
//             rules={[{ required: true, message: 'Please enter the report title!' }]}
//           >
//             <Input placeholder="Enter report title" />
//           </Form.Item>

//           <Form.Item
//             label="Report Content"
//             name="content"
//             rules={[{ required: true, message: 'Please enter the report content!' }]}
//           >
//             <TextArea rows={4} placeholder="Enter report content" />
//           </Form.Item>

//           <Form.Item
//             label="Reporter"
//             name="reporter"
//             rules={[{ required: true, message: 'Please enter the reporter name!' }]}
//           >
//             <Input placeholder="Enter reporter name" />
//           </Form.Item>

//           <Form.Item
//   label="Report To"
//   name="reportTo"
//   rules={[{ required: true, message: 'Please select a person to report to!' }]}>
//   <Select placeholder="Select person" allowClear>
//     {staffs.map((staff, index) => (
//       <Option key={staff.fullName } value={staff.fullName}>
//         <Avatar src={staff.profilePic} size={32} className="mr-2" />
//         {staff.fullName}
//       </Option>
//     ))}
//   </Select>
// </Form.Item>

//           <Form.Item>
//             <Button htmlType="submit" className="w-full bg-orange-500 text-white  hover:">
//               Submit Report
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TraineeReports;
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Modal, Form, Input, Avatar, Select, notification } from 'antd';
import axios from 'axios';
import { AllStaffs, CreateReport, GetReportAll } from '../../../../services';

const { Option } = Select;
const { TextArea } = Input;

const TraineeReports = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [getReports, setGetReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);  // State for editing
  const [form] = Form.useForm();

  // Fetch staff data
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await AllStaffs();
        if (response.data) {
          setStaffs(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
        notification.error({
          message: 'Error fetching staff data',
        });
      }
    };
    fetchStaffData();
  }, []);

  // Fetch reports data
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await GetReportAll();
        if (response.data) {
          setGetReports(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching reports data:', error);
        notification.error({
          message: 'Error fetching reports data',
        });
      }
    };
    fetchReportsData();
  }, []);

  // Open the modal
  const showModal = () => setIsReportOpen(true);

  // Close the modal
  const closeModal = () => {
    setIsReportOpen(false);
    setEditingReport(null);  // Clear the editing report state
    form.resetFields();  // Reset the form fields
  };

  // Handle form submission for adding or editing
  const handleFormSubmit = async (values) => {
    const formData = {
      title: values.title,
      content: values.content,
      reporter: values.reporter,
      reportTo: values.reportTo,
    };

    try {
      let response;
      if (editingReport) {
        // Update the report if editing
        response = await axios.put(`/api/reports/${editingReport.id}`, formData);
      } else {
        // Create a new report
        response = await axios.post('/api/reports', formData);
      }

      // Update the reports list in the state
      setReports((prevReports) =>
        editingReport
          ? prevReports.map((report) =>
              report.id === editingReport.id ? response.data : report
            )
          : [...prevReports, response.data]
      );
      notification.success({
        message: editingReport ? 'Report Updated' : 'Report Added',
        description: 'Your report has been successfully added or updated.',
      });
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Error Adding or Updating Report',
        description: 'There was an issue with the report operation. Please try again later.',
      });
    }
  };

  // Handle delete report
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reports/${id}`);
      setReports((prevReports) => prevReports.filter((report) => report.id !== id));
      notification.success({
        message: 'Report Deleted',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      notification.error({
        message: 'Error Deleting Report',
        description: 'There was an issue deleting the report. Please try again later.',
      });
    }
  };

  // Handle editing a report
  const handleEdit = (report) => {
    setEditingReport(report);  // Set the report to be edited
    form.setFieldsValue({
      title: report.title,
      content: report.content,
      reporter: report.reporter,
      reportTo: report.reportTo,
    });
    setIsReportOpen(true);  // Open the modal
  };

  // Table columns configuration
  const columns = [
    { name: 'S.No', selector: (row, index) => index + 1, center: true },
    { name: 'Report Title', selector: (row) => row.title, sortable: true, center: true },
    { name: 'Status', selector: (row) => row.status || 'Pending', sortable: true, center: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex text-xl gap-4">
          <FaEye className="text-blue-500 cursor-pointer" title="View Report" />
          <FaEdit
            className="text-green-500 cursor-pointer"
            title="Edit Report"
            onClick={() => handleEdit(row)} // Handle edit click
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            title="Delete Report"
            onClick={() => handleDelete(row.id)} // Handle delete click
          />
        </div>
      ),
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trainee Reports</h2>
        <button className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-1 rounded-md" onClick={showModal}>
          Add Report
        </button>
      </div>

      <DataTable
        columns={columns}
        data={getReports}
        customStyles={customStyles}
        pagination
        highlightOnHover
        className="border border-gray-300 rounded-md"
      />

      <Modal
        title={editingReport ? 'Edit Report' : 'Add Report'}
        visible={isReportOpen}
        footer={null}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{
            title: editingReport ? editingReport.title : '',
            content: editingReport ? editingReport.content : '',
            reporter: editingReport ? editingReport.reporter : '',
            reportTo: editingReport ? editingReport.reportTo : '',
          }}
        >
          <Form.Item
            label="Report Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the report title!' }]}
          >
            <Input placeholder="Enter report title" />
          </Form.Item>

          <Form.Item
            label="Report Content"
            name="content"
            rules={[{ required: true, message: 'Please enter the report content!' }]}
          >
            <TextArea rows={4} placeholder="Enter report content" />
          </Form.Item>

          <Form.Item
            label="Reporter"
            name="reporter"
            rules={[{ required: true, message: 'Please enter the reporter name!' }]}
          >
            <Input placeholder="Enter reporter name" />
          </Form.Item>

          <Form.Item
            label="Report To"
            name="reportTo"
            rules={[{ required: true, message: 'Please select a person to report to!' }]}
          >
            <Select placeholder="Select person" allowClear>
              {staffs.map((staff) => (
                <Option key={staff.fullName} value={staff.fullName}>
                  <Avatar src={staff.profilePic} size={32} className="mr-2" />
                  {staff.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
              {editingReport ? 'Update Report' : 'Submit Report'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TraineeReports;
