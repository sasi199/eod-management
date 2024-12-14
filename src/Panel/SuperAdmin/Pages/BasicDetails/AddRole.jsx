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
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    staffs: {
      title: "Employee Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    eod: {
      title: "EOD Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    assesment: {
      title: "Assesment Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    batch: {
      title: "Batch Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    task: {
      title: "Task Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    trainee: {
      title: "Trainee Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    shedule: {
      title: "Shedule Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    syllabus: {
      title: "Syllabus Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "Manage Own", value: "manageOwn" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    leave: {
      title: "Leave Management",
      checkBoxs: [
        { title: "Request", value: "request" },
        { title: "Aprove", value: "aprove" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    payroll: {
      title: "Payroll Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },

    report: {
      title: "Report Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
        { title: "View Own", value: "viewOwn" },
      ],
      GrantedPermission: [],
    },
    system: {
      title: "System Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
      ],
      GrantedPermission: [],
    },

    role: {
      title: "Role Management",
      checkBoxs: [
        { title: "Create", value: "create" },
        { title: "Manage", value: "manage" },
        { title: "View", value: "view" },
      ],
      GrantedPermission: [],
    },
    authorityLevel: {
      title: "Authority Level",
      checkBoxs: [
        { title: "High", value: "High" },
        { title: "Medium", value: "Medium" },
        { title: "Low", value: "Low" },
      ],
      GrantedPermission: [],
    },
  };
  const [postRoles, SetPostRoles] = useState(initialState);

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
  useEffect(() => {
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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRole((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleEditChange = (category, permission) => {
    console.log(category, "cat", permission, "per");
    setSelectedRole((prevState) => {
      const updatedPermissions = { ...prevState };
      const currentPermissions = updatedPermissions[category] || [];
      if (currentPermissions.includes(permission)) {
        updatedPermissions[category] = currentPermissions.filter(
          (item) => item !== permission
        );
      } else {
        updatedPermissions[category] = [...currentPermissions, permission];
      }
      return {
        ...updatedPermissions,
      };
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
      const reducedPayload = Object.keys(postRoles).reduce((acc, current) => {
        if (
          !postRoles[current]?.checkBoxs &&
          Object.keys(postRoles[current]).length > 0
        ) {
          if (!acc[current]) {
            acc[current] = "";
          }
          acc[current] = postRoles[current];
        } else {
          if (!acc[current]) {
            acc[current] = [];
            console.log("imarra");
          }
          acc[current] = postRoles[current]?.GrantedPermission;
        }

        return acc;
      }, {});

      console.log(reducedPayload);

      const res = await CreateRole(reducedPayload);
      console.log(res.data);
      if (res.status === 201) {
        message.success("Role created Sucessfully");
        setIsAddRoleModalOpen(false);
        fetchRoles();
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      message.error(`Error in create Role ${error.message}`);
    }
  };

  const handleEditOk = async()=>{
    try {
      console.log(selectedRole)
      const res = await UpdateRole(selectedRole,selectedRole._id);
      console.log(res.data);
      fetchRoles()
      message.success('Role Updated Sucessfully')
      setIsEditModalOpen(false)
      
    } catch (error) {
      console.log(error)
      message.error(`Error in update Role ${error.message}`)
    }
  }

  const handleView = (row) => {
    setSelectedRole(row);
    setIsViewModalOpen(true);
  };

  const handleEdit = (row) => {
    console.log(row);
    setSelectedRole(row);
    form.setFieldsValue({
      roleName: row.roleName,
      permissions: row,
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

          message.success(`Role ${row.roleName} deleted successfully!`);
          fetchRoles();
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
        <div className="p-4">
          <p className="capitalize text-lg">
            <strong>Role Name:</strong> {selectedRole?.roleName}
          </p>
          <p className="text-lg">
            <strong>Level:</strong> {selectedRole?.hierarchyLevel}
          </p>
          <p className="text-lg">
            <strong>Authority Level:</strong>{" "}
            <span className="px-2 py-1">{selectedRole?.authorityLevel}</span>
          </p>

          <div className="mt-4">
            <h3 className="font-bold text-lg underline">Permissions</h3>
            {Object.entries(selectedRole || {}).map(([key, value]) => {
              if (
                [
                  "_id",
                  "__v",
                  "roleName",
                  "hierarchyLevel",
                  "authorityLevel",
                  "active",
                  "isArchive",
                ].includes(key)
              ) {
                return null;
              }
              if (Array.isArray(value) && value.length > 0) {
                return (
                  <div key={key} className="my-3">
                    <h4 className="capitalize font-bold  text-gray-800">
                      {`${key} :`}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {value.map((permission, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium capitalize"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
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
        <Form form={form} onFinish={handleEditOk} layout="vertical">
          <div className="flex gap-6 ">
            <Form.Item
              name="roleName"
              label="Role Name"
              className="w-full flex-1"
            >
              <Input
                placeholder="Enter role name"
                onChange={handleEditInputChange}
                name="roleName"
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
                onChange={handleEditInputChange}
              />
            </Form.Item>
          </div>

          <Form.Item name="permissions" label="Permissions">
            {Object.keys(postRoles)
              .filter(
                (filterItem) =>
                  postRoles[filterItem] &&
                  Array.isArray(postRoles[filterItem]?.checkBoxs)
              )
              ?.map((item) => {
                const checkedPermissions = selectedRole?.[item] || [];

                return (
                  <div className="pb-4" key={item}>
                    <p className="font capitalize text-orange-500 pb-2">
                      {postRoles[item] && postRoles[item].title}
                    </p>
                    <div className="flex gap-4">
                      {postRoles[item]?.checkBoxs?.map((list) => (
                        <Checkbox
                          key={list?.value}
                          value={list?.value}
                          onChange={() => handleEditChange(item, list?.value)}
                          checked={checkedPermissions.includes(list?.value)}
                        >
                          {list?.title}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                );
              })}
          </Form.Item>

          <div className="text-right">
            <Button onClick={handleCancel} className="mr-2">
              Cancel
            </Button>
            <Button className="bg-orange-600" type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Role Modal */}
      <Modal
        width={600}
        title={`Add Role`}
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
          <Form.Item name="permissions" label="Permissions">
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
                        ))}{" "}
                    </div>
                  </div>
                );
              })
              .filter((item) => item)}
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
