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


    batchManagement: {
      create: [
        'batchCreate',            // Create new employee
      ],
      manage: [
        'batchManage',            // Manage employee details
        'batchManageOwn',         // Manage own employee details
        'batchManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'batchManageOwn',
      ],
      view: [
        'batchView',              // View employee details
        'batchViewOwn',           // View own employee details
        'batchViewOther',         // View other employees' details
      ],
      viewOwn: [
        'batchViewOwn',
      ]
    },


    TaskManagement: {
      create: [
        'taskCreate',            // Create new employee
      ],
      manage: [
        'taskManage',            // Manage employee details
        'taskManageOwn',         // Manage own employee details
        'taskManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'taskManageOwn',
      ],
      view: [
        'taskView',              // View employee details
        'taskViewOwn',           // View own employee details
        'taskViewOther',         // View other employees' details
      ],
      viewOwn: [
        'taskViewOwn',
      ]
    },


    traineeManagement: {
      create: [
        'traineeCreate',            // Create new employee
      ],
      manage: [
        'traineeManage',            // Manage employee details
        'traineeManageOwn',         // Manage own employee details
        'traineeManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'traineeManageOwn',
      ],
      view: [
        'traineeView',              // View employee details
        'traineeViewOwn',           // View own employee details
        'traineeViewOther',         // View other employees' details
      ],
      viewOwn: [
        'traineeViewOwn',
      ]
    },

    scheduleManagement: {
      create: [
        'scheduleCreate',            // Create new employee
      ],
      manage: [
        'scheduleManage',            // Manage employee details
        'scheduleManageOwn',         // Manage own employee details
        'scheduleManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'scheduleManageOwn',
      ],
      view: [
        'scheduleView',              // View employee details
        'scheduleViewOwn',           // View own employee details
        'scheduleViewOther',         // View other employees' details
      ],
      viewOwn: [
        'scheduleViewOwn',
      ]
    },


    syllabusManagement: {
      create: [
        'syllabusCreate',            // Create new employee
      ],
      manage: [
        'syllabusManage',            // Manage employee details
        'syllabusManageOwn',         // Manage own employee details
        'syllabusManageOther',       // Manage other employees' details
      ],
      manageOwn:[
        'syllabusManageOwn',
      ],
      view: [
        'syllabusView',              // View employee details
        'syllabusViewOwn',           // View own employee details
        'syllabusViewOther',         // View other employees' details
      ],
      viewOwn: [
        'syllabusViewOwn',
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
  