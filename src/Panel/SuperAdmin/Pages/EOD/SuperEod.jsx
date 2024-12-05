import React, { useState } from "react";
import { Select, DatePicker, Input, Pagination } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const SuperEod = () => {
  const [eods, setEods] = useState([
    // Sample EOD Data
    {
      username: "John Doe",
      department: "Developer",
      project: "Website Redesign",
      description: "Completed homepage design and layout",
      date: "2024-12-05",
    },
    {
      username: "Jane Smith",
      department: "Digital Marketing",
      project: "SEO Campaign",
      description: "Analyzed traffic and optimized keywords",
      date: "2024-12-04",
    },
    {
      username: "Michael Lee",
      department: "Sales",
      project: "Product Launch",
      description: "Pitched the new product to 10 clients",
      date: "2024-12-03",
    },
    {
      username: "Emily Brown",
      department: "Placement Marketing",
      project: "Campus Drive",
      description: "Arranged interviews for students",
      date: "2024-12-02",
    },
  ]);

  const [filters, setFilters] = useState({
    department: "",
    project: "",
    date: null,
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filtered Data
  const filteredEods = eods.filter((eod) => {
    const matchesDepartment =
      !filters.department || eod.department === filters.department;
    const matchesProject =
      !filters.project || eod.project === filters.project;
    const matchesDate =
      !filters.date || eod.date === filters.date.format("YYYY-MM-DD");
    const matchesName =
      !filters.name ||
      eod.username.toLowerCase().includes(filters.name.toLowerCase());

    return matchesDepartment && matchesProject && matchesDate && matchesName;
  });

  // Pagination
  const paginatedEods = filteredEods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Filters
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field !== "name") setCurrentPage(1); // Reset to page 1 when changing filters
  };

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
          <Option value="Developer">Developer</Option>
          <Option value="Digital Marketing">Digital Marketing</Option>
          <Option value="Sales">Sales</Option>
          <Option value="Placement Marketing">Placement Marketing</Option>
        </Select>

        {/* Project Filter */}
        {["Developer", "Digital Marketing"].includes(filters.department) && (
          <Select
            placeholder="Select Project"
            className="w-full md:w-1/6"
            onChange={(value) => handleFilterChange("project", value)}
            allowClear
          >
            {[
              ...new Set(
                eods
                  .filter((eod) => eod.department === filters.department)
                  .map((eod) => eod.project)
              ),
            ].map((project) => (
              <Option key={project} value={project}>
                {project}
              </Option>
            ))}
          </Select>
        )}

        {/* Date Filter */}
        <DatePicker
          placeholder="Filter by Date"
          className="w-full md:w-1/6"
          onChange={(date) => handleFilterChange("date", date)}
        />

        {/* Name Filter */}
        <Input
          placeholder="Search by Name"
          className="w-full md:w-1/6"
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      </div>

      {/* EOD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEods.map((eod, index) => (
          <div
            key={index}
            className="p-4 border shadow-md rounded-md bg-white"
          >
            <h3 className="font-semibold text-blue-600">{eod.username}</h3>
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
              <strong>Date:</strong> {eod.date}
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
