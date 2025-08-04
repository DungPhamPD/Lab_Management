import { useState } from "react";
import Navbar from "../../components/navbar/navbar";

const statusColor = {
  "Đang Mượn": "#1abc9c",
  "Đã Trả": "#27ae60",
  "Đang Bảo Trì": "#f1c40f",
  "Đang Đặt": "#6c63ff",
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
    <div style={{ width: "100%", background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "32px 40px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "32px 32px 24px 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Quản lý thiết bị</h2>
            <button
              style={{
                background: "#1abc9c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={handleAdd}
            >
              Thêm thiết bị
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={thStyle}>Tên thiết bị</th>
                  <th style={thStyle}>Loại</th>
                  <th style={thStyle}>Vị trí</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <td style={tdStyle}>{d.name}</td>
                    <td style={tdStyle}>{d.type}</td>
                    <td style={tdStyle}>{d.location}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: statusColor[d.status] || "#888",
                          color: "#fff",
                          borderRadius: 16,
                          padding: "4px 16px",
                          fontWeight: 500,
                          fontSize: 14,
                          display: "inline-block",
                        }}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button style={iconBtnStyle} title="Sửa" onClick={() => handleEdit(idx)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button style={iconBtnStyle} title="Xóa" onClick={() => handleDelete(idx)}>
                        <span role="img" aria-label="delete">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {devices.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#aaa", padding: 32 }}>
                      Chưa có thiết bị nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, textAlign: "left", color: "#888" }}>Trang 1/1</div>
        </div>
      </div>

      {/* Modal thêm/sửa thiết bị */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ textAlign: "center", marginBottom: 24, fontWeight: 700 }}>
              {editIndex !== null ? "Sửa thiết bị" : "Thêm thiết bị"}
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tên thiết bị</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: touched.name && !form.name ? "#e57373" : "#e0e0e0",
                }}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên thiết bị"
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Loại thiết bị</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: touched.type && !form.type ? "#e57373" : "#e0e0e0",
                }}
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Loại thiết bị"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Vị trí</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: touched.location && !form.location ? "#e57373" : "#e0e0e0",
                }}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Vị trí"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                style={{
                  ...inputStyle,
                  borderColor: touched.status && !form.status ? "#e57373" : "#e0e0e0",
                  background: "#f8fafc",
                  color: form.status ? "#222" : "#888",
                }}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang Mượn">Đang Mượn</option>
                <option value="Đã Trả">Đã Trả</option>
                <option value="Đang Bảo Trì">Đang Bảo Trì</option>
                <option value="Đang Đặt">Đang Đặt</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{
                  background: "#cfc6c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                style={{
                  background: "#6c63ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={handleSave}
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
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
              Bạn có muốn xóa mục này?
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{
                  background: "#cfc6c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={cancelDelete}
              >
                Hủy
              </button>
              <button
                style={{
                  background: "#e57373",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={confirmDelete}
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
  padding: "12px 16px",
  fontWeight: 700,
  fontSize: 16,
  color: "#222",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  textAlign: "center", // căn giữa tiêu đề cột
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: 15,
  color: "#222",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center", // căn giữa nội dung cột
};

const iconBtnStyle = {
  background: "#f3f4f6",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  marginRight: 8,
  cursor: "pointer",
  fontSize: 16,
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: "32px 32px 24px 32px",
  minWidth: 350,
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};

const labelStyle = {
  fontWeight: 500,
  marginBottom: 6,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1.5px solid #e0e0e0",
  fontSize: 15,
  outline: "none",
  marginTop: 4,
  marginBottom: 0,
  background: "#f8fafc",
};