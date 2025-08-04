import { useState } from "react";
import Navbar from "../../components/navbar/navbar";

const statusColor = {
  "Đang Mượn": "#06b6d4", // cyan-500
  "Đã Trả": "#10b981", // emerald-500
  "Đang Bảo Trì": "#f59e0b", // amber-500
  "Đang Đặt": "#8b5cf6", // violet-500
};

const initialForm = {
  name: "",
  type: "",
  location: "",
  status: "",
};

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleAdd = () => {
    setShowModal(true);
    setForm(initialForm);
    setTouched({});
    setEditIndex(null);
  };

  const handleEdit = (idx) => {
    setShowModal(true);
    setForm(devices[idx]);
    setTouched({});
    setEditIndex(idx);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setTouched({});
    setEditIndex(null);
  };

  const handleSave = () => {
    if (!form.name || !form.type || !form.location || !form.status) {
      setTouched({ name: true, type: true, location: true, status: true });
      return;
    }
    if (editIndex !== null) {
      // Sửa
      const newDevices = [...devices];
      newDevices[editIndex] = form;
      setDevices(newDevices);
    } else {
      // Thêm mới
      setDevices([...devices, form]);
    }
    setShowModal(false);
    setForm(initialForm);
    setTouched({});
    setEditIndex(null);
  };

  const handleDelete = (idx) => {
    setShowDeleteModal(true);
    setDeleteIndex(idx);
  };

  const confirmDelete = () => {
    const newDevices = [...devices];
    newDevices.splice(deleteIndex, 1);
    setDevices(newDevices);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <div style={{ width: "100%", background: "#f1f5f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "32px 40px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "32px 32px 24px 32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 24,
                margin: 0,
                color: "#1e293b",
              }}
            >
              Quản lý thiết bị
            </h2>
            <button
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.25)",
              }}
              onMouseOver={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 6px 16px rgba(6, 182, 212, 0.35)";
              }}
              onMouseOut={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(6, 182, 212, 0.25)";
              }}
              onClick={handleAdd}
            >
              + Thêm thiết bị
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                >
                  <th style={thStyle}>Tên thiết bị</th>
                  <th style={thStyle}>Loại</th>
                  <th style={thStyle}>Vị trí</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d, idx) => (
                  <tr
                    key={idx}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <td style={tdStyle}>{d.name}</td>
                    <td style={tdStyle}>{d.type}</td>
                    <td style={tdStyle}>{d.location}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: statusColor[d.status] || "#64748b",
                          color: "#fff",
                          borderRadius: 20,
                          padding: "6px 16px",
                          fontWeight: 500,
                          fontSize: 14,
                          display: "inline-block",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={{
                          ...iconBtnStyle,
                          background: "#22d3ee",
                          color: "#fff",
                          marginRight: 8,
                        }}
                        title="Sửa"
                        onClick={() => handleEdit(idx)}
                        onMouseOver={(e) => {
                          e.target.style.background = "#06b6d4";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#22d3ee";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        style={{
                          ...iconBtnStyle,
                          background: "#ef4444",
                          color: "#fff",
                        }}
                        title="Xóa"
                        onClick={() => handleDelete(idx)}
                        onMouseOver={(e) => {
                          e.target.style.background = "#dc2626";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#ef4444";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {devices.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: 32,
                      }}
                    >
                      Chưa có thiết bị nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, textAlign: "left", color: "#64748b" }}>
            Trang 1/1
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa thiết bị */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: 24,
                fontWeight: 700,
                color: "#1e293b",
                fontSize: 20,
              }}
            >
              {editIndex !== null ? "Sửa thiết bị" : "Thêm thiết bị"}
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tên thiết bị</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor:
                    touched.name && !form.name ? "#ef4444" : "#cbd5e1",
                }}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên thiết bị"
                autoFocus
                onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    touched.name && !form.name ? "#ef4444" : "#cbd5e1")
                }
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Loại thiết bị</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor:
                    touched.type && !form.type ? "#ef4444" : "#cbd5e1",
                }}
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Loại thiết bị"
                onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    touched.type && !form.type ? "#ef4444" : "#cbd5e1")
                }
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Vị trí</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor:
                    touched.location && !form.location ? "#ef4444" : "#cbd5e1",
                }}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Vị trí"
                onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    touched.location && !form.location ? "#ef4444" : "#cbd5e1")
                }
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                style={{
                  ...inputStyle,
                  borderColor:
                    touched.status && !form.status ? "#ef4444" : "#cbd5e1",
                  background: "#f8fafc",
                  color: form.status ? "#1e293b" : "#64748b",
                }}
                name="status"
                value={form.status}
                onChange={handleChange}
                onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    touched.status && !form.status ? "#ef4444" : "#cbd5e1")
                }
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang Mượn">Đang Mượn</option>
                <option value="Đã Trả">Đã Trả</option>
                <option value="Đang Bảo Trì">Đang Bảo Trì</option>
                <option value="Đang Đặt">Đang Đặt</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                style={{
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                }}
                onClick={handleClose}
                onMouseOver={(e) => {
                  e.target.style.background = "#475569";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#64748b";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                  boxShadow: "0 4px 12px rgba(6, 182, 212, 0.25)",
                }}
                onClick={handleSave}
                onMouseOver={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(6, 182, 212, 0.35)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(6, 182, 212, 0.25)";
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalStyle, minWidth: 320, textAlign: "center" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                marginBottom: 24,
                color: "#1e293b",
              }}
            >
              Bạn có muốn xóa mục này?
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                style={{
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                }}
                onClick={cancelDelete}
                onMouseOver={(e) => {
                  e.target.style.background = "#475569";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#64748b";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                }}
                onClick={confirmDelete}
                onMouseOver={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(239, 68, 68, 0.35)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(239, 68, 68, 0.25)";
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "16px",
  fontWeight: 700,
  fontSize: 16,
  color: "#1e293b",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  textAlign: "center",
};

const tdStyle = {
  padding: "16px",
  fontSize: 15,
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "center",
};

const iconBtnStyle = {
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 16,
  transition: "all 0.2s ease",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 20,
  padding: "32px",
  minWidth: 400,
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)",
  border: "1px solid #e2e8f0",
};

const labelStyle = {
  fontWeight: 600,
  marginBottom: 8,
  display: "block",
  color: "#374151",
  fontSize: 14,
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "2px solid #cbd5e1",
  fontSize: 15,
  outline: "none",
  marginTop: 4,
  marginBottom: 0,
  background: "#f8fafc",
  color: "#1e293b",
  transition: "all 0.2s ease",
};
