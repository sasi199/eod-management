import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { CreateRole, DeleteRole, GetRole, UpdateRole } from "../../../../services"; 
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";

const { Option } = Select;

const AddRole = () => {
  const [roles, setRoles] = useState([]);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  const permissionOptions = [
    "empCreate", "empManage", "empManageOwn", "empManageOther", "empView", "empViewOwn", "empViewOther",
    "leaveRequest", "leaveApprove", "leaveView", "leaveViewOwn", "leaveViewOther", "leaveManage",
    "payslipView", "payrollViewOwn", "payslipGenerate", "payrollManage", "reportView", "reportGenerate",
    "sysConfig", "sysManageUsers", "sysViewLogs", "roleAssign", "roleView"
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await GetRole();
        if (response.status === 200) {
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
  };

  const handleCancel = () => {
    setIsAddRoleModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRole(null); 
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      name: values.name,
      permissions: values.permissions,
      hierarchyLevel: parseInt(values.hierarchyLevel, 10),
    };

    try {
      let response;
      if (selectedRole) {
        
        response = await UpdateRole(payload, selectedRole._id);
        if (response.status === 200) {
          message.success("Role updated successfully!");
          setRoles(roles.map(role => role.id === selectedRole.id ? { ...role, ...payload } : role));
        }
      } else {
       
        response = await CreateRole(payload);
        if (response.status === 200) {
          message.success("Role added successfully!");
          setRoles([...roles, { name: values.name, permissions: values.permissions, hierarchyLevel: values.hierarchyLevel }]);
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
          message.error('Error deleting role. Please try again later.');
          console.error('Error deleting role:', error);
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
          <p><strong>Role Name:</strong> {selectedRole?.name}</p>
          <p><strong>Level:</strong> {selectedRole?.hierarchyLevel}</p>
          <p><strong>Permissions:</strong> {selectedRole?.permissions.join(', ')}</p>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        title="Edit Role"
        visible={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter the role name" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: "Please select permissions" }]}>
            <Select
              mode="multiple"
              placeholder="Select permissions"
              allowClear
              className="w-full"
            >
              {permissionOptions.map((permission) => (
                <Option key={permission} value={permission}>
                  {permission}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hierarchyLevel"
            label="Hierarchy Level"
            rules={[{
              required: true,
              message: "Please enter the hierarchy level",
              type: "number",
              transform: (value) => Number(value),
            }]}>
            <Input placeholder="Enter hierarchy level (e.g., 1, 2, 3)" />
          </Form.Item>

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
        title="Add New Role"
        visible={isAddRoleModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter the role name" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: "Please select permissions" }]}>
            <Select
              mode="multiple"
              placeholder="Select permissions"
              allowClear
              className="w-full"
            >
              {permissionOptions.map((permission) => (
                <Option key={permission} value={permission}>
                  {permission}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hierarchyLevel"
            label="Hierarchy Level"
            rules={[{
              required: true,
              message: "Please enter the hierarchy level",
              type: "number",
              transform: (value) => Number(value),
            }]}>
            <Input placeholder="Enter hierarchy level (e.g., 1, 2, 3)" />
          </Form.Item>

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
    </div>
  );
};

export default AddRole;
