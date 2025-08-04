import { useState } from "react";
import Navbar from "../../components/navbar/navbar";

const statusColor = {
  "Hoàn thành": "#21c97a",
  "Đang thực hiện": "#2574fb",
  "Tạm dừng": "#ffc107",
};

const progressBg = "#e9ecef";

const initialForm = {
  name: "",
  start: "",
  end: "",
  progress: "",
  status: "",
};

export default function Project() {
  const [projects, setProjects] = useState([]);
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
    setForm(projects[idx]);
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
    if (!form.name || !form.start || !form.end || !form.progress || !form.status) {
      setTouched({
        name: true,
        start: true,
        end: true,
        progress: true,
        status: true,
      });
      return;
    }
    if (editIndex !== null) {
      // Sửa
      const newProjects = [...projects];
      newProjects[editIndex] = { ...form, progress: Number(form.progress) };
      setProjects(newProjects);
    } else {
      // Thêm mới
      setProjects([...projects, { ...form, progress: Number(form.progress) }]);
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
    const newProjects = [...projects];
    newProjects.splice(deleteIndex, 1);
    setProjects(newProjects);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <div style={{ width: "100%", background: "#f6f9fc", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "32px 40px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "32px 32px 24px 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: 36,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Quản lý dự án
          </h2>
          <button
            style={{
              background: "#2574fb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 32px",
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 24,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37,116,251,0.08)",
              transition: "background 0.2s",
              display: "block",
            }}
            onClick={handleAdd}
          >
            Thêm dự án
          </button>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f6f8" }}>
                  <th style={thStyle}>STT</th>
                  <th style={thStyle}>Tên dự án</th>
                  <th style={thStyle}>Bắt đầu</th>
                  <th style={thStyle}>Kết thúc</th>
                  <th style={thStyle}>Tiến độ</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr
                    key={idx}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#f8fafb",
                    }}
                  >
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={tdStyle}>{p.start}</td>
                    <td style={tdStyle}>{p.end}</td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          width: 100,
                          margin: "0 auto",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            background: progressBg,
                            borderRadius: 8,
                            height: 18,
                            width: "100%",
                          }}
                        ></div>
                        <div
                          style={{
                            background: "#2574fb",
                            borderRadius: 8,
                            height: 18,
                            width: `${p.progress}%`,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transition: "width 0.3s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {p.progress}%
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: statusColor[p.status],
                          color: "#fff",
                          borderRadius: 16,
                          padding: "4px 20px",
                          fontWeight: 600,
                          fontSize: 15,
                          display: "inline-block",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={{
                          background: "#2574fb",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 16px",
                          marginRight: 8,
                          cursor: "pointer",
                          color: "#fff",
                          fontSize: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Sửa"
                        onClick={() => handleEdit(idx)}
                      >
                        <span role="img" aria-label="edit">
                          ✏️
                        </span>
                      </button>
                      <button
                        style={{
                          background: "#f44336",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 16px",
                          cursor: "pointer",
                          color: "#fff",
                          fontSize: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Xóa"
                        onClick={() => handleDelete(idx)}
                      >
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa dự án */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ textAlign: "center", marginBottom: 24, fontWeight: 700, fontSize: 28 }}>
              {editIndex !== null ? "Sửa dự án" : "Thêm dự án"}
            </h3>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 350,
              }}
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div style={{ marginBottom: 16, width: "100%" }}>
                <label style={{ ...labelStyle, textAlign: "left", width: "100%" }}>Tên dự án</label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: touched.name && !form.name ? "#e57373" : "#e0e0e0",
                  }}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tên dự án"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 16, width: "100%" }}>
                <label style={{ ...labelStyle, textAlign: "left", width: "100%" }}>Ngày bắt đầu</label>
                <input
                  type="date"
                  style={{
                    ...inputStyle,
                    borderColor: touched.start && !form.start ? "#e57373" : "#e0e0e0",
                  }}
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div style={{ marginBottom: 16, width: "100%" }}>
                <label style={{ ...labelStyle, textAlign: "left", width: "100%" }}>Ngày kết thúc</label>
                <input
                  type="date"
                  style={{
                    ...inputStyle,
                    borderColor: touched.end && !form.end ? "#e57373" : "#e0e0e0",
                  }}
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div style={{ marginBottom: 16, width: "100%" }}>
                <label style={{ ...labelStyle, textAlign: "left", width: "100%" }}>Tiến độ (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  style={{
                    ...inputStyle,
                    borderColor: touched.progress && !form.progress ? "#e57373" : "#e0e0e0",
                  }}
                  name="progress"
                  value={form.progress}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </div>
              <div style={{ marginBottom: 24, width: "100%" }}>
                <label style={{ ...labelStyle, textAlign: "left", width: "100%" }}>Trạng thái</label>
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
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <button
                  type="button"
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
                  type="submit"
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
                >
                  Lưu
                </button>
              </div>
            </form>
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
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
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
  padding: "16px 12px",
  fontWeight: 700,
  fontSize: 18,
  color: "#444",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  textAlign: "center",
};

const tdStyle = {
  padding: "18px 12px",
  fontSize: 16,
  color: "#222",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
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
  borderRadius: 18,
  padding: "32px 32px 24px 32px",
  minWidth: 350,
  boxShadow: "0 8px 32px rgba(37,116,251,0.18), 0 1.5px 8px rgba(0,0,0,0.07)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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
  transition: "border 0.2s",
};
