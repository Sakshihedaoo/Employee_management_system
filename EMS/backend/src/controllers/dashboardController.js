
const db = require("../config/db");

// ADMIN DASHBOARD
exports.adminDashboard = async (_req, res) => {
  try {
    const [[employees]] = await db.execute(
      "SELECT COUNT(*) AS totalEmployees FROM users WHERE role = 'EMPLOYEE' AND status = 'ACTIVE'"
    );

    const [[users]] = await db.execute(
      "SELECT COUNT(*) AS totalUsers FROM users WHERE status = 'ACTIVE'"
    );

    const [joiners] = await db.execute(
      `SELECT
         id,
         emp_id,
         name,
         department_id,
         designation_id,
         hire_date
       FROM users
       WHERE role = 'EMPLOYEE'
         AND status = 'ACTIVE'
       ORDER BY hire_date DESC
       LIMIT 5`
    );

    return res.json({
      totalEmployees: Number(employees.totalEmployees || 0),
      totalUsers: Number(users.totalUsers || 0),
      presentToday: null,
      onLeaveToday: null,
      pendingRequests: null,
      newJoiners: joiners,
      notes: "Attendance, leave and approval totals become live when their modules are implemented."
    });

  } catch (error) {
    console.error("Admin dashboard error:", error.message);
    return res.status(500).json({
      message: "Could not load admin dashboard."
    });
  }
};


// MANAGER DASHBOARD
exports.managerDashboard = async (req, res) => {
  try {
    // manager_id is not currently present in your users table.
    // Team-member count will be connected when manager assignment is implemented.

    return res.json({
      teamMembers: null,
      presentToday: null,
      pendingApprovals: null,
      onLeaveThisWeek: null,
      notes: "Manager-to-employee assignments, attendance and leave metrics are not connected yet."
    });

  } catch (error) {
    console.error("Manager dashboard error:", error.message);
    return res.status(500).json({
      message: "Could not load Manager dashboard."
    });
  }
};


// EMPLOYEE DASHBOARD
exports.employeeDashboard = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         id,
         emp_id,
         name,
         email,
         department_id,
         designation_id,
         hire_date,
         role,
         status
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    return res.json({
      profile: rows[0] || null,
      attendanceToday: null,
      leaveBalance: null,
      latestPayslip: null,
      upcomingHolidays: [],
      notes: "Attendance, leave, payroll and holidays will be connected in later modules."
    });

  } catch (error) {
    console.error("Employee dashboard error:", error.message);
    return res.status(500).json({
      message: "Could not load employee dashboard."
    });
  }
};
