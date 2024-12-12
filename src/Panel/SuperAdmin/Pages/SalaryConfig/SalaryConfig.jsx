import React, { useState, useEffect } from "react";
import { GetConfig, UpdateConfig } from "../../../../services";

const InputField = ({
  label,
  name,
  type = "number",
  value,
  handleChange,
  isEdit,
  option = {},
}) => (
  <div className="flex flex-col">
    <p className="capitalize text-lg font-semibold">{label}</p>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => handleChange(e, option)}
      readOnly={!isEdit}
      className={`w-full rounded-md p-2 focus:outline-none ${
        isEdit ? "cursor-text bg-slate-300" : "cursor-default bg-slate-50"
      }`}
    />
  </div>
);

function secondsToHHMM(seconds) {
  // Calculate hours and minutes
  const hours = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((seconds % 3600) / 60); // Remaining minutes
  const remainingSeconds = seconds % 60; // Remaining seconds (optional)

  // Return formatted string (HH:MM)
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function hhmmToSeconds(timeStr) {
  // Split the string into hours and minutes
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Calculate total seconds
  const totalSeconds = hours * 3600 + minutes * 60;

  return totalSeconds;
}

const SalaryConfig = () => {
  const [config, setConfig] = useState({});
  const [backupConfig, setBackupConfig] = useState({});
  const [historyList, setHistoryList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const dummyFields = ["__v", "createdAt", "updatedAt", "lastModified"];

  // Handel data Fetch
  const handleFetch = async () => {
    try {
      const response = await GetConfig();
      const {lastModified,...otherData} = response.data.data
      setConfig((prev) => ({ ...prev, ...otherData }));
      setHistoryList(prev=>lastModified);
      setBackupConfig(otherData);
    } catch (error) {
      console.error(error, "error in fetch config");
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Handle field changes
  const handleChange = (
    e,
    { isDuration = false, isPercentage = false, isCheckBox = false }
  ) => {
    setIsEdited(true);
    console.log(isPercentage, "asd");
    let { value, name, checked } = e.target;
    value = isPercentage ? value / 100 : value;
    value = isDuration ? hhmmToSeconds(value) : value;
    setConfig((prevConfig) => {
      const updatedConfig = {
        ...prevConfig,
        [name]: isCheckBox ? checked : value,
      };
      return updatedConfig;
    });
  };

  // handle Save configuration
  const handleSave = async (id, dataToUpdate) => {
    setIsSaving(true);
    try {
      const response = await UpdateConfig(id, dataToUpdate);
      alert(response.data.data.message);
      const {lastModified,...updatedData} = response.data.data
      setConfig((prev) => ({ ...prev, ...updatedData }));
      setBackupConfig(prev=>({...prev,...updatedData}));
      setHistoryList(prev=>lastModified);
      setIsEdit(false);
      setIsEdited(false);
    } catch (error) {
      console.log("error in save", error);
      alert(error.response.data.message);
    } finally {
      setIsSaving(false);
    }
  };

  // handle edit configuration
  const handleEditClick = () => {
    if (!isEdit) {
      setIsEdit((prev) => !prev);
    } else {
      if(isEdited){
        const { _id: idToUpdate, ...dataToUpdate } = config;
      dummyFields.forEach((key) => delete dataToUpdate[key]);
      handleSave(idToUpdate, dataToUpdate);
      }else{
        alert("change something to save")
      }
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="w-3/4 p-8 bg-white shadow-lg rounded-xl ml-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Config Details
        </h2>

        {/* Display Configuration */}

        <div className="space-y-8 py-4">
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Work Time</h2>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="Working Hours (HH:MM)"
                name="workingHours"
                type="text"
                value={secondsToHHMM(config.workingHours)}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isDuration: true }}
              />
              <InputField
                label="check In Time (HH:MM)"
                name="checkInTime"
                type="text"
                value={secondsToHHMM(config.checkInTime)}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isDuration: true }}
              />
              <InputField
                label="check Out Time (HH:MM)"
                name="checkOutTime"
                type="text"
                value={secondsToHHMM(config.checkOutTime)}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isDuration: true }}
              />
            </div>
          </div>

          {/* Employer Configurations */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Employer Contribution
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Is Employer ESI */}
              <div className="flex items-center gap-2">
                <input
                  id="employer-esi"
                  type="checkbox"
                  name="isEmployerEsi"
                  onChange={(e) => handleChange(e, { isCheckBox: true })}
                  checked={config.isEmployerEsi}
                  disabled={!isEdit}
                  className={`w-5 h-5 ${isEdit?"cursor-pointer":"cursor-default"} `}
                />
                <label htmlFor="employer-esi" className={`capitalize text-lg font-semibold ${isEdit?"cursor-pointer":"cursor-default"} `}>
                  Add Employer ESI
                </label>
              </div>

              {/* Is Employer PF */}
              <div className="flex items-center gap-2">
                <input
                  id="employer-pf"
                  type="checkbox"
                  name="isEmployerPf"
                  onChange={(e) => handleChange(e, { isCheckBox: true })}
                  checked={config.isEmployerPf}
                  disabled={!isEdit}
                  className={`w-5 h-5 ${isEdit?"cursor-pointer":"cursor-default"} `}
                />
                <label htmlFor="employer-pf" className={`capitalize text-lg font-semibold ${isEdit?"cursor-pointer":"cursor-default"} `}>
                  Add Employer PF
                </label>
              </div>
            </div>
          </div>

          {/* Contributions */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Contribution Percentages
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="PF %"
                name="pf"
                value={config.pf * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="Employer PF %"
                name="employerPF"
                value={config.employerPF * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="ESI %"
                name="esi"
                value={config.esi * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="Employer ESI %"
                name="employerEsi"
                value={config.employerEsi * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
            </div>
          </div>

          {/* Allowances */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Salary</h2>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="Basic %"
                name="basic"
                value={config.basic * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="HRA %"
                name="hra"
                value={config.hra * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="Conveyance %"
                name="conveyance"
                value={config.conveyance * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
              <InputField
                label="Other Allowance %"
                name="otherAllowance"
                value={config.otherAllowance * 100}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isPercentage: true }}
              />
            </div>
          </div>

          {/* Leave Configurations */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Leave & Late Configurations
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="Sick Leave"
                name="sickLeave"
                value={config.sickLeave}
                handleChange={handleChange}
                isEdit={isEdit}
              />
              <InputField
                label="Casual Leave"
                name="casualLeave"
                value={config.casualLeave}
                handleChange={handleChange}
                isEdit={isEdit}
              />
              <InputField
                label="Permission"
                name="permission"
                value={config.permission}
                handleChange={handleChange}
                isEdit={isEdit}
              />
              <InputField
                label="Permission Duration (HH:MM)"
                name="permissionDuration"
                type="text"
                value={secondsToHHMM(config.permissionDuration)}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isDuration: true }}
              />
              <InputField
                label="Grace Time (HH:MM)"
                name="graceTime"
                type="text"
                value={secondsToHHMM(config.graceTime)}
                handleChange={handleChange}
                isEdit={isEdit}
                option={{ isDuration: true }}
              />
              <InputField
                label="Allowed Lates"
                name="approvedLate"
                value={config.approvedLate}
                handleChange={handleChange}
                isEdit={isEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Sidebar */}
      <div className="w-1/4 p-6 bg-gray-50 sticky top-0 h-screen border-r border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Actions</h3>
        <div className="flex items-center gap-2">
          <div
            onClick={handleEditClick}
            className={`text-center cursor-pointer mt-6 py-3 flex-1 text-white font-semibold rounded-lg transition-all ease-in-out ${
              isEdit
                ? "bg-green-400 hover:bg-green-500"
                : "hover:bg-indigo-700 bg-indigo-600"
            }`}
          >
            {isSaving ? <div className="flex items-center justify-center w-full gap-3">Saving... <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" /></div> : isEdit ? "Save Configuration" : "Edit Configuration"} 
          </div>
          {isEdit && (
            <div
              onClick={() => setIsEdit(false)}
              className={`text-center cursor-pointer mt-6 py-3 flex-1 text-white font-semibold rounded-lg transition-all ease-in-out bg-red-400 hover:bg-red-500`}
            >
              Cancel Edit
            </div>
          )}
        </div>
        <div className="mt-12 h-[80%]">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 h-[3%]">History</h3>
          {historyList.length > 0 ? (
            <div className="space-y-4 h-[97%] overflow-auto">
              {historyList.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl shadow-md"
                >
                  <p className="font-semibold">{item._id}</p>
                  <p className="font-medium text-gray-600">{item.date}</p>
                  <p className="text-gray-700">
                    Modified Fields: {item.modifiedFields.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className=" w-full h-[60vh] flex-col flex items-center justify-center">
              No history available
              <div class="w-full gap-x-2 flex justify-center items-center">
                <div class="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
                <div class="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
                <div class="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model */}
      {!isEdit && isEdited /* From Uiverse.io by abhishek-06-singh */ && (
        <div class="absolute bg-opacity-30 bg-white inset-0 z-10 w-screen overflow-y-auto">
          <div class="opacity-100 flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      aria-hidden="true"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="h-6 w-6 text-red-600"
                    >
                      <path
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      id="modal-title"
                      class="text-base font-semibold leading-6 text-gray-900"
                    >
                      Cancel Change
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to Cancel? All of your will be
                        removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    setIsEdited(false);
                    setConfig((prev) => ({ ...backupConfig }));
                  }}
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEdit(true);
                  }}
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  type="button"
                >
                  Continue Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryConfig;
