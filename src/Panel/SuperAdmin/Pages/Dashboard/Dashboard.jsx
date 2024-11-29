import React, { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaClipboardList,
  FaBookOpen,
} from "react-icons/fa";
import CountUp from "react-countup";
import * as echarts from "echarts";
import { Table, Avatar, Tag, Select } from "antd";
import {
  AllStaffs,
  GetTrainee,
  GetBatches,
  GetSyllabus,
  GetAttendance,
} from "../../../../services/index";

const Dashboard = () => {
  const [selectedRole, setSelectedRole] = useState("HR");
  const [selectedDateRange, setSelectedDateRange] = useState("Weekly");

  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [staffCount, SetStaffCount] = useState(null);
  const [traineeCount, SetTraineeCount] = useState(null);
  const [batchesCount, SetBatchesCount] = useState(null);
  const [syllabusCount, SetSyllabusCount] = useState(null);
  const [attendence, SetAttendence] = useState([]);

  const FetchStaffCount = () => {
    AllStaffs()
      .then((res) => {
        SetStaffCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err, "error fetching staff");
      });
  };

  const FetchTraineeCount = () => {
    GetTrainee()
      .then((res) => {
        SetTraineeCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err, "error fetching staff");
      });
  };

  const FetchBatches = () => {
    GetBatches()
      .then((res) => {
        SetBatchesCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err, "error fetching staff");
      });
  };

  const FetchSyllabus = () => {
    GetSyllabus()
      .then((res) => {
        SetSyllabusCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err, "error fetching staff");
      });
  };

  const FetchAttendence = () => {
    GetAttendance()
      .then((res) => {
        SetAttendence(res.data.data);
      })
      .catch((err) => {
        console.log(err, "error fetching");
      });
  };

  useEffect(() => {
    FetchStaffCount();
    FetchTraineeCount();
    FetchBatches();
    FetchSyllabus();
    FetchAttendence();
  }, []);

  function getWeekDates() {
    let dates = [];
    let today = new Date();
    let dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Adjust to make Monday the start of the week
    let startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    ); // Adjust if today is Sunday

    for (let i = 0; i < 7; i++) {
      let date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      // Format the date as DD-MM-YYYY
      let formattedDate =
        ("0" + date.getDate()).slice(-2) +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        date.getFullYear();

      dates.push(formattedDate);
    }

    return dates;
  }

  // const AttendenceCount = [];

  function getCountsArray(data) {
    const counts = {};

    data.forEach((entry) => {
      // Extract the date part (YYYY-MM-DD)
      const date = entry.date.split("T")[0];

      // Increment the count for this date
      counts[date] = (counts[date] || 0) + 1;
    });

    // Get unique sorted dates
    const sortedDates = Object.keys(counts).sort();

    // Create an array of counts in the same order as the sorted dates
    return sortedDates.map((date) => counts[date]);
  }

  const countsArray = getCountsArray(attendence);

  useEffect(() => {
    const chartDom = document.getElementById("attendance-chart");
    const myChart = echarts.init(chartDom);

    // const attendanceData = {
    //   HR: {
    //     dates: [
    //       "Mon (01)",
    //       "Tue (02)",
    //       "Wed (03)",
    //       "Thu (04)",
    //       "Fri (05)",
    //       "Sat (06)",
    //       "Sun (07)",
    //     ],
    //     data: [100, 200, 150, 80, 170, 160, 130],
    //   },
    //   Coordinators: {
    //     dates: [
    //       "Mon (01)",
    //       "Tue (02)",
    //       "Wed (03)",
    //       "Thu (04)",
    //       "Fri (05)",
    //       "Sat (06)",
    //       "Sun (07)",
    //     ],
    //     data: [100, 180, 140, 90, 60, 100, 120],
    //   },
    //   Employees: {
    //     dates: [
    //       "Mon (01)",
    //       "Tue (02)",
    //       "Wed (03)",
    //       "Thu (04)",
    //       "Fri (05)",
    //       "Sat (06)",
    //       "Sun (07)",
    //     ],
    //     data: [90, 170, 120, 100, 80, 90, 110],
    //   },
    // };

    // const selectedData = attendanceData[selectedRole];

    const maxCount = Math.max(...countsArray);
    const option = {
      xAxis: {
        type: "category",
        // data: selectedData.dates,
        data: getWeekDates(),
        axisLine: { lineStyle: { color: "#ccc" } },
      },
      yAxis: {
        type: "value",
        max: maxCount + 2,
        interval: 1,
        axisLine: { lineStyle: { color: "#ccc" } },
        axisLabel: {
          formatter: "{value}",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          
          type: "shadow",// Can be 'line', 'shadow', or 'cross'
        },
        formatter: function (params) {
          const dataPoint = params[0];
          return `${dataPoint.axisValue}<br/>Attendees: ${dataPoint.data}`;
        },
      },
      series: [
        {
          data: countsArray,
          type: "bar",
          itemStyle: { color: "#f97316", borderRadius: [10, 10, 0, 0] },
          barWidth: 20,
        },
      ],
    };

    myChart.setOption(option);
  }, [selectedRole, selectedDateRange]);

  const handleDateRangeChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  // Columns for the table
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      align: "center",
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <Avatar src={record.image} alt={record.trainer} size={40} />
        </div>
      ),
    },
    {
      title: "Trainer",
      dataIndex: "trainer",
      key: "trainer",
      render: (text, record) => (
        <span className="ml-2 font-medium text-gray-800">{record.trainer}</span>
      ),
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
      align: "center",
      render: (batch) => <Tag color="blue">{batch}</Tag>,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      align: "center",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
  ];

  // Initial data for the table
  const data = [
    {
      sno: 1,
      trainer: "John Doe",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      batch: "Batch A",
      subject: "ReactJS",
      duration: "3 hrs",
    },
    {
      sno: 2,
      trainer: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      batch: "Batch B",
      subject: "NodeJS",
      duration: "2 hrs",
    },
    {
      sno: 3,
      trainer: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      batch: "Batch B",
      subject: "NodeJS",
      duration: "2 hrs",
    },
    {
      sno: 4,
      trainer: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      batch: "Batch C",
      subject: "TailwindCSS",
      duration: "4 hrs",
    },
    {
      sno: 4,
      trainer: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      batch: "Batch C",
      subject: "TailwindCSS",
      duration: "4 hrs",
    },
    {
      sno: 5,
      trainer: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      batch: "Batch C",
      subject: "TailwindCSS",
      duration: "4 hrs",
    },
  ];

  const filteredData = data.filter((item) => {
    const matchesTrainer = selectedTrainer
      ? item.trainer === selectedTrainer
      : true;
    const matchesBatch = selectedBatch ? item.batch === selectedBatch : true;
    return matchesTrainer && matchesBatch;
  });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-blue-500">
            <FaUsers className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">
              Staffs Count
            </span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={staffCount} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-purple-600">
            <FaChalkboardTeacher className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">
              Trainee Count
            </span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={traineeCount} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-indigo-600">
            <FaClipboardList className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">
              Batches Count
            </span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={batchesCount} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-teal-500">
            <FaBookOpen className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">
              Courses Count
            </span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={syllabusCount} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-lg px-6 py-4 bg-white rounded-xl">
          <div className="flex items-center justify-between py-4">
            <p className="text-lg text-gray-700 font-semibold">
              Attendance Chart
            </p>
            <div className="flex items-center">
              <select
                className="border rounded-md p-2 mr-4"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="HR">HR</option>
                <option value="Coordinators">Coordinators</option>
                <option value="Employees">Employees</option>
              </select>
              <select
                className="border rounded-md p-2"
                value={selectedDateRange}
                onChange={handleDateRangeChange}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div id="attendance-chart" style={{ height: 400 }}></div>
        </div>

        <div className="shadow-lg px-6 py-4 bg-white rounded-xl">
          <div className="flex items-center justify-between py-4">
            <p className="text-lg text-gray-700 font-semibold">
              Trainer Schedule
            </p>

            <div className="flex space-x-4">
              <Select
                placeholder="Select Trainer"
                value={selectedTrainer}
                onChange={(value) => setSelectedTrainer(value)}
                className="w-48"
              >
                <Select.Option value="">All Trainers</Select.Option>
                {data.map((item) => (
                  <Select.Option key={item.sno} value={item.trainer}>
                    {item.trainer}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Select Batch"
                value={selectedBatch}
                onChange={(value) => setSelectedBatch(value)}
                className="w-48"
              >
                <Select.Option value="">All Batches</Select.Option>
                {data.map((item) => (
                  <Select.Option key={item.sno} value={item.batch}>
                    {item.batch}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="sno"
            pagination={{ pageSize: 4, borderColor: "#f97316;" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
