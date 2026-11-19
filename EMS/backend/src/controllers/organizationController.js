const db = require("../config/db");

const configs = {
  departments: {
    table: "departments",
    fields: ["department_name", "description", "status"],
    required: ["department_name"],
    linkedTable: "users",
    linkedColumn: "department_id",
  },
  designations: {
    table: "designations",
    fields: [
      "designation_name",
      "department_id",
      "description",
      "status",
    ],
    required: ["designation_name", "department_id"],
    linkedTable: "users",
    linkedColumn: "designation_id",
  },
  locations: {
    table: "locations",
    fields: [
      "location_name",
      "address",
      "city",
      "state",
      "postal_code",
      "status",
    ],
    required: ["location_name", "address"],
    linkedTable: "users",
    linkedColumn: "location_id",
  },
  shifts: {
    table: "work_shifts",
    fields: [
      "shift_name",
      "start_time",
      "end_time",
      "grace_minutes",
      "weekly_off_days",
      "status",
    ],
    required: ["shift_name", "start_time", "end_time"],
    linkedTable: "users",
    linkedColumn: "shift_id",
  },
};

function getConfig(req) {
  return configs[req.params.type];
}

exports.list = async (req, res) => {
  try {
    const config = getConfig(req);

    if (!config) {
      return res.status(404).json({ message: "Invalid organization type." });
    }

    let sql = `SELECT * FROM ${config.table} ORDER BY id DESC`;

    if (req.params.type === "departments") {
      sql = `
        SELECT d.*,
          (SELECT COUNT(*) FROM users u
           WHERE u.department_id = d.id) AS employee_count
        FROM departments d
        ORDER BY d.id DESC
      `;
    }

    if (req.params.type === "designations") {
      sql = `
        SELECT d.*, dep.department_name
        FROM designations d
        JOIN departments dep ON dep.id = d.department_id
        ORDER BY d.id DESC
      `;
    }

    const [rows] = await db.execute(sql);
    res.json(rows);
  } catch (error) {
    console.error("Organization list error:", error);
    res.status(500).json({ message: "Unable to load organization data." });
  }
};

exports.create = async (req, res) => {
  try {
    const config = getConfig(req);

    if (!config) {
      return res.status(404).json({ message: "Invalid organization type." });
    }

    const missing = config.required.some(
      (field) => req.body[field] === undefined ||
        req.body[field] === ""
    );

    if (missing) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const fields = config.fields.filter(
      (field) => req.body[field] !== undefined
    );

    const values = fields.map((field) => {
      if (field === "weekly_off_days") {
        return JSON.stringify(req.body[field] || []);
      }
      return req.body[field];
    });

    const placeholders = fields.map(() => "?").join(", ");

    await db.execute(
      `INSERT INTO ${config.table} (${fields.join(", ")})
       VALUES (${placeholders})`,
      values
    );

    res.status(201).json({ message: "Record created successfully." });
  } catch (error) {
    console.error("Organization create error:", error);
    res.status(500).json({
      message: error.code === "ER_DUP_ENTRY"
        ? "This record already exists."
        : "Unable to create record.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const config = getConfig(req);

    if (!config) {
      return res.status(404).json({ message: "Invalid organization type." });
    }

    const fields = config.fields.filter(
      (field) => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({ message: "No fields provided for update." });
    }

    const values = fields.map((field) => {
      if (field === "weekly_off_days") {
        return JSON.stringify(req.body[field] || []);
      }
      return req.body[field];
    });

    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const [result] = await db.execute(
      `UPDATE ${config.table} SET ${setClause} WHERE id = ?`,
      [...values, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.json({ message: "Record updated successfully." });
  } catch (error) {
    console.error("Organization update error:", error);
    res.status(500).json({ message: "Unable to update record." });
  }
};

exports.remove = async (req, res) => {
  try {
    const config = getConfig(req);

    if (!config) {
      return res.status(404).json({ message: "Invalid organization type." });
    }

    const [linked] = await db.execute(
      `SELECT COUNT(*) AS total FROM ${config.linkedTable}
       WHERE ${config.linkedColumn} = ?`,
      [req.params.id]
    );

    if (linked[0].total > 0) {
      return res.status(409).json({
        message: "Cannot delete this record because employees are linked to it.",
      });
    }

    const [result] = await db.execute(
      `DELETE FROM ${config.table} WHERE id = ?`,
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    console.error("Organization delete error:", error);
    res.status(500).json({ message: "Unable to delete record." });
  }
};