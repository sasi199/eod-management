import React, { useState, useEffect } from "react";


const InputField = ({ label, name, value, handleChange, isEdit }) => (
  <div className="flex flex-col">
    <p className="capitalize text-lg font-semibold">{label}</p>
    <input
      type="number"
      name={name}
      value={value}
      onChange={handleChange}
      readOnly={!isEdit}
      className={`w-full rounded-md p-2 focus:outline-none ${
        isEdit ? "cursor-text bg-slate-300" : "cursor-default bg-slate-50"
      }`}
    />
  </div>
);


const SalaryConfig = ({ salaryConfig, onSave, history }) => {
  const [config, setConfig] = useState(salaryConfig);
  const [editedFields, setEditedFields] = useState([]);
  const [historyList, setHistoryList] = useState(history || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  function camelToNormal(text) {
    return text.replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space before uppercase letters
  }

  const fieldsToFilter = ["_id", "v", "createdAt", "updatedAt"];

  const filterFields = (dataToFilter = []) => {
    return dataToFilter.filter(
      (configKey) => !fieldsToFilter.includes(configKey)
    );
  };
  // Handle field changes
  const handleChange = (e) => {
    const {value,name} = e.target;
    setConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig, [name]: value };
      return updatedConfig;
    });
  };

  // Format percentage values and time
  const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
  const formatTime = (value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  // Save configuration and update history
  const handleSave = () => {
    setIsSaving(true);
    const currentDate = new Date().toLocaleDateString();
    const newHistoryEntry = {
      _id: "uuidv4()",
      date: currentDate,
      modifiedFields: editedFields,
    };

    setTimeout(() => {
      setHistoryList((prevHistory) => [newHistoryEntry, ...prevHistory]);
      setEditedFields([]);
      onSave(config, newHistoryEntry);
      setIsSaving(false);
      setIsModalVisible(false);
    }, 1000);
  };

  const handleEditClick = () => setIsEdit(prev=>!prev);
  const handleCloseModal = () => setIsModalVisible(false);

  useEffect(() => {
    setHistoryList(history);
  }, [history]);

  // Render boolean fields with checkboxes
  const renderCheckbox = (field, value) => (
    <div className="flex items-center space-x-3">
      <label htmlFor={field} className="text-sm font-medium text-gray-700">
        {field}
      </label>
      <input
        type="checkbox"
        id={field}
        checked={value}
        onChange={(e) => handleChange(field, e.target.checked)}
        className="w-5 h-5"
      />
    </div>
  );

  // Render other types of fields (e.g., percentage, time)
  const renderField = (field, value, type) => {
    if (type === "boolean") {
      return renderCheckbox(field, value);
    }

    return (
      <div className="flex flex-row items-start">
        <label htmlFor={field} className="text-sm font-medium text-gray-700">
          {field}
        </label>
        <input
          id={field}
          value={
            type === "percentage"
              ? formatPercentage(value)
              : type === "time"
              ? formatTime(value)
              : value
          }
          onChange={(e) =>
            handleChange(
              field,
              type === "percentage"
                ? parseFloat(e.target.value) / 100
                : e.target.value
            )
          }
          type="text"
          className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
        />
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="w-3/4 p-8 bg-white shadow-lg rounded-xl ml-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Salary Config Details
        </h2>

        {/* Display Configuration */}

        <div className="space-y-8 py-4">
  {/* Employer Configurations */}
  <div>
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Employer Configurations</h2>
    <div className="grid grid-cols-3 gap-4">
      {/* Is Employer ESI */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isEmployerEsi"
          onChange={handleChange}
          checked={config.isEmployerEsi}
          disabled={!isEdit}
          className="cursor-pointer"
        />
        <label className="capitalize text-lg font-semibold">Is Employer ESI</label>
      </div>

      {/* Is Employer PF */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isEmployerPf"
          onChange={handleChange}
          checked={config.isEmployerPf}
          disabled={!isEdit}
          className="cursor-pointer"
        />
        <label className="capitalize text-lg font-semibold">Is Employer PF</label>
      </div>
    </div>
  </div>

  {/* Contributions */}
  <div>
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Contribution Percentages</h2>
    <div className="grid grid-cols-3 gap-4">
      <InputField label="PF %" name="pf" value={config.pf} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Employer PF %" name="employerPF" value={config.employerPF} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="ESI %" name="esi" value={config.esi} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Employer ESI %" name="employerEsi" value={config.employerEsi} handleChange={handleChange} isEdit={isEdit} />
    </div>
  </div>

  {/* Allowances */}
  <div>
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Allowances</h2>
    <div className="grid grid-cols-3 gap-4">
      <InputField label="Basic %" name="basic" value={config.basic} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="HRA %" name="hra" value={config.hra} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Conveyance %" name="conveyance" value={config.conveyance} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Other Allowance %" name="otherAllowance" value={config.otherAllowance} handleChange={handleChange} isEdit={isEdit} />
    </div>
  </div>

  {/* Leave Configurations */}
  <div>
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Leave Configurations</h2>
    <div className="grid grid-cols-3 gap-4">
      <InputField label="Sick Leave" name="sickLeave" value={config.sickLeave} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Casual Leave" name="casualLeave" value={config.casualLeave} handleChange={handleChange} isEdit={isEdit} />
      <InputField label="Permission" name="permission" value={config.permission} handleChange={handleChange} isEdit={isEdit} />
    </div>
  </div>
</div>


        {/* Edit Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 transition-all ease-in-out">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full transition-transform transform scale-95 ease-out">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Edit Salary Config
              </h3>
              <div className="space-y-6 grid grid-cols-4">
                {Object.keys(config).map((field) => {
                  if (field === "lastModified") return null;
                  const value = config[field];
                  const fieldType =
                    typeof value === "boolean"
                      ? "boolean"
                      : field.includes("Percent")
                      ? "percentage"
                      : field.includes("Time")
                      ? "time"
                      : "text";
                  return (
                    <div key={field} className="col-span-4">
                      {renderField(field, value, fieldType)}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 transition ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full py-3 ${
                    isSaving ? "bg-gray-400" : "bg-indigo-600"
                  } text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition ease-in-out`}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Sidebar */}
      <div className="w-1/4 p-6 bg-gray-50 sticky top-0 h-screen border-r border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Actions</h3>
        <button
          onClick={handleEditClick}
          className="mt-6 py-3 w-full bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all ease-in-out"
        >
          Edit Configuration
        </button>
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
          <div className="space-y-4">
            {historyList.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-md">
                <p className="font-medium text-gray-600">{item.date}</p>
                <p className="text-gray-700">
                  Modified Fields: {item.modifiedFields.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryConfig;
