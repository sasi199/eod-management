import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaBookOpen } from 'react-icons/fa';
import CountUp from 'react-countup';
import * as echarts from 'echarts';
import { Table, Avatar, Tag, Select } from 'antd';

const TrainerDashboard = () => {
  const [selectedRole, setSelectedRole] = useState('HR');
  const [selectedDateRange, setSelectedDateRange] = useState('Weekly');
  
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  useEffect(() => {
    const chartDom = document.getElementById('attendance-chart');
    const myChart = echarts.init(chartDom);

    const attendanceData = {
      HR: {
        dates: ['Mon (01)', 'Tue (02)', 'Wed (03)', 'Thu (04)', 'Fri (05)', 'Sat (06)', 'Sun (07)'],
        data: [120, 200, 150, 80, 170, 160, 130], 
      },
      Coordinators: {
        dates: ['Mon (01)', 'Tue (02)', 'Wed (03)', 'Thu (04)', 'Fri (05)', 'Sat (06)', 'Sun (07)'],
        data: [100, 180, 140, 90, 60, 100, 120], 
      },
      Employees: {
        dates: ['Mon (01)', 'Tue (02)', 'Wed (03)', 'Thu (04)', 'Fri (05)', 'Sat (06)', 'Sun (07)'],
        data: [90, 170, 120, 100, 80, 90, 110], 
      },
    };

    const selectedData = attendanceData[selectedRole];

    const option = {
      xAxis: {
        type: 'category',
        data: selectedData.dates,
        axisLine: { lineStyle: { color: '#ccc' } },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { formatter: '{value} Attendees' },
      },
      series: [
        {
          data: selectedData.data,
          type: 'bar',
          itemStyle: { color: '#f97316', borderRadius: [10, 10, 0, 0] },
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
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
    },
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      render: (text, record) => (
        <div className="flex items-center space-x-4">
          <Avatar src={record.image} alt={record.trainer} size={40} />
          
        </div>
      ),
    },
    {
      title: 'Trainer',
      dataIndex: 'trainer',
      key: 'trainer',
      render: (text, record) => (
        <span className="ml-2 font-medium text-gray-800">{record.trainer}</span>
      ),
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
      align: 'center',
      render: (batch) => <Tag color="blue">{batch}</Tag>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
    },
  ];

  // Initial data for the table
  const data = [
    {
      sno: 1,
      trainer: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      batch: 'Batch A',
      subject: 'ReactJS',
      duration: '3 hrs',
    },
    {
      sno: 2,
      trainer: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      batch: 'Batch B',
      subject: 'NodeJS',
      duration: '2 hrs',
    },
    {
      sno: 3,
      trainer: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      batch: 'Batch B',
      subject: 'NodeJS',
      duration: '2 hrs',
    },
    {
      sno: 4,
      trainer: 'Michael Brown',
      image: 'https://randomuser.me/api/portraits/men/57.jpg',
      batch: 'Batch C',
      subject: 'TailwindCSS',
      duration: '4 hrs',
    },
    {
      sno: 4,
      trainer: 'Michael Brown',
      image: 'https://randomuser.me/api/portraits/men/57.jpg',
      batch: 'Batch C',
      subject: 'TailwindCSS',
      duration: '4 hrs',
    },
    {
      sno: 5,
      trainer: 'Michael Brown',
      image: 'https://randomuser.me/api/portraits/men/57.jpg',
      batch: 'Batch C',
      subject: 'TailwindCSS',
      duration: '4 hrs',
    },
  ];

  const filteredData = data.filter((item) => {
    const matchesTrainer = selectedTrainer ? item.trainer === selectedTrainer : true;
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
            <span className="text-lg text-gray-500 font-light">Staffs Count</span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={80} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-purple-600">
            <FaChalkboardTeacher className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">Trainee Count</span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={250} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-indigo-600">
            <FaClipboardList className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">Batches Count</span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={15} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-teal-500">
            <FaBookOpen className="text-3xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-lg text-gray-500 font-light">Courses Count</span>
            <div className="flex items-center">
              <strong className="text-2xl text-gray-700 font-semibold">
                <CountUp start={0} end={30} duration={2.5} />
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-lg px-6 py-4 bg-white rounded-xl">
          <div className="flex items-center justify-between py-4">
            <p className="text-lg text-gray-700 font-semibold">Attendance Chart</p>
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
            <p className="text-lg text-gray-700 font-semibold">Trainer Schedule</p>

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
            pagination={{pageSize: 4, borderColor: "#f97316;"}}
            
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
