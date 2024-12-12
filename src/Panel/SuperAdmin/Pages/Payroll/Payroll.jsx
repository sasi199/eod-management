import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { GetInitialPayrollData, GetLeaveDetails, GetPaySlipDetails } from "../../../../services";

const LeaveDetailLoading = () => {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Loading State for Available Leaves */}
      <div className="bg-blue-50 p-1 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-blue-200 rounded mb-2"></div>
        <div className="h-8 bg-blue-300 rounded"></div>
      </div>

      {/* Loading State for Leaves Taken */}
      <div className="bg-green-50 p-1 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-green-200 rounded mb-2"></div>
        <div className="h-8 bg-green-300 rounded"></div>
      </div>

      {/* Loading State for Lates */}
      <div className="bg-yellow-50 p-1 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-yellow-200 rounded mb-2"></div>
        <div className="h-8 bg-yellow-300 rounded"></div>
      </div>

      {/* Loading State for Permissions */}
      <div className="bg-purple-50 p-1 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-purple-200 rounded mb-2"></div>
        <div className="h-8 bg-purple-300 rounded"></div>
      </div>
    </div>
  );
};

const BasicDetailsLoading = () => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow animate-pulse">
      {/* Title Placeholder */}
      <div className="h-6 bg-gray-200 rounded mb-3"></div>

      {/* Salary Placeholder */}
      <div className="h-8 bg-gray-300 rounded mb-4"></div>

      {/* Details Placeholder */}
      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

const PayslipLoading = () => {
  return (
    <div className="mt-6 animate-pulse">
      {/* Earnings Card Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <ul className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <li key={index} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* Deductions Card Loading */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <ul className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <li key={index} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Net Salary Placeholder */}
      <div className="mt-6 bg-green-50 p-6 rounded-lg shadow">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>

      {/* Actions Placeholder */}
      <div className="mt-6 flex justify-end space-x-4">
        <div className="h-10 bg-indigo-300 rounded-lg w-32"></div>
      </div>
    </div>
  );
};

const Payroll = () => {
  const { RangePicker, MonthPicker } = DatePicker;
  const todayDate = new Date();

  const getPreviousMonthDate = () => {
    let month = todayDate.getMonth();
    let year = todayDate.getFullYear();

    if (month === 0) {
      month = 12;
      year -= 1;
    }

    return { month, year };
  };

  const { month: prevMonth, year: prevYear } = getPreviousMonthDate();

  const initialDateObj = {
    startMonth: prevMonth,
    startYear: prevYear,
    endMonth: prevMonth,
    endYear: prevYear,
    month: prevMonth,
    year: prevYear,
  };

  const initialLeaveDetails = {
    availableLeave: 0,
    leavesTaken: 0,
    lates: 0,
    permissionsTaken: 0,
    isUpdated: false,
  };

  const initialBasicDetails = {
    grossSalary: 0,
    basic: 0,
    hra: 0,
    conveyance: 0,
    otherAllowance: 0,
    isUpdated: false,
  };

  const initialPaySlipDetails = {
    basic: 0,
    hra: 0,
    conveyance: 0,
    otherAllowance: 0,
    bonus: 0,
    lopDeduction: 0,
    pf: 0,
    esi: 0,
    tax: 0,
    totalSalary: 0,
    isUpdated: false,
  };

  const [dateObj, setDateObj] = useState(initialDateObj);

  const [leaveDetails, setLeaveDetails] = useState(initialLeaveDetails);

  const [basicDetails, setBasicDetails] = useState(initialBasicDetails);

  const [paySlipDetails, setPaySlipDetails] = useState(initialPaySlipDetails);

  // Function to disable future dates (end of current month restriction)
  const disabledDate = (current) => {
    return current && current.isAfter(dayjs().endOf("month"));
  };

  // Function to format ISO date based on year and month
  const isoDate = (y, m) => {
    const month = String(m).padStart(2, "0");
    return dayjs(`${y}-${month}-01`, "YYYY-MM-DD");
  };

  // Handle RangePicker changes
  const handleDateChange = (date) => {
    if (date) {
      const [startDate, endDate] = date;

      if (startDate.isAfter(endDate)) {
        console.warn("Start date cannot be after end date!");
        return;
      }

      const { $M: startMonth, $y: startYear } = startDate;
      const { $M: endMonth, $y: endYear } = endDate;

      setDateObj((prev) => ({
        ...prev,
        startYear,
        startMonth: startMonth + 1,
        endYear,
        endMonth: endMonth + 1,
      }));
    }
  };

  const handelPaySlipDateChange = (date) => {
    console.log(date);
    const { $M: month, $y: year } = date;

    setDateObj((prev) => ({ ...prev, month: month + 1, year }));
  };

  // PrePopulate RangePicker with the current start and end months
  const rangeDateValue = [
    isoDate(dateObj.startYear, dateObj.startMonth),
    isoDate(dateObj.endYear, dateObj.endMonth),
  ];

  const paySlipDefaultDate = isoDate(dateObj.year, dateObj.month);

  console.log("Selected Date Range:", dateObj);

  const data = {
    pendingLeaves: 5,
    totalLeaves: 20,
    pendingCompOff: 2,
    totalCompOff: 10,
  };

  const handelDownloadPaySlip = () => {
    console.log("download clicked");
  };

  const handelInitialFetch = async () => {
    const { startMonth, startYear, endMonth, endYear, month, year } = dateObj;
    try {
      const response = await GetInitialPayrollData(
        month,
        year,
        startMonth,
        startYear,
        endMonth,
        endYear
      );
      const { leaveDetail, basicDetails, paySlipDetails } = response.data.data;

      setLeaveDetails((prev) => ({ ...prev, ...leaveDetail, isUpdated: true }));
      setBasicDetails((prev) => ({
        ...prev,
        ...basicDetails,
        isUpdated: true,
      }));
      setPaySlipDetails((prev) => ({
        ...prev,
        ...paySlipDetails,
        isUpdated: true,
      }));
    } catch (error) {
      console.log(error, "error initial");
      alert(error.response.data.message);
    }
  };

  const handelLeaveDetailsFetch = async()=>{
    setLeaveDetails(prev=>({...prev,isUpdated:false}))
    try {
    const { startMonth, startYear, endMonth, endYear, } = dateObj;
    const response = await GetLeaveDetails(startMonth,startYear,endMonth,endYear);
    setLeaveDetails((prev) => ({ ...prev, ...response.data.data, isUpdated: true }));
    } catch (error) {
        console.log(error,"error leave details");
        alert(error.response.data.message);
    } finally {
        setLeaveDetails(prev=>({...prev,isUpdated:true}));
    }
  }

  const handelPaySlipDetailsFetch = async()=>{
    setPaySlipDetails(prev=>({...prev,isUpdated:false}))
    try {
    const { startMonth, startYear, endMonth, endYear, } = dateObj;
    const response = await GetPaySlipDetails(startMonth,startYear,endMonth,endYear);
    setPaySlipDetails((prev) => ({ ...prev, ...response.data.data, isUpdated: true }));
    } catch (error) {
        console.log(error,"error PaySlip details");
        alert(error.response.data.message);
    } finally {
        setPaySlipDetails(prev=>({...prev,isUpdated:true}));
    }
  }

  useEffect(()=>{
    handelInitialFetch();
  },[])

  useEffect(()=>{
    if(leaveDetails.isUpdated){
        handelLeaveDetailsFetch();
    }
  },[dateObj.endYear,dateObj.startYear,dateObj.endMonth,dateObj.startMonth])

  useEffect(()=>{
    if(paySlipDetails.isUpdated){
        handelPaySlipDetailsFetch();
    }
  },[dateObj.month,dateObj.year])

  return (
    <div className="grid grid-rows-[40%, 60%] gap-3 bg-white p-3">
      <div className="mx-auto bg-white p-3 rounded-lg shadow-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-[62%,35%] gap-6">
          <div className="">
            {/* Leave Overview */}
            <div className="flex justify-between items-center gap-3 mb-4">
              <p className="text-2xl font-semibold">Leave Overview</p>
              <div className="flex flex-col w-[67%]">
                <span className="text-sm text-gray-600 mb-2">
                  Select Payroll Month Range:
                </span>
                <RangePicker
                  value={rangeDateValue}
                  onChange={handleDateChange}
                  picker="month"
                  className="p-2 border border-gray-300 rounded w-full"
                  disabledDate={disabledDate}
                />
              </div>
            </div>

            {/* Leave Summary */}
            {leaveDetails.isUpdated ? (
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-1 rounded-lg shadow">
                  <div className="text-lg flex items-center flex-wrap gap-2 font-semibold text-gray-700 mb-2">
                    <div>Available Leaves</div>
                    <div className="text-xs">*(CL and SL excluded)</div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {leaveDetails.availableLeave}
                  </p>
                </div>

                <div className="bg-green-50 p-1 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Leaves Taken
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {leaveDetails.leavesTaken}
                  </p>
                </div>

                <div className="bg-yellow-50 p-1 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Lates
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {leaveDetails.lates}
                  </p>
                </div>

                <div className="bg-purple-50 p-1 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Permissions
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {leaveDetails.permissionsTaken}
                  </p>
                </div>
              </div>
            ) : (
              <LeaveDetailLoading />
            )}
          </div>

          {/* Salary Summary */}
          {basicDetails.isUpdated ? (
            <div className="bg-gray-50 p-3 rounded-lg shadow">
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                Basic Monthly Salary
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {basicDetails.grossSalary}
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-gray-700 mb-3">
                  <span className="text-sm">Basic</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {basicDetails.basic}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 mb-3">
                  <span className="text-sm">HRA</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {basicDetails.hra}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="text-sm">Conveyance</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {basicDetails.conveyance}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="text-sm">Other Allowance</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {basicDetails.otherAllowance}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <BasicDetailsLoading />
          )}
        </div>
      </div>

      {/* Payslip Details */}
      <div className="bg-white rounded-md p-3">
        {paySlipDetails.isUpdated ? (
          <div className="mt-6">
            <div className="w-full flex justify-end items-center p-2">
              <MonthPicker
                id="monthYear"
                value={paySlipDefaultDate}
                onChange={handelPaySlipDateChange}
                format="YYYY/MM"
                className="border p-2 rounded"
                disabledDate={(current) =>
                  current && current.isSame(dayjs(), "month")
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Earnings
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between text-gray-600">
                    <span>Basic Salary</span>
                    <span>{paySlipDetails.basic}</span>
                  </li>
                  <li className="flex justify-between text-gray-600">
                    <span>HRA</span>
                    <span>{paySlipDetails.hra}</span>
                  </li>
                  <li className="flex justify-between text-gray-600">
                    <span>Conveyance</span>
                    <span>{paySlipDetails.conveyance}</span>
                  </li>
                  {paySlipDetails.otherAllowance > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>Other Allowance</span>
                      <span>{paySlipDetails.otherAllowance}</span>
                    </li>
                  )}
                  {paySlipDetails.bonus > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>Bonus</span>
                      <span>{paySlipDetails.bonus}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Deductions
                </h3>
                <ul className="space-y-4">
                  {paySlipDetails.pf > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>PF</span>
                      <span>{paySlipDetails.pf}</span>
                    </li>
                  )}
                  {paySlipDetails.esi > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>ESI</span>
                      <span>{paySlipDetails.esi}</span>
                    </li>
                  )}
                  {paySlipDetails.tax > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>{paySlipDetails.tax}</span>
                    </li>
                  )}
                  {paySlipDetails.lopDeduction > 0 && (
                    <li className="flex justify-between text-gray-600">
                      <span>LOP</span>
                      <span>{paySlipDetails.lopDeduction}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-6 bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Net Salary
              </h3>
              <div className="flex justify-between text-gray-800">
                <span className="font-bold">Earned Salary</span>
                <span className="text-xl font-semibold">
                  {paySlipDetails.totalSalary}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handelDownloadPaySlip}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
              >
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <PayslipLoading />
        )}
      </div>
    </div>
  );
};

export default Payroll;
