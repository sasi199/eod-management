import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Modal, Form, Input, Button, Select, message } from "antd";
import {
  CreateRole,
  DeleteRole,
  GetRole,
  UpdateRole,
} from "../../../../services";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { Popover, Checkbox } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const AddRole = () => {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState({});
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();
  const initialState = {
    roleName: "",
    admin: {
      title: "Admin Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    staffs:{
      title: "Employee Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    eod:{
      title: "EOD Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],

    },
    assesment:{
      title: "Assesment Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],

    },
    batch:{
      title: "Batch Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    task:{
      title: "Task Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    trainee:{
      title: "Trainee Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    shedule:{
      title: "Shedule Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    syllabus:{
      title: "Syllabus Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    leave:{
      title: "Leave Management",
      checkBoxs: [
        { title: "Request", value: "request" },
        { title: "Aprove", value: "aprove" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    payroll:{
      title: "Payroll Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    
    report:{
      title: "Report Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    system:{
      title: "System Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
      ],
      GrantedPermission: [],
    },
    
    role:{
      title: "Role Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
      ],
      GrantedPermission: [],
    },
    authorityLevel:{
      title: "Authority Level",
      checkBoxs: [
        { title: "High", value: "high" },
        { title: "Medium", value: "medium" },
        { title: "Low", value: "low" },
      ],
      GrantedPermission: [],
    }
  };
  const initialState2 = {
    roleName: "",
    admin: {
      title: "Admin Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
   
  };
  const [postRoles, SetPostRoles] = useState(initialState);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetRole();
        if (response.status === 200) {
          console.log(response.data.data);
          setRoles(response.data.data);
        } else {
          message.error("Failed to load roles.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error("Error fetching roles.");
      }
    };

    fetchRoles();
  }, []);

  const handleAddRoleClick = () => {
    setIsAddRoleModalOpen(true);
    setIsEdit(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetPostRoles({
      ...postRoles,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setIsAddRoleModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRole(null);
    form.resetFields();
  };

  const handleChange = (name, value) => {
    SetPostRoles((prev) => {
      let previous = { ...prev };

      if (previous[name]?.GrantedPermission?.includes(value)) {
        let index = previous[name]?.GrantedPermission.indexOf(value);
        previous[name]?.GrantedPermission.splice(index, 1);
        return previous;
      }
      if (!previous[name]?.GrantedPermission) {
        previous[name].GrantedPermission = [];
      }
      previous[name].GrantedPermission.push(value);

      return previous;
    });
  };

  const handleOk = async () => {
    try {
      console.log("hiii");

      let validate = Object.keys(postRoles).some(
        (item) => postRoles[item]?.GrantedPermission?.length > 0
      );
      console.log(postRoles);
      console.log(validate, "m");
      if (!validate) {
        console.log("ko");
        message.warning("Please select Permission");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (row) => {
    setSelectedRole(row);
    setIsViewModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRole(row);
    form.setFieldsValue({
      name: row.name,
      permissions: row.permissions,
      hierarchyLevel: row.hierarchyLevel,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    Modal.confirm({
      title: "Are you sure you want to delete this role?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await DeleteRole(row._id);

          message.success(`Role ${row.name} deleted successfully!`);

          setRoles(roles.filter((role) => role.id !== row.id));
        } catch (error) {
          message.error("Error deleting role. Please try again later.");
          console.error("Error deleting role:", error);
        }
      },
    });
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, i) => i + 1,
      sortable: true,
      center: true,
    },
    {
      name: "Level",
      selector: (row) => row.hierarchyLevel || "n",
      sortable: true,
      center: true,
    },
    {
      name: "Role Name",
      selector: (row) => row.roleName || "n",
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-4">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleView(row)}
          >
            <FaEye size={20} />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            onClick={() => handleEdit(row)}
          >
            <FaEdit size={20} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row)}
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      center: true,
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

  const generateContent = (arrayOfData) => {
    return (
      <div>
        {arrayOfData.map((data, i) => (
          <div className="flex items-center justify-start gap-2">
            <span>{i + 1}.</span>
            <span>{data}</span>
          </div>
        ))}
      </div>
    );
  };
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <div className="p-4">
      {/* Add Role Button */}
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition"
        onClick={handleAddRoleClick}
      >
        Add Role
      </button>

      {/* Data Table */}
      <div className="mt-4">
        <DataTable
          title="Role Details"
          columns={columns}
          customStyles={customStyles}
          data={roles}
          pagination
          className="shadow-md"
        />
      </div>

      {/* View Role Modal */}
      <Modal
        title="View Role Details"
        visible={isViewModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <p>
            <strong>Role Name:</strong> {selectedRole?.name}
          </p>
          <p>
            <strong>Level:</strong> {selectedRole?.hierarchyLevel}
          </p>
          {/* <p>
            <strong>Permissions:</strong> {selectedRole?.permissions.join(", ")}
          </p> */}
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        width={600}
        title="Edit Role"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <div className="flex gap-2">
            <div>
              <Form.Item
                name="name"
                label="Role Name"
                className="flex-1"
                rules={[
                  { required: true, message: "Please enter the role name" },
                ]}
              >
                <Input placeholder="Enter role name" />
              </Form.Item>
            </div>

            <Form.Item
              name="hierarchyLevel"
              label="Hierarchy Level"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Please enter the hierarchy level",
                  type: "number",
                  transform: (value) => Number(value),
                },
              ]}
            >
              <Input placeholder="Enter hierarchy level (e.g., 1, 2, 3)" />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="permissions"
              label="Permissions"
              rules={[{ required: true, message: "Please select permissions" }]}
            >
              {Object.keys(permissionGroups).map((permissionGroup) => {
                const groupName = permissionGroup;

                return (
                  <div className="pb-4">
                    <p className="font capitalize text-orange-500 pb-2">
                      {groupName.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </p>
                    <div className="flex">
                      {Object.keys(permissionGroups[permissionGroup]).map(
                        (permission) => {
                          const permissionName = permission;
                          return (
                            <div className="flex capitalize " key={permission}>
                              <Popover
                                onMouseEnter
                                content={generateContent(
                                  permissionGroups[groupName][permission]
                                )}
                                title="Permissions"
                              >
                                <Checkbox value={permissionName}>
                                  <div className="flex gap-2 items-center font capitalize">
                                    {permissionName}
                                  </div>
                                </Checkbox>
                              </Popover>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </Form.Item>
          </div>

          <div className="text-right">
            <Button onClick={handleCancel} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Role Modal */}
      <Modal
        width={600}
        title={`${isEdit ? "Edit role" : "Add Role"}`}
        visible={isAddRoleModalOpen}
        onCancel={handleCancel}
        // onOk={handleOk}
        footer={null}
        className="text-lg"
      >
        <Form form={form} onFinish={handleOk} layout="vertical">
          <div className="flex gap-6 ">
            <Form.Item
              name="roleName"
              label="Role Name"
              rules={[
                { required: true, message: "Please enter the role name" },
              ]}
              className="w-full flex-1"
            >
              <Input
                placeholder="Enter role name"
                name="roleName"
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              name="hierarchyLevel"
              label="Hierarchy Level"
              rules={[
                {
                  required: true,
                  message: "Please enter the hierarchy level",
                  type: "number",
                  transform: (value) => Number(value),
                },
              ]}
              className="w-full flex-1"
            >
              <Input
                placeholder="Enter hierarchy level (e.g., 1, 2, 3)"
                name="hierarchyLevel"
                onChange={handleInputChange}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="permissions"
            label="Permissions"
            // rules={[{ required: true, message: "Please select permissions" }]}
          >
            {/* Employee Management */}
            {Object.keys(postRoles)
              .filter(
                (filterItem) =>
                  postRoles[filterItem] &&
                  Array.isArray(postRoles[filterItem]?.checkBoxs)
              )

              ?.map((item) => {
                return (
                  <div className="pb-4">
                    <p className="font capitalize text-orange-500 pb-2">
                      {postRoles[item] && postRoles[item].title}
                    </p>
                    <div className="flex gap-4">
                    {postRoles[item] &&
                      postRoles[item]?.checkBoxs?.length > 0 &&
                      postRoles[item] &&
                      postRoles[item]?.checkBoxs.map((list) => (
                       
                          <Checkbox
                            value="Create"
                            onChange={() => handleChange(item, list?.value)}
                          >
                            {list?.title}
                          </Checkbox>
                       
                      ))} </div>
                  </div>
                );
              })
              .filter((item) => item)}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Employee Management
              </p>
              <div className="flex gap-4">
                <Checkbox
                  value="Create"
                  onChange={() => handleChange("staffs", "Create")}
                >
                  Create
                </Checkbox>
                <Checkbox value="Manage">Manage</Checkbox>
                <Checkbox value="employeeManageOwn">Manage Own</Checkbox>
                <Checkbox value="employeeView">View</Checkbox>
                <Checkbox value="employeeViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Admin Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Admin Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="adminCreate">Create</Checkbox>
                <Checkbox value="adminManage">Manage</Checkbox>
                <Checkbox value="adminManageOwn">Manage Own</Checkbox>
                <Checkbox value="adminView">View</Checkbox>
                <Checkbox value="adminViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Batch Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Batch Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="batchCreate">Create</Checkbox>
                <Checkbox value="batchManage">Manage</Checkbox>
                <Checkbox value="batchManageOwn">Manage Own</Checkbox>
                <Checkbox value="batchView">View</Checkbox>
                <Checkbox value="batchViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Task Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Task Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="taskCreate">Create</Checkbox>
                <Checkbox value="taskManage">Manage</Checkbox>
                <Checkbox value="taskManageOwn">Manage Own</Checkbox>
                <Checkbox value="taskView">View</Checkbox>
                <Checkbox value="taskViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Trainee Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Trainee Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="traineeCreate">Create</Checkbox>
                <Checkbox value="traineeManage">Manage</Checkbox>
                <Checkbox value="traineeManageOwn">Manage Own</Checkbox>
                <Checkbox value="traineeView">View</Checkbox>
                <Checkbox value="traineeViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Schedule Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Schedule Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="scheduleCreate">Create</Checkbox>
                <Checkbox value="scheduleManage">Manage</Checkbox>
                <Checkbox value="scheduleManageOwn">Manage Own</Checkbox>
                <Checkbox value="scheduleView">View</Checkbox>
                <Checkbox value="scheduleViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Syllabus Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Syllabus Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="syllabusCreate">Create</Checkbox>
                <Checkbox value="syllabusManage">Manage</Checkbox>
                <Checkbox value="syllabusManageOwn">Manage Own</Checkbox>
                <Checkbox value="syllabusView">View</Checkbox>
                <Checkbox value="syllabusViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Leave Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Leave Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="leaveRequest">Request</Checkbox>
                <Checkbox value="leaveApprove">Approve</Checkbox>
                <Checkbox value="leaveView">View</Checkbox>
                <Checkbox value="leaveViewOwn">View Own</Checkbox>
                <Checkbox value="leaveManage">Manage</Checkbox>
              </div>
            </div> */}

            {/* Payroll Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Payroll Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="payrollCreate">Create</Checkbox>
                <Checkbox value="payrollManage">Manage</Checkbox>
                <Checkbox value="payrollView">View</Checkbox>
                <Checkbox value="payrollViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* Report Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Report Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="reportCreate">Create</Checkbox>
                <Checkbox value="reportManage">Manage</Checkbox>
                <Checkbox value="reportView">View</Checkbox>
                <Checkbox value="reportViewOwn">View Own</Checkbox>
              </div>
            </div> */}

            {/* System Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                System Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="systemCreate">Create</Checkbox>
                <Checkbox value="systemManage">Manage</Checkbox>
                <Checkbox value="systemView">View</Checkbox>
              </div>
            </div> */}

            {/* Role Management */}
            {/* <div className="pb-4">
              <p className="font capitalize text-orange-500 pb-2">
                Role Management
              </p>
              <div className="flex gap-4">
                <Checkbox value="roleCreate">Create</Checkbox>
                <Checkbox value="roleManage">Manage</Checkbox>
                <Checkbox value="roleView">View</Checkbox>
              </div>
            </div> */}
          </Form.Item>

          <div className="text-right">
            <Button onClick={handleCancel} className="mr-2">
              Cancel
            </Button>
            <Button className="bg-orange-600" type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRole;
