import { DatePicker, Modal, Tabs, Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { GetLeavesRequests, SendLeaveRequest, UpdateLeaveStatus } from "../../../../services"; // Assuming UpdateLeaveStatus service is implemented
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Leave = () => {
    const date = new Date();
    const todayDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1,0,0,0,0).toISOString();
    const [activeTab, setActiveTab] = useState();
    console.log(todayDate,"todayDate")
  const errorMessage = "(This field is required)";
  const initialRequestError = {
    requestType: null,
    period: null,
    reason: null,
  };

  const initialRequestFromData = {
    leaveType: "",
    startDate: "",
    endDate: "",
    startDateString: "",
    endDateString: "",
    reason: "",
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, i) => i + 1,
      sortable: true,
      center: true,
    },
    {
      name: "Emp Id",
      selector: (row) => row?.userId.logId,
      sortable: true,
      center: true,
    },
    {
      name: "Name",
      selector: (row) => row?.userId.fullName,
      sortable: true,
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row?.leaveType,
      sortable: true,
      center: true,
    },
    {
      name: "Start Date",
      selector: (row) => row?.startDateString,
      sortable: true,
      center: true,
    },
    {
      name: "End Date",
      selector: (row) => row?.endDateString,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleViewRequest(row)}
            className="border border-green-500 text-green-500 px-2"
          >
            <FaEye />
          </Button>
           {(Date(row.startDate)>todayDate && activeTab!==1) && <Select
              defaultValue={row.status}
              style={{ width: 120 }}
              onChange={(value) => handleStatusUpdate(row, value)}
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>}
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

  const disableDates = (current) => {
    return current && (current.isBefore(dayjs(), 'day') || current.isAfter(dayjs().add(7, 'day'), 'day'));
  };

  const [fieldError, setFieldError] = useState(initialRequestError);
  const [requestFormData, setRequestFormData] = useState(initialRequestFromData);
  const [othersLeaveRequestData, setOthersLeaveRequestData] = useState([]);
  const [myLeaveData, setMyLeaveData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Add status filter state
  const [leaveTypeFilter, setLeaveTypeFilter] = useState(""); // Add leave type filter state
  const [dateFilter, setDateFilter] = useState([]); // Add date range filter state

  const [isRequestModelOpen, setIsRequestModelOpen] = useState(false);
  const [isRequestViewOpen, setIsRequestViewOpen] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null); // Store selected request data

  const handelRequestDataFetch = async () => {
    try {
      const response = await GetLeavesRequests();
      setOthersLeaveRequestData(response.data.data.othersData);
      setMyLeaveData(response.data.data.myLeaveData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewRequest = (row) => {
    setSelectedRequestData(row);
    setIsRequestViewOpen(true);
  };

  const handleRequestFormClose = () => {
    setIsRequestModelOpen(false);
    setRequestFormData(initialRequestFromData);
    setFieldError(initialRequestError);
  };

  const handelRequestDateChange = (e) => {
    const [startDate, endDate] = e;
    const { $D: sd, $M: sm, $y: sy } = startDate;
    const { $D: ed, $M: em, $y: ey } = endDate;
    setRequestFormData((prevFormData) => ({
      ...prevFormData,
      startDate: new Date(sy,sm,sd+1,0,0,0,0).toISOString(),
      endDate: new Date(ey,em,ed+1,0,0,0,0).toISOString(),
      startDateString: `${sd}/${sm+1}/${sy}`,
      endDateString: `${ed}/${em+1}/${ey}`,
    }));
  };

  const handelRequestFormDataChange = (e) => {
    setFieldError(initialRequestError)
    const { value, name } = e.target;
    console.log(value,name)
    setRequestFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    let isEmpty = false;
    Object.keys(requestFormData).forEach((key) => {
      if (requestFormData[key] === "") {
        isEmpty = true;
        setFieldError((prev) => ({
          ...prev,
          [key]: errorMessage,
        }));
      }
    });
    if (!isEmpty) {
      try {
        const response = await SendLeaveRequest(requestFormData);
        handleRequestFormClose();
        // Add toast notification for success
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDateFilterChange = (dates) => {
    setDateFilter(dates);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleLeaveTypeFilterChange = (value) => {
    setLeaveTypeFilter(value);
  };

  const handleStatusUpdate = async (row, status) => {
    try {
        const updatedStatus = status === "approved"
      await UpdateLeaveStatus(row._id, updatedStatus);
      const updatedData = othersLeaveRequestData.map((item) =>
        item._id === row._id ? { ...item, status } : item
      );
      setOthersLeaveRequestData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = (data) =>
    data.filter((request) => {
      const dateMatch =
        !dateFilter.length ||
        (dayjs(request.startDateString, "DD/MM/YYYY").isBetween(dateFilter[0], dateFilter[1], null, "[]") ||
          dayjs(request.endDateString, "DD/MM/YYYY").isBetween(dateFilter[0], dateFilter[1], null, "[]"));
      const statusMatch = !statusFilter || request.status === statusFilter;
      const typeMatch = !leaveTypeFilter || request.leaveType === leaveTypeFilter;
      return dateMatch && statusMatch && typeMatch;
    });

  useEffect(() => {
    handelRequestDataFetch();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Leaves</h2>
        <button
          onClick={() => {
            setIsRequestModelOpen(true);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-white hover:text-orange-600 hover:border border-orange-600 transition"
        >
          Request Leave
        </button>
      </div>

      <div className="mb-4">
        <RangePicker
          format="DD/MM/YYYY"
          onChange={handleDateFilterChange}
          style={{ marginRight: "20px" }}
        />
        <Select
          style={{ width: 120, marginRight: "20px" }}
          placeholder="Select Status"
          onChange={handleStatusFilterChange}
        >
          <Option value="">All</Option>
          <Option value="approved">Approved</Option>
          <Option value="pending">Pending</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
        <Select
          style={{ width: 150 }}
          placeholder="Select Leave Type"
          onChange={handleLeaveTypeFilterChange}
        >
          <Option value="">All</Option>
          <Option value="sick">Sick Leave</Option>
          <Option value="casual">Casual Leave</Option>
          <Option value="permission">Permission</Option>
          <Option value="wfh">Work From Home</Option>
          <Option value="compOff">Comp Off</Option>
        </Select>
      </div>

      <Tabs onChange={(key) =>setActiveTab(key)}>
        {myLeaveData?.length > 0 && (
          <Tabs.TabPane tab="My Leave Data" key="1" name={"my"}>
            <DataTable
              columns={columns}
              data={filteredData(myLeaveData)}
              customStyles={customStyles}
              pagination
              highlightOnHover
              pointerOnHover
              className="border rounded shadow-sm"
            />
          </Tabs.TabPane>
        )}

        {othersLeaveRequestData.length > 0 && (
          <Tabs.TabPane tab="Others Leave Data" key="2">
            <DataTable
              columns={columns}
              data={filteredData(othersLeaveRequestData)}
              customStyles={customStyles}
              pagination
              highlightOnHover
              pointerOnHover
              className="border rounded shadow-sm"
            />
          </Tabs.TabPane>
        )}
      </Tabs>

      {/* Request form modal */}
      <Modal
        open={isRequestModelOpen}
        width="30%"
        footer={null}
        title="Request Form"
        onClose={handleRequestFormClose}
        onCancel={handleRequestFormClose}
      >
       <form onSubmit={handleRequestSubmit}>
            <div className="w-full flex flex-col mt-3 gap-2">
              <label htmlFor="leave-type" className="text-lg">
                Request Type{" "}
                <span className="text-red-500">
                  *{" "}
                  <span className="text-sm">
                    {fieldError.requestType ?? ""}
                  </span>
                </span>
              </label>
              <select
                onChange={handelRequestFormDataChange}
                name="leaveType"
                className="p-3 bg-slate-200 rounded-lg text-lg"
                id="leave-type"
              >
                <option className="bg-white" value="">
                  Select a type
                </option>
                <option className="bg-white" value="sick">
                  Sick Leave
                </option>
                <option className="bg-white" value="casual">
                  Casual Leave
                </option>
                <option className="bg-white" value="permission">
                  Permission
                </option>
                <option className="bg-white" value="wfh">
                  Work From Home
                </option>
                <option className="bg-white" value="compOff">
                  Comp Off
                </option>
              </select>
            </div>
            <div className="w-full flex flex-col mt-3 gap-2">
              <label htmlFor="leave-type" className="text-lg">
                Select Period{" "}
                <span className="text-red-500">
                  * <span className="text-sm">{fieldError.period ?? ""}</span>
                </span>
              </label>
              <div className="w-full text-lg gap-2 px-2-">
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  onChange={handelRequestDateChange}
                  disabledDate={disableDates}
                />
              </div>
            </div>
            <div className="w-full flex flex-col mt-3 gap-2">
              <label htmlFor="reason" className="text-lg">
                Reason{" "}
                <span className="text-red-500">
                  * <span className="text-sm">{fieldError.reason ?? ""}</span>
                </span>
              </label>
              <textarea
                onChange={handelRequestFormDataChange}
                rows={4}
                name="reason"
                className="p-3 text-lg bg-slate-200 rounded-lg"
              />
            </div>
            <div className="w-full flex items-center justify-end mt-3">
              <button
                type="submit"
                className="px-6 py-1 bg-orange-500 text-lg text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </form>
      </Modal>

      {/* View request modal */}
      <Modal
        open={isRequestViewOpen}
        title="View Request"
        onCancel={() => setIsRequestViewOpen(false)}
        footer={null}
      >
        {selectedRequestData && (
          <div>
            <p><strong>Employee Name:</strong> {selectedRequestData?.employee?.name}</p>
            <p><strong>Department:</strong> {selectedRequestData?.employee?.department}</p>
            <p><strong>Designation:</strong> {selectedRequestData?.employee?.designation}</p>
            <p><strong>Emp ID:</strong> {selectedRequestData?.employee?.empId}</p>
            <p><strong>Email ID:</strong> {selectedRequestData?.employee?.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Leave;
