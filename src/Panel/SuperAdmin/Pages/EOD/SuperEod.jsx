import React, { useEffect, useState } from "react";
import { Select, DatePicker, Input, Pagination, message } from "antd";
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

  const itemsPerPage = 9;

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
          <div key={index} className="p-4 border shadow-md rounded-md bg-white">
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
  );
};

export default SuperEod;
