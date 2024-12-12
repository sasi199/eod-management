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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetRole();
        if (response.status === 200) {
          setRoles(response.data.data.roles);
          setPermissionGroups(response.data.data.permissionGroups);
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
  };

  const handleCancel = () => {
    setIsAddRoleModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRole(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    // const payload = {
    //   name: values.name,
    //   permissions: values.permissions,
    //   hierarchyLevel: parseInt(values.hierarchyLevel, 10),
    // };

    try {
      let response;
      if (selectedRole) {
        response = await UpdateRole(payload, selectedRole._id);
        if (response.status === 200) {
          message.success("Role updated successfully!");
          setRoles(
            roles.map((role) =>
              role.id === selectedRole.id ? { ...role, ...payload } : role
            )
          );
        }
      } else {
        response = await CreateRole(payload);
        if (response.status === 200) {
          message.success("Role added successfully!");
          setRoles([
            ...roles,
            {
              name: values.name,
              permissions: values.permissions,
              hierarchyLevel: values.hierarchyLevel,
            },
          ]);
        }
      }
      handleCancel();
    } catch (error) {
      console.error("Error handling role:", error);
      message.error("Failed to process role. Please try again.");
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
      selector: (row) => row.name || "n",
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
          <p>
            <strong>Permissions:</strong> {selectedRole?.permissions.join(", ")}
          </p>
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
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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
        title="Add New Role"
        visible={isAddRoleModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="text-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <div className="flex gap-6 ">
            <Form.Item
              name="name"
              label="Role Name"
              rules={[
                { required: true, message: "Please enter the role name" },
              ]}
              className="w-full flex-1"
            >
              <Input placeholder="Enter role name" />
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
              <Input placeholder="Enter hierarchy level (e.g., 1, 2, 3)" />
            </Form.Item>
          </div>
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
                  <div className="flex gap-4">
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
                              <div className="flex gap-2 items-center">
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
