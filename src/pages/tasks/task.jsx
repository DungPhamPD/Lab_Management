import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [filterAssignee, setFilterAssignee] = useState("Tất cả người phụ trách");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignee: "",
    assigneeName: "",
    startDate: "",
    deadline: "",
    priority: "Trung bình",
    attachments: [],
  });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressTaskIdx, setProgressTaskIdx] = useState(null);
  const [progressData, setProgressData] = useState({
    status: "",
    progress: 0,
    note: "",
    attachments: [],
  });
  const [editTaskIdx, setEditTaskIdx] = useState(null);
  const [deleteTaskIdx, setDeleteTaskIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu từ localStorage nếu có, KHÔNG dùng sampleTasks mặc định
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  // Reset form khi mở modal
  const createTask = () => {
    setNewTask({
      name: "",
      description: "",
      assignee: "",
      assigneeName: "",
      startDate: "",
      deadline: "",
      priority: "Trung bình",
      attachments: [],
    });
    setEditTaskIdx(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const getStatusColor = (status) => {
    return status === "ĐANG THỰC HIỆN" ? "#F6C23E" : "#1CC88A";
  };

  const getStatusBadge = (status) => (
    <span
      style={{
        background: status === "ĐANG THỰC HIỆN" ? "#e6f4ea" : "#e6f4ea",
        color: "#1cc88a",
        fontWeight: 600,
        fontSize: 14,
        borderRadius: 8,
        padding: "2px 14px",
        marginLeft: 10,
        ...(status === "ĐANG THỰC HIỆN" && { color: "#2e7d32" }),
      }}
    >
      {status}
    </span>
  );

  // Thêm hàm lấy màu theo progress
  const getProgressColor = (progress) => {
    if (progress <= 40) return "#f44336"; // đỏ
    if (progress <= 80) return "#ffa726"; // cam
    return "#43b244"; // xanh
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    setNewTask({
      ...newTask,
      attachments: Array.from(e.target.files).map((f) => f.name),
    });
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!newTask.name.trim() || !newTask.assignee || !newTask.deadline) {
      alert("Bạn chưa nhập đủ dữ liệu");
      return;
    }
    const taskToSave = {
      ...tasks[editTaskIdx] || {},
      name: newTask.name,
      description: newTask.description,
      assignee: newTask.assignee,
      assigneeName: newTask.assigneeName,
      startDate: newTask.startDate,
      deadline: newTask.deadline.split("-").reverse().join("/"),
      priority: newTask.priority,
      attachments: newTask.attachments,
      status: editTaskIdx !== null ? tasks[editTaskIdx].status : "ĐANG THỰC HIỆN",
      progress: editTaskIdx !== null ? tasks[editTaskIdx].progress : 0,
      note: editTaskIdx !== null ? tasks[editTaskIdx].note : "",
    };
    let updatedTasks;
    if (editTaskIdx !== null) {
      updatedTasks = [...tasks];
      updatedTasks[editTaskIdx] = taskToSave;
    } else {
      updatedTasks = [taskToSave, ...tasks];
    }
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setShowModal(false);
    setEditTaskIdx(null);
  };

  const openProgressModal = (idx) => {
    const task = tasks[idx];
    setProgressTaskIdx(idx);
    setProgressData({
      status: task.status || "",
      progress: task.progress || 0,
      note: task.note || "",
      attachments: task.attachments || [],
    });
    setShowProgressModal(true);
  };

  const handleProgressFileChange = (e) => {
    setProgressData({
      ...progressData,
      attachments: Array.from(e.target.files).map((f) => f.name),
    });
  };

  const handleProgressSave = (e) => {
    e.preventDefault();
    const updatedTasks = [...tasks];
    updatedTasks[progressTaskIdx] = {
      ...updatedTasks[progressTaskIdx],
      status: progressData.status,
      progress: progressData.progress,
      note: progressData.note,
      attachments: progressData.attachments,
    };
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setShowProgressModal(false);
  };

  return (
    <div style={{ background: "#f7fafd", minHeight: "100vh", display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 0 }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 0" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>Quản lý nhiệm vụ</h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 32, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px",
                width: 350,
                border: "1px solid #e3e6f0",
                borderRadius: 8,
                outline: "none",
                fontSize: 16,
                background: "#fff",
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "12px",
                paddingRight: "38px", // Thêm dòng này
                border: "1px solid #e3e6f0",
                borderRadius: 8,
                fontSize: 16,
                background: "#fff",
                appearance: "none",
                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"20\" viewBox=\"0 0 24 24\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "20px",
                minWidth: 180,
                lineHeight: "24px", // Cho chữ cân đối hơn
              }}
            >
              <option>Tất cả trạng thái</option>
              <option>ĐANG THỰC HIỆN</option>
              <option>ĐANG KIỂM TRA</option>
              <option>HOÀN THÀNH</option>
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              style={{
                padding: "12px",
                paddingRight: "38px", // Thêm dòng này
                border: "1px solid #e3e6f0",
                borderRadius: 8,
                fontSize: 16,
                background: "#fff",
                appearance: "none",
                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"gray\" height=\"20\" viewBox=\"0 0 24 24\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "20px",
                minWidth: 180,
                lineHeight: "24px",
              }}
            >
              <option>Tất cả người phụ trách</option>
              <option>Trường</option>
              <option>Kiên</option>
              <option>Dũng</option>
              <option>Huy</option>
            </select>
            <input
              type="date"
              style={{
                padding: "12px",
                border: "1px solid #e3e6f0",
                borderRadius: 8,
                fontSize: 16,
                background: "#fff",
              }}
            />
            <button
              onClick={createTask}
              style={{
                background: "#1976d2",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                marginLeft: "auto",
              }}
            >
              + Tạo nhiệm vụ mới
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {tasks
              .filter(
                (task) =>
                  task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (filterStatus === "Tất cả trạng thái" || task.status === filterStatus) &&
                  (filterAssignee === "Tất cả người phụ trách" || task.assignee === filterAssignee)
              )
              .map((task, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)",
                    padding: "28px 32px 24px 32px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderLeft: `4px solid ${getStatusColor(task.status)}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        background: getStatusColor(task.status),
                        borderRadius: "50%",
                        display: "inline-block",
                        marginRight: 12,
                        border: "2px solid #fff",
                        boxShadow: "0 0 0 2px #f7fafd",
                      }}
                    ></span>
                    <span style={{ fontWeight: 600, fontSize: 22 }}>{task.name}</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        title="Tiến độ"
                        onClick={() => openProgressModal(idx)}
                      >
                        <svg width="22" height="22" fill="#888">
                          <path d="M12 2v8h8a8 8 0 1 1-8-8z" />
                        </svg>
                      </button>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        title="Sửa"
                        onClick={() => {
                          setEditTaskIdx(idx);
                          setNewTask({
                            name: task.name,
                            description: task.description,
                            assignee: task.assignee,
                            assigneeName: task.assigneeName || "",
                            startDate: task.startDate || "",
                            deadline: task.deadline.split("/").reverse().join("-"), // chuyển về yyyy-mm-dd
                            priority: task.priority || "Trung bình",
                            attachments: task.attachments || [],
                          });
                          setShowModal(true);
                        }}
                      >
                        <svg width="22" height="22" fill="#888">
                          <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                        </svg>
                      </button>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        title="Xóa"
                        onClick={() => setDeleteTaskIdx(idx)}
                      >
                        <svg width="22" height="22" fill="#888">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 6 }}>
                    <span style={{ color: "#444", fontWeight: 600 }}>
                      Phụ trách:{" "}
                      <span style={{ fontWeight: 400 }}>{task.assignee || "Chưa có"}</span>
                    </span>
                    <span style={{ color: "#444", fontWeight: 600 }}>
                      Deadline: <span style={{ fontWeight: 400 }}>{task.deadline}</span>
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                  <div style={{ color: "#444", marginBottom: 12 }}>{task.description}</div>
                  <div style={{ width: "100%", marginBottom: 6 }}>
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        background: "#e3e6f0",
                        borderRadius: 8,
                        overflow: "hidden",
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: `${task.progress}%`,
                          height: "100%",
                          background: getProgressColor(task.progress), // dùng màu giống modal
                          borderRadius: 8,
                          transition: "width 0.3s",
                        }}
                      ></div>
                    </div>
                    <span style={{ color: "#444", fontSize: 15, fontWeight: 500 }}>
                      {task.progress}% Hoàn Thành
                      {task.progress === 100 && " (4 tiếng)"}
                    </span>
                  </div>
                  {task.attachments && task.attachments.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontWeight: 600 }}>Tài liệu đính kèm: </span>
                      {task.attachments.map((file, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#f4f6fa",
                            borderRadius: 8,
                            padding: "2px 10px",
                            fontSize: 14,
                            marginLeft: 6,
                            color: "#444",
                            border: "1px solid #e3e6f0",
                          }}
                        >
                          {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Modal tạo nhiệm vụ mới */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                zIndex: 1000,
                overflowY: "auto",
                maxHeight: "100vh",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 0,
                  width: "100%",
                  maxWidth: 540,
                  position: "relative",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  margin: "40px 0",
                }}
              >
                {/* Header với gradient */}
                <div
                  style={{
                    background: "linear-gradient(90deg, #6a5af9 0%, #6fd6ff 100%)",
                    padding: "24px 32px 18px 32px",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 24,
                    letterSpacing: 0.5,
                    position: "relative",
                  }}
                >
                  {editTaskIdx !== null ? "Sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
                  <button
                    onClick={closeModal}
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 24,
                      background: "none",
                      border: "none",
                      fontSize: 28,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
                {/* Form nội dung */}
                <form style={{ padding: 32, paddingTop: 18 }} onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      TÊN NHIỆM VỤ *
                    </label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border:
                          !submitted
                            ? "2px solid #bdbdbd" // xám mặc định
                            : newTask.name.trim()
                            ? "2px solid #4caf50" // xanh khi đủ
                            : "2px solid #f44336", // đỏ khi thiếu
                        borderRadius: 8,
                        fontSize: 16,
                        outline: "none",
                        marginBottom: 0,
                        background: "#fff",
                      }}
                      placeholder="Nhập tên nhiệm vụ"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      MÔ TẢ CHI TIẾT
                    </label>
                    <textarea
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #bdbdbd", // luôn xám
                        borderRadius: 8,
                        fontSize: 16,
                        outline: "none",
                        background: "#fff",
                        resize: "vertical",
                      }}
                      placeholder="Nhập mô tả chi tiết"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                        NGƯỜI PHỤ TRÁCH *
                      </label>
                      <select
                        style={{
                          width: "100%",
                          padding: "12px",
                          border:
                            !submitted
                              ? "2px solid #bdbdbd"
                              : newTask.assignee
                              ? "2px solid #4caf50"
                              : "2px solid #f44336",
                          borderRadius: 8,
                          fontSize: 16,
                          outline: "none",
                          background: "#fff",
                        }}
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        required
                      >
                        <option value="">Chọn người phụ trách</option>
                        <option value="Trường">Trường</option>
                        <option value="Kiên">Kiên</option>
                        <option value="Dũng">Dũng</option>
                        <option value="Huy">Huy</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                        TÊN NGƯỜI PHỤ TRÁCH
                      </label>
                      <input
                        type="text"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid #bdbdbd", // luôn xám
                          borderRadius: 8,
                          fontSize: 16,
                          outline: "none",
                          background: "#fff",
                        }}
                        placeholder="Nhập tên người/nhóm"
                        value={newTask.assigneeName}
                        onChange={(e) => setNewTask({ ...newTask, assigneeName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                        NGÀY BẮT ĐẦU
                      </label>
                      <input
                        type="date"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid #bdbdbd", // luôn xám
                          borderRadius: 8,
                          fontSize: 16,
                          outline: "none",
                          background: "#fff",
                        }}
                        value={newTask.startDate}
                        onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                        DEADLINE *
                      </label>
                      <input
                        type="date"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border:
                            !submitted
                              ? "2px solid #bdbdbd"
                              : newTask.deadline
                              ? "2px solid #4caf50"
                              : "2px solid #f44336",
                          borderRadius: 8,
                          fontSize: 16,
                          outline: "none",
                          background: "#fff",
                        }}
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      ĐỘ ƯU TIÊN
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #bdbdbd", // luôn xám
                        borderRadius: 8,
                        fontSize: 16,
                        outline: "none",
                        background: "#fff",
                      }}
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option>Trung bình</option>
                      <option>Cao</option>
                      <option>Thấp</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      ĐÍNH KÈM TÀI LIỆU
                    </label>
                    <div
                      style={{
                        border: "2px dashed #4caf50",
                        borderRadius: 10,
                        padding: "12px",
                        background: "#fafcff",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input type="file" multiple onChange={handleFileChange} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{
                        padding: "10px 28px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        background: "#fff",
                        color: "#444",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 28px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(90deg, #6a5af9 0%, #6fd6ff 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px 0 rgba(106,90,249,0.12)",
                      }}
                    >
                      {editTaskIdx !== null ? "Lưu thay đổi" : "Lưu nhiệm vụ"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal cập nhật tiến độ */}
          {showProgressModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                zIndex: 1000,
                overflowY: "auto",
                maxHeight: "100vh",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 0,
                  width: "100%",
                  maxWidth: 540,
                  position: "relative",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  margin: "40px 0",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(90deg, #6a5af9 0%, #6fd6ff 100%)",
                    padding: "24px 32px 18px 32px",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 24,
                    letterSpacing: 0.5,
                    position: "relative",
                  }}
                >
                  Cập nhật tiến độ
                  <button
                    onClick={() => setShowProgressModal(false)}
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 24,
                      background: "none",
                      border: "none",
                      fontSize: 28,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
                <form style={{ padding: 32, paddingTop: 18 }} onSubmit={handleProgressSave}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      TRẠNG THÁI
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #4caf50",
                        borderRadius: 8,
                        fontSize: 16,
                        outline: "none",
                        background: "#fff",
                      }}
                      value={progressData.status}
                      onChange={(e) => setProgressData({ ...progressData, status: e.target.value })}
                    >
                      <option value="ĐANG THỰC HIỆN">Đang thực hiện</option>
                      <option value="ĐANG KIỂM TRA">Đang kiểm tra</option>
                      <option value="HOÀN THÀNH">Hoàn thành</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      TIẾN ĐỘ (%)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={progressData.progress}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          let status = "";
                          if (value <= 40) status = "ĐANG THỰC HIỆN";
                          else if (value <= 80) status = "ĐANG KIỂM TRA";
                          else status = "HOÀN THÀNH";
                          setProgressData({ ...progressData, progress: value, status });
                        }}
                        style={{
                          flex: 1,
                          accentColor:
                            progressData.progress <= 40
                              ? "#f44336"
                              : progressData.progress <= 80
                              ? "#ffa726"
                              : "#43b244",
                        }}
                      />
                      <span
                        style={{
                          background:
                            progressData.progress <= 40
                              ? "#ffebee"
                              : progressData.progress <= 80
                              ? "#fff3e0"
                              : "#e8f5e9",
                          color:
                            progressData.progress <= 40
                              ? "#f44336"
                              : progressData.progress <= 80
                              ? "#ffa726"
                              : "#43b244",
                          fontWeight: 700,
                          borderRadius: 16,
                          padding: "4px 18px",
                          fontSize: 18,
                          minWidth: 60,
                          textAlign: "center",
                          border:
                            "2px solid " +
                            (progressData.progress <= 40
                              ? "#f44336"
                              : progressData.progress <= 80
                              ? "#ffa726"
                              : "#43b244"),
                        }}
                      >
                        {progressData.progress}%
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      GHI CHÚ TIẾN ĐỘ
                    </label>
                    <textarea
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #4caf50",
                        borderRadius: 8,
                        fontSize: 16,
                        outline: "none",
                        background: "#fff",
                        resize: "vertical",
                      }}
                      placeholder="Nhập ghi chú tiến độ"
                      value={progressData.note}
                      onChange={(e) => setProgressData({ ...progressData, note: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
                      ĐÍNH KÈM TÀI LIỆU/HÌNH ẢNH
                    </label>
                    <div
                      style={{
                        border: "2px dashed #4caf50",
                        borderRadius: 10,
                        padding: "12px",
                        background: "#fafcff",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input type="file" multiple onChange={handleProgressFileChange} />
                      {progressData.attachments && progressData.attachments.length > 0 && (
                        <span style={{ marginLeft: 10 }}>{progressData.attachments.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                    <button
                      type="button"
                      onClick={() => setShowProgressModal(false)}
                      style={{
                        padding: "10px 28px",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        background: "#fff",
                        color: "#444",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 28px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(90deg, #6a5af9 0%, #6fd6ff 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px 0 rgba(106,90,249,0.12)",
                      }}
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal xác nhận xóa nhiệm vụ */}
          {deleteTaskIdx !== null && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "32px 32px 24px 32px",
                  minWidth: 340,
                  boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
                  Bạn có muốn xóa nhiệm vụ này?
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
                  <button
                    onClick={() => {
                      // Xóa task
                      const updatedTasks = tasks.filter((_, i) => i !== deleteTaskIdx);
                      setTasks(updatedTasks);
                      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                      setDeleteTaskIdx(null);
                    }}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 8,
                      border: "none",
                      background: "#f44336",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => setDeleteTaskIdx(null)}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 8,
                      border: "1px solid #e0e0e0",
                      background: "#fff",
                      color: "#444",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;