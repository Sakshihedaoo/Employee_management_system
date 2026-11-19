import { useEffect, useState } from "react";
import api from "../../services/api";
import OrganizationTable from "../../components/OrganizationTable";

const sections = {
    departments: {
        title: "Departments",
        fields: [
            { name: "department_name", label: "Department Name", required: true },
            { name: "description", label: "Description" },
        ],
        columns: ["department_name", "description", "employee_count", "status"],
        empty: { department_name: "", description: "", status: "ACTIVE" },
    },

    designations: {
        title: "Designations",
        fields: [
            { name: "designation_name", label: "Designation Name", required: true },
            { name: "department_id", label: "Department", type: "department", required: true },
            { name: "description", label: "Description" },
        ],
        columns: ["designation_name", "department_name", "description", "status"],
        empty: {
            designation_name: "",
            department_id: "",
            description: "",
            status: "ACTIVE",
        },
    },

    locations: {
        title: "Locations",
        fields: [
            { name: "location_name", label: "Location Name", required: true },
            { name: "address", label: "Address", required: true },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "postal_code", label: "Postal Code" },
        ],
        columns: ["location_name", "address", "city", "state", "status"],
        empty: {
            location_name: "",
            address: "",
            city: "",
            state: "",
            postal_code: "",
            status: "ACTIVE",
        },
    },

    shifts: {
        title: "Work Shifts",
        fields: [
            { name: "shift_name", label: "Shift Name", required: true },
            { name: "start_time", label: "Start Time", type: "time", required: true },
            { name: "end_time", label: "End Time", type: "time", required: true },
            { name: "grace_minutes", label: "Grace Minutes", type: "number" },
            { name: "weekly_off_days", label: "Weekly Off Days (comma separated)" },
        ],
        columns: [
            "shift_name",
            "start_time",
            "end_time",
            "grace_minutes",
            "weekly_off_days",
            "status",
        ],
        empty: {
            shift_name: "",
            start_time: "09:00",
            end_time: "18:00",
            grace_minutes: 15,
            weekly_off_days: ["Sunday"],
            status: "ACTIVE",
        },
    },
};

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function OrganizationSetup() {
    const [activeTab, setActiveTab] = useState("departments");
    const [records, setRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const config = sections[activeTab];

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/organization/${activeTab}`);
            setRecords(response.data);

            if (activeTab === "designations") {
                const departmentResponse = await api.get(
                    "/organization/departments"
                );
                setDepartments(departmentResponse.data);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to load organization data."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setShowForm(false);
        setEditingId(null);
        setMessage("");
        loadData();
    }, [activeTab]);

    function openAddForm() {
        setForm({ ...config.empty });
        setEditingId(null);
        setShowForm(true);
        setError("");
        setMessage("");
    }

    function openEditForm(record) {
        const data = { ...record };

        if (activeTab === "shifts") {
            let offDays = data.weekly_off_days || [];

            if (typeof offDays === "string") {
                try {
                    offDays = JSON.parse(offDays);
                } catch {
                    offDays = [];
                }
            }

            data.weekly_off_days = Array.isArray(offDays)
                ? offDays
                : [];
        }

        setForm(data);
        setEditingId(record.id);
        setShowForm(true);
        setError("");
    }

    function updateField(name, value) {
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function toggleDay(day) {
        const current = form.weekly_off_days || [];

        updateField(
            "weekly_off_days",
            current.includes(day)
                ? current.filter((item) => item !== day)
                : [...current, day]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const payload = { ...form };

            if (activeTab === "shifts") {
                payload.weekly_off_days = form.weekly_off_days || [];
                payload.grace_minutes = Number(form.grace_minutes || 0);
            }

            if (editingId) {
                await api.put(
                    `/organization/${activeTab}/${editingId}`,
                    payload
                );
                setMessage("Record updated successfully.");
            } else {
                await api.post(`/organization/${activeTab}`, payload);
                setMessage("Record added successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to save record."
            );
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await api.delete(`/organization/${activeTab}/${id}`);
            setMessage("Record deleted successfully.");
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to delete record."
            );
        }
    }

    function displayValue(record, column) {
        const value = record[column];

        if (column === "weekly_off_days") {
            if (!value) return "-";

            try {
                const parsed =
                    typeof value === "string" ? JSON.parse(value) : value;
                return Array.isArray(parsed) ? parsed.join(", ") : value;
            } catch {
                return value;
            }
        }

        if (value === null || value === undefined || value === "") {
            return "-";
        }

        return value;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Organization Setup
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage departments, designations, office locations and shifts.
                        </p>
                    </div>

                    <button
                        onClick={openAddForm}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
                    >
                        + Add {config.title.slice(0, -1)}
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-3 shadow-sm">
                    {Object.entries(sections).map(([key, section]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === key
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {/* Add / Edit Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 rounded-xl bg-white p-6 shadow-sm"
                    >
                        <h2 className="mb-5 text-lg font-semibold text-slate-800">
                            {editingId ? "Edit" : "Add"} {config.title.slice(0, -1)}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            {config.fields.map((field) => (
                                <div key={field.name}>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        {field.label}
                                        {field.required && (
                                            <span className="text-red-500"> *</span>
                                        )}
                                    </label>

                                    {field.type === "department" ? (
                                        <select
                                            required={field.required}
                                            value={form.department_id || ""}
                                            onChange={(e) =>
                                                updateField("department_id", e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((department) => (
                                                <option
                                                    key={department.id}
                                                    value={department.id}
                                                >
                                                    {department.department_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.name === "weekly_off_days" ? (
                                        <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 p-3">
                                            {days.map((day) => (
                                                <label
                                                    key={day}
                                                    className="flex items-center gap-1 text-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={(form.weekly_off_days || []).includes(day)}
                                                        onChange={() => toggleDay(day)}
                                                    />
                                                    {day}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            required={field.required}
                                            value={form[field.name] ?? ""}
                                            onChange={(e) =>
                                                updateField(field.name, e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
                                        />
                                    )}
                                </div>
                            ))}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Status
                                </label>
                                <select
                                    value={form.status || "ACTIVE"}
                                    onChange={(e) => updateField("status", e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                            >
                                {editingId ? "Update" : "Save"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg bg-slate-200 px-5 py-2 text-slate-700 hover:bg-slate-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Records Table */}

                {/* Records Table */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="font-semibold text-slate-800">
                            {config.title} List
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading records...
                        </div>
                    ) : (
                        <OrganizationTable
                            columns={config.columns.map((column) => ({
                                key: column,
                                label: column.replaceAll("_", " "),
                                render: (record) => displayValue(record, column)
                            }))}
                            rows={records}
                            onEdit={openEditForm}
                            onDelete={(record) => handleDelete(record.id)}
                            emptyMessage="No records found. Click Add to create your first record."
                        />
                    )}
                </div>


            </div>
        </div>
    );
}