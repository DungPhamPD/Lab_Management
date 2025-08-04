import { useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const statusColor = (status) =>
  status === "Hoạt động"
    ? "bg-emerald-400"
    : status === "Tạm khóa"
    ? "bg-yellow-400"
    : status === "Khóa vĩnh viễn"
    ? "bg-red-400"
    : status === "Bảo trì"
    ? "bg-blue-400"
    : "bg-gray-300";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOpen = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "",
    });
    setEditIndex(null);
    setOpen(true);
  };

  const handleEdit = (idx) => {
    setForm(users[idx]);
    setEditIndex(idx);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.phone && form.role && form.status) {
      if (editIndex !== null) {
        // Sửa
        const newUsers = [...users];
        newUsers[editIndex] = form;
        setUsers(newUsers);
      } else {
        // Thêm mới
        setUsers([...users, form]);
      }
      setOpen(false);
    }
  };

  const handleDelete = (idx) => {
    setDeleteIndex(idx);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((_, i) => i !== deleteIndex));
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const isFormValid = form.name && form.email && form.phone && form.role && form.status;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0">
                Quản lí người dùng
              </h1>
              <button
                className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-medium transition"
                onClick={handleOpen}
              >
                Thêm người dùng
              </button>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-600 text-base border-b">
                    <th className="py-4 px-4 text-left font-medium">Họ và tên</th>
                    <th className="py-4 px-4 text-left font-medium">Email</th>
                    <th className="py-4 px-4 text-left font-medium">Số điện thoại</th>
                    <th className="py-4 px-4 text-left font-medium">Vai trò</th>
                    <th className="py-4 px-4 text-left font-medium">Trạng thái</th>
                    <th className="py-4 px-4 text-left font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-400">
                        Chưa có người dùng nào
                      </td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{u.phone}</td>
                        <td className="py-3 px-4">{u.role}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-4 py-1 rounded-full text-white text-xs font-semibold ${statusColor(
                              u.status
                            )}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded hover:bg-gray-100 text-emerald-500"
                              onClick={() => handleEdit(idx)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              className="p-2 rounded hover:bg-gray-100 text-red-400"
                              onClick={() => handleDelete(idx)}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
              <span>Trang 1/1</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100">
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-100">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal thêm người dùng */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
            border: "2px solid #60a5fa",
            p: 0,
            overflow: "visible",
          }}
        >
          <div
            style={{
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
              background: "linear-gradient(90deg, #f7fafd 60%, #e0e7ff 100%)",
              padding: "24px 36px 12px 36px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
              fontSize: 22,
              color: "#22324a",
            }}
          >
            Thêm người dùng
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 px-8 py-6"
            autoComplete="off"
          >
            <TextField
              label="Họ và tên"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              size="medium"
              margin="dense"
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              size="medium"
              margin="dense"
              type="email"
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              required
              size="medium"
              margin="dense"
              type="tel"
            />
            <FormControl fullWidth required margin="dense" size="medium">
              <InputLabel>Vai trò</InputLabel>
              <Select
                label="Vai trò"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Nhân viên">Nhân viên</MenuItem>
				<MenuItem value="Quản lí">Quản lí</MenuItem>
				<MenuItem value="Leader">Leader</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required margin="dense" size="medium">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Tạm khóa">Tạm khóa</MenuItem>
				<MenuItem value="Khóa vĩnh viễn">Khóa vĩnh viễn</MenuItem>
                <MenuItem value="Bảo trì">Bảo trì</MenuItem>
              </Select>
            </FormControl>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                onClick={handleClose}
                variant="outlined"
                color="inherit"
                sx={{
                  borderRadius: "999px",
                  minWidth: 90,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "#d1d5db",
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid}
                sx={{
                  borderRadius: "999px",
                  minWidth: 90,
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                }}
              >
                Lưu
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {/* Modal xác nhận xóa */}
      <Modal open={confirmOpen} onClose={cancelDelete}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.18)",
            p: 4,
          }}
        >
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Xác nhận xóa người dùng
            </h2>
            <p className="text-gray-500 text-sm">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={cancelDelete}
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: "999px",
                minWidth: 90,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "#d1d5db",
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              sx={{
                borderRadius: "999px",
                minWidth: 90,
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#ef4444",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
              }}
            >
              Xóa
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

