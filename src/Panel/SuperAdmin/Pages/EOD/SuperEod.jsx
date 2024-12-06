import React, { useEffect, useState } from "react";
import { Select, DatePicker, Input, Pagination, message, Modal } from "antd";
import dayjs from "dayjs";
import { GetEodAll } from "../../../../services";

const { Option } = Select;

const SuperEod = () => {
  const [listEodData, setListEodData] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    project: "",
    date: null,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDetailedEod, setVisibleDetailedEod] = useState(false);
  const [selectedEod, setSelectedEod] = useState([]);

  const itemsPerPage = 9;

  const showDetailedModal = () => {
    setVisibleDetailedEod(true)
  }

  const cancelDetailedModal = () => {
    setVisibleDetailedEod(false);
  }

  const handleSelectEod = (eod) => {
    console.log("select eod",eod)
    setSelectedEod(eod);
    setVisibleDetailedEod(true)
  }

//   useEffect(()=>{
// console.log("sell",selectedEod)
// console.log("ssss",selectedEod.project)
//   },[selectedEod])
  // Fetch Data from Backend
  const fetchAllEod = async () => {
    try {
      const response = await GetEodAll();
      if (response.data.status) {
        setListEodData(response.data.data);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to list EODs");
      console.error("Error fetching EODs:", error);
    }
  };

  useEffect(() => {
    fetchAllEod();
  }, []);

  // Extract unique values for filters
  const uniqueDepartments = [...new Set(listEodData.map((eod) => eod.department))];
  const uniqueProjects = filters.department
    ? [...new Set(listEodData.filter((eod) => eod.department === filters.department).map((eod) => eod.project))]
    : [...new Set(listEodData.map((eod) => eod.project))];
  const uniqueNames = [...new Set(listEodData.map((eod) => eod.userName.fullName))];
  const uniqueDates = [...new Set(listEodData.map((eod) => dayjs(eod.date).format("DD-MM-YYYY")))].sort();

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field !== "name") setCurrentPage(1); // Reset pagination when filters change
  };

  // Filter data
  const filteredEods = listEodData.filter((eod) => {
    const matchesDepartment =
      !filters.department || eod.department === filters.department;
    const matchesProject = !filters.project || eod.project === filters.project;
    const matchesDate =
      !filters.date || dayjs(eod.date).format("DD-MM-YYYY") === filters.date.format("DD-MM-YYYY");
    const matchesName =
      !filters.name ||
      eod.userName.fullName.toLowerCase().includes(filters.name.toLowerCase());

    return matchesDepartment && matchesProject && matchesDate && matchesName;
  });

  // Paginated data
  const paginatedEods = filteredEods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Department Filter */}
        <Select
          placeholder="Select Department"
          className="w-full md:w-1/6"
          onChange={(value) => handleFilterChange("department", value)}
          allowClear
        >
          {uniqueDepartments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>

        {/* Project Filter */}
        <Select
          showSearch
          placeholder="Search & Select Project"
          className="w-full md:w-1/6"
          onChange={(value) => handleFilterChange("project", value)}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
        >
          {uniqueProjects.map((project) => (
            <Option key={project} value={project}>
              {project}
            </Option>
          ))}
        </Select>

        {/* Date Filter */}
        <DatePicker
          placeholder="Filter by Date"
          className="w-full md:w-1/6"
          onChange={(date) => handleFilterChange("date", date)}
          disabledDate={(current) =>
            current && !uniqueDates.includes(current.format("DD-MM-YYYY"))
          }
        />

        {/* Name Filter */}
        <Select
          showSearch
          placeholder="Search & Select Name"
          className="w-full md:w-1/6"
          onChange={(value) => handleFilterChange("name", value)}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
        >
          {uniqueNames.map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      {/* EOD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEods.map((eod, index) => (
          <div key={index} className="p-4 border shadow-md rounded-md bg-white" onClick={()=>handleSelectEod(eod)}>
            <div className="flex">
              <img
                src={eod.userName.profilePic}
                alt="profile"
                className="rounded-full w-8 h-8 mr-2"
              />
              <h3 className="font-semibold text-blue-600">
                {eod.userName.fullName}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Department:</strong> {eod.department}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Project:</strong> {eod.project}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Description:</strong> {eod.description}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Date:</strong> {dayjs(eod.date).format("DD-MM-YYYY")}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredEods.length}
        onChange={(page) => setCurrentPage(page)}
        className="text-center mt-4"
      />
    </div>
    <Modal
  open={visibleDetailedEod}
  onCancel={cancelDetailedModal}
  footer={null}
  centered
  width={900}
>
  <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">
      EOD Report Details
    </h2>

    {selectedEod && (
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {selectedEod.department}
          </h3>
          <p className="text-lg font-medium text-gray-600">
            {dayjs(selectedEod.date).format("DD-MM-YYYY")}
          </p>
        </div>

        {/* Project and User Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-lg font-medium text-gray-700">
              <strong>Project:</strong>{" "}
              <span className="text-gray-600">{selectedEod.project}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Name:</strong>{" "}
              <span className="text-gray-600">
                {selectedEod?.userName?.fullName}
              </span>
            </p>
          </div>
          <div>
            {selectedEod.link && (
              <>
                <p className="text-lg font-medium text-gray-700">
                  <strong>Links:</strong>
                </p>
                {selectedEod.link.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mb-2"
                  >
                    {link}
                  </a>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 mb-2">
            <strong>Description:</strong>
          </p>
          <p className="text-gray-600 leading-relaxed">
            {selectedEod.description}
          </p>
        </div>

        {/* Uploaded Files */}
        {selectedEod.uploadFile && selectedEod.uploadFile.length > 0 && (
          <div>
            <p className="text-lg font-medium text-gray-700 mb-4">
              <strong>Uploaded Files:</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedEod.uploadFile.map((file, index) => (
                <div key={index} className="relative">
                  <div className="w-full h-64 border rounded-lg overflow-hidden shadow-md">
                    <img
                      src={file}
                      alt={`Uploaded file ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
</Modal>

    </>
  );
};

export default SuperEod;
