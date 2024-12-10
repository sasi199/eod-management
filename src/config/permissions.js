const permissionGroups = {
    employeeManagement: {
      create: [
        'empCreate',            // Create new employee
      ],
      manage: [
        'empManage',            // Manage employee details
        'empManageOwn',         // Manage own employee details
        'empManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'empManageOwn',
      ],
      view: [
        'empView',              // View employee details
        'empViewOwn',           // View own employee details
        'empViewOther',         // View other employees' details
      ],
      viewOwn: [
        'empViewOwn',
      ]
    },

    adminManagement: {
      create: [
        'adminCreate',            // Create new employee
      ],
      manage: [
        'adminManage',            // Manage employee details
        'adminManageOwn',         // Manage own employee details
        'adminManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'adminManageOwn',
      ],
      view: [
        'adminView',              // View employee details
        'adminViewOwn',           // View own employee details
        'adminViewOther',         // View other employees' details
      ],
      viewOwn: [
        'adminViewOwn',
      ]
    },
  
    leaveManagement: {
      request: [
        'leaveRequest',         // Request leave
      ],
      approve: [
        'leaveApprove',         // Approve leave requests
      ],
      view: [
        'leaveView',            // View leave details
        'leaveViewOwn',         // View own leave details
        'leaveViewOther',       // View other employees' leave details
      ],
      viewOwn: [
        'leaveViewOwn',
      ],
      manage: [
        'leaveManage',          // Manage leave types, balances, etc.
      ],
    },
  
    payrollManagement: {
      view: [
        'payslipView',          // View payslips
        'payrollViewOwn',       // View own payroll details
      ],
      viewOwn: [
        'payrollViewOwn',
      ],
      generate: [
        'payslipGenerate',      // Generate payslips
      ],
      manage: [
        'payrollManage',        // Manage payroll and salary details
      ]
    },
  
    reportManagement: {
      view: [
        'reportView',           // View reports (company, team, etc.)
      ],
      generate: [
        'reportGenerate',       // Generate reports
      ]
    },
  
    systemManagement: {
      configure: [
        'sysConfig',            // Configure system settings
      ],
      manageUsers: [
        'sysManageUsers',       // Manage users (admin tasks)
      ],
      viewLogs: [
        'sysViewLogs',          // View system logs
      ]
    },
  
    roleManagement: {
      create:[
        'roleCreate'
      ],
      manage:[
        'roleManage'
      ],
      assign: [
        'roleAssign',           // Assign roles to users
      ],
      view: [
        'roleView',             // View role details
      ]
    }
  };
  
  // Create an array of all permissions
  const allPermissions = [
    // Employee Management
    'empCreate',
    'empManage',
    'empManageOwn',
    'empManageOther',
    'empView',
    'empViewOwn',
    'empViewOther',

    // Employee Management
    'adminCreate',
    'adminManage',
    'adminManageOwn',
    'adminManageOther',
    'adminView',
    'adminViewOwn',
    'adminViewOther',
  
    // Leave Management
    'leaveRequest',
    'leaveApprove',
    'leaveView',
    'leaveViewOwn',
    'leaveViewOther',
    'leaveManage',
  
    // Payroll Management
    'payslipView',
    'payrollViewOwn',
    'payslipGenerate',
    'payrollManage',
  
    // Report Management
    'reportView',
    'reportGenerate',
  
    // System Management
    'sysConfig',
    'sysManageUsers',
    'sysViewLogs',
  
    // Role Management
    'roleAssign',
    'roleView'
  ];
  
  module.exports = { permissionGroups, allPermissions };
  