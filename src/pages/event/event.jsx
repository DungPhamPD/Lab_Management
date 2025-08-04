import React from "react";
import Navbar from "../../components/navbar/navbar";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 16,
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

export default function Event() {
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [date, setDate] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [form, setForm] = React.useState({
    name: "",
    type: "",
    desc: "",
    start: "",
    end: "",
    location: "",
    participants: "",
    remind: "",
    notifyEmail: true,
    notifySystem: true,
    file: null,
    status: "done", 
  });
  // Thêm state cho modal xác nhận hủy và id sự kiện cần xóa
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  // Thêm state để biết đang ở chế độ sửa
  const [editId, setEditId] = React.useState(null);

  // Xử lý mở/đóng modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Hàm mở modal xác nhận hủy
  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type: t, checked, files } = e.target;
    if (t === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (t === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setEvents(events.map(ev =>
        ev.id === editId ? { ...ev, ...form } : ev
      ));
    } else {
      setEvents([
        ...events,
        {
          ...form,
          id: Date.now(),
        },
      ]);
    }
    setForm({
      name: "",
      type: "",
      desc: "",
      start: "",
      end: "",
      location: "",
      participants: "",
      remind: "",
      notifyEmail: true,
      notifySystem: true,
      file: null,
      status: "done", // reset về mặc định
    });
    setOpen(false);
    setEditId(null);
  };

  const handleDetail = (ev) => {
    setSelectedEvent(ev);
    setDetailOpen(true);
  };

  // Hàm xác nhận xóa sự kiện
  const handleDeleteEvent = () => {
    setEvents(events.filter(ev => ev.id !== deleteId));
    setConfirmOpen(false);
    setDetailOpen(false); // Đóng modal chi tiết nếu đang mở
  };

  // Hàm mở modal sửa sự kiện
  const handleEdit = (ev) => {
    setForm({
      name: ev.name,
      type: ev.type,
      desc: ev.desc,
      start: ev.start,
      end: ev.end,
      location: ev.location,
      participants: ev.participants,
      remind: ev.remind,
      notifyEmail: ev.notifyEmail,
      notifySystem: ev.notifySystem,
      file: ev.file || null,
      status: ev.status || "done", // Thêm dòng này
    });
    setEditId(ev.id);
    setOpen(true);
    setDetailOpen(false);
  };

  return (
    <div className="bg-[#f6f9fb] min-h-screen">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-3xl">Quản lí sự kiện</h2>
        </div>
        {/* Bộ lọc dạng ngang giống ảnh mẫu */}
        <div className="w-full flex justify-between items-center mt-8 mb-8 gap-4">
          <div className="flex flex-1 gap-4">
            <InputBase
              placeholder="Tìm kiếm sự kiện..."
              className="border rounded-2xl bg-white shadow px-5 py-3 w-[260px] text-lg"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-2xl bg-white shadow px-2 w-[220px] text-lg"
              size="medium"
              inputProps={{ style: { padding: '14px' } }}
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="done">Đã kết thúc</MenuItem>
              <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
              <MenuItem value="ongoing">Đang diễn ra</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-2xl bg-white shadow px-2 w-[220px] text-lg"
              size="medium"
              inputProps={{ style: { padding: '14px' } }}
            >
              <MenuItem value="all">Tất cả loại sự kiện</MenuItem>
              <MenuItem value="meeting">Họp</MenuItem>
              <MenuItem value="training">Đào tạo</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="holiday">Nghỉ lễ</MenuItem>
            </Select>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth={false}
              InputProps={{
                style: {
                  borderRadius: 8,         // Bo vuông giống các khung bên trái
                  background: "#fff",
                  height: 64,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: "0 8px",        // Thu hẹp padding cho sát icon
                  fontSize: 16,
                  width: 160,
                  boxSizing: "border-box",
                  border: "none",
                  alignItems: "center",
                  display: "flex",
                }
              }}
              inputProps={{
                style: {
                  borderRadius: 8,
                  height: 55,
                  padding: "0 8px",        // Thu hẹp padding cho sát icon
                  fontSize: 16,
                  boxSizing: "border-box",
                  background: "#fff",
                }
              }}
            />
          </div>
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            size="large"
            className="!bg-blue-600 rounded-2xl text-lg font-semibold whitespace-nowrap"
            style={{
              minHeight: 55,        // đồng bộ chiều cao
              height: 60,
              paddingLeft: 32,
              paddingRight: 32,
              boxShadow: "0 2px 8px rgba(37,116,251,0.08)",
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleOpen}
          >
            + TẠO SỰ KIỆN MỚI
          </Button>
        </div>
        {/* Modal tạo sự kiện */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: 530,
              maxWidth: "95vw",
              bgcolor: "#fff",
              borderRadius: "22px",
              boxShadow: "0 0 0 4px #e0e7ff, 0 8px 32px 0 rgba(80, 102, 255, 0.18), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
              border: "2.5px solid #a5b4fc",
              p: 0,
              overflow: "visible",
            }}
          >
            {/* Header gradient giống mẫu */}
            <div
              style={{
                borderTopLeftRadius: "22px",
                borderTopRightRadius: "22px",
                background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                padding: "28px 36px 18px 36px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className="text-2xl font-bold text-white">Tạo sự kiện mới</h2>
              <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
                <CloseIcon />
              </IconButton>
            </div>
            {/* Nội dung form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-9 py-7"
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE 10+
              }}
            >
              {/* Ẩn thanh cuộn trên Chrome/Safari/Edge */}
              <style>
                {`
                  form::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div>
                <label className="font-medium mb-1 block">Tên sự kiện *</label>
                <TextField
                  fullWidth
                  size="medium"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên sự kiện"
                />
              </div>
              <div>
                <label className="font-medium mb-1 block">Loại sự kiện *</label>
                <Select
                  fullWidth
                  size="medium"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  displayEmpty
                  required
                >
                  <MenuItem value="">Chọn loại sự kiện</MenuItem>
                  <MenuItem value="meeting">Họp</MenuItem>
                  <MenuItem value="training">Đào tạo</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="holiday">Nghỉ lễ</MenuItem>
                </Select>
              </div>
              {/* Thêm mục chọn trạng thái sự kiện */}
              <div>
                <label className="font-medium mb-1 block">Trạng thái sự kiện *</label>
                <Select
                  fullWidth
                  size="medium"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="done">Đã kết thúc</MenuItem>
                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                  <MenuItem value="ongoing">Đang diễn ra</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </div>
              <div>
                <label className="font-medium mb-1 block">Mô tả chi tiết</label>
                <TextField
                  fullWidth
                  size="medium"
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  multiline
                  minRows={2}
                  placeholder="Nhập mô tả chi tiết"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-medium mb-1 block">Ngày bắt đầu *</label>
                  <TextField
                    fullWidth
                    size="medium"
                    type="datetime-local"
                    name="start"
                    value={form.start}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="font-medium mb-1 block">Ngày kết thúc *</label>
                  <TextField
                    fullWidth
                    size="medium"
                    type="datetime-local"
                    name="end"
                    value={form.end}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-medium mb-1 block">Địa điểm</label>
                <TextField
                  fullWidth
                  size="medium"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Phòng họp, địa chỉ..."
                />
              </div>
              <div>
                <label className="font-medium mb-1 block">Mời người tham gia</label>
                <TextField
                  fullWidth
                  size="medium"
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  placeholder="Nhập tên hoặc email"
                />
              </div>
              <div>
                <label className="font-medium mb-1 block">Nhắc nhở trước</label>
                <Select
                  fullWidth
                  size="medium"
                  name="remind"
                  value={form.remind}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">Không nhắc nhở</MenuItem>
                  <MenuItem value="10">Trước 1 ngày</MenuItem>
                  <MenuItem value="30">Trước 1 tuần</MenuItem>
                  <MenuItem value="60">Trước 5 giờ</MenuItem>\
                  <MenuItem value="120">Trước 2 giờ</MenuItem>  
                </Select>
              </div>
              <div>
                <label className="font-medium mb-1 block">Gửi thông báo</label>
                <div className="flex gap-4 mt-1">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.notifyEmail}
                        onChange={handleChange}
                        name="notifyEmail"
                      />
                    }
                    label="Gửi email thông báo"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.notifySystem}
                        onChange={handleChange}
                        name="notifySystem"
                      />
                    }
                    label="Thông báo hệ thống"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium mb-1 block">Đính kèm tài liệu</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="block mt-1 border border-dashed border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={handleClose} variant="outlined" color="inherit">
                  Hủy
                </Button>
                <Button type="submit" variant="contained" className="!bg-blue-600">
                  Tạo sự kiện
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
        {/* Modal chi tiết sự kiện */}
        <Modal open={detailOpen} onClose={() => setDetailOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 540,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 0,
              overflowY: "auto",
            }}
          >
            {selectedEvent && (
              <div className="rounded-2xl overflow-hidden">
                <div className="px-8 py-6 border-b flex justify-between items-center bg-[#f7fafd]">
                  <h2 className="text-2xl font-bold text-[#22324a]">{selectedEvent.name}</h2>
                  <IconButton onClick={() => setDetailOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <div className="px-8 py-6">
                  <div className="mb-6">
                    <div className="font-semibold text-lg mb-2 text-[#22324a]">Thông tin cơ bản</div>
                    <div className="mb-2"><span className="font-medium">Loại sự kiện:</span> {selectedEvent.type === "meeting" ? "Họp" : selectedEvent.type === "training" ? "Đào tạo" : selectedEvent.type}</div>
                    <div className="mb-2">
                      <span className="font-medium">Thời gian:</span>{" "}
                      {selectedEvent.start &&
                        new Date(selectedEvent.start).toLocaleDateString("vi-VN") +
                        ", " +
                        new Date(selectedEvent.start).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
                        " - " +
                        (selectedEvent.end
                          ? new Date(selectedEvent.end).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                          : "")}
                    </div>
                    <div className="mb-2"><span className="font-medium">Địa điểm:</span> {selectedEvent.location || "—"}</div>
                    <div className="mb-2"><span className="font-medium">Mô tả:</span> {selectedEvent.desc || "—"}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg mb-2 text-[#22324a]">Người tham gia</div>
                    <div className="bg-[#f7fafd] rounded-lg p-3">
                      {(() => {
                        const arr = selectedEvent.participants
                          ? selectedEvent.participants
                              .split(/[,;]/)
                              .map((p) => p.trim())
                              .filter((p) => p)
                          : [];
                        if (arr.length === 0) {
                          return (
                            <div className="flex items-center gap-3 py-2">
                              <svg className="w-10 h-10 rounded-full bg-gray-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3 7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
                              </svg>
                              <span className="text-gray-500">Không có người tham gia</span>
                            </div>
                          );
                        }
                        return arr.map((name, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                            <svg className="w-10 h-10 rounded-full bg-gray-200" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3 7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
                            </svg>
                            <div>
                              <div className="font-medium">{name}</div>
                              {/* Có thể thêm vai trò nếu muốn */}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8 justify-end">
                    <Button
                      variant="contained"
                      className="!bg-blue-600 !text-white px-6 py-2 rounded-lg font-semibold"
                      onClick={() => handleEdit(selectedEvent)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button variant="contained" color="error" className="px-6 py-2 rounded-lg font-semibold" onClick={() => handleOpenConfirm(selectedEvent.id)}>
                      Hủy sự kiện
                    </Button>
                    <Button variant="outlined" className="px-6 py-2 rounded-lg font-semibold">Gửi nhắc nhở</Button>
                  </div>
                </div>
              </div>
            )}
          </Box>
        </Modal>
        {/* Modal xác nhận hủy */}
        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <div className="mb-6 text-lg font-semibold">Bạn muốn hủy sự kiện này?</div>
            <div className="flex justify-center gap-4">
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteEvent}
              >
                Hủy
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfirmOpen(false)}
              >
                Đóng
              </Button>
            </div>
          </Box>
        </Modal>
        {/* Hiển thị sự kiện sau khi tạo */}
        {events
          .filter(ev => (type === "all" ? true : ev.type === type))
          .filter(ev => (status === "all" ? true : ev.status === status))
          .map((ev) => {
            // Tách danh sách người tham gia từ chuỗi nhập (phân tách bởi dấu phẩy hoặc dấu ;)
            const participantsArr = ev.participants
              ? ev.participants
                  .split(/[,;]/)
                  .map((p) => p.trim())
                  .filter((p) => p)
              : [];

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-6 shadow mb-6 border-l-4 border-blue-400 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-xl">{ev.name}</h3>
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">
                      {ev.type === "meeting" ? "HỌP" : ev.type === "training" ? "ĐÀO TẠO" : ev.type === "workshop" ? "WORKSHOP" : "NGHỈ LỄ"}
                    </span>
                    <span
                      className={
                        ev.status === "done"
                          ? "bg-purple-100 text-purple-600"
                          : ev.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : ev.status === "ongoing"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                      style={{ borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}
                    >
                      {ev.status === "done"
                        ? "Đã kết thúc"
                        : ev.status === "upcoming"
                        ? "Sắp diễn ra"
                        : ev.status === "ongoing"
                        ? "Đang diễn ra"
                        : "Đã hủy"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 mb-1 gap-4">
                  <span className="flex items-center gap-1">
                    <svg width="18" height="18" fill="none" stroke="currentColor" className="inline-block">
                      <circle cx="9" cy="9" r="8" strokeWidth="2" />
                      <path d="M9 5v4l2.5 2.5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {ev.start &&
                      new Date(ev.start).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    {ev.end &&
                      ` - ${new Date(ev.end).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1 text-blue-500">
                    <svg width="16" height="16" fill="none" stroke="currentColor" className="inline-block">
                      <path d="M8 14s6-4.35 6-7.5A6 6 0 1 0 2 6.5C2 9.65 8 14 8 14Z" strokeWidth="2" />
                    </svg>
                    {ev.location}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">{ev.desc}</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    {/* Hiển thị icon user mặc định theo số người nhập */}
                    {participantsArr.length > 0
                      ? (
                          <span className="text-gray-500 ml-2">{participantsArr.length} người tham gia</span>
                        )
                      : (
                          <span className="flex items-center gap-1 text-gray-400 ml-2">
                            {[...Array(1)].map((_, idx) => (
                              <svg
                                key={idx}
                                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.7 0 4.5-2.1 4.5-4.5S14.7 3 12 3 7.5 5.1 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
                              </svg>
                            ))}
                            0 người tham gia
                          </span>
                        )
                    }
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityOutlinedIcon />}
                      size="small"
                      className="!bg-white !text-gray-700 !border-gray-200 !shadow"
                      style={{ minWidth: 110, fontWeight: 600 }}
                      onClick={() => handleDetail(ev)}
                    >
                      CHI TIẾT
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<EditOutlinedIcon />}
                      size="small"
                      className="!bg-blue-600 !shadow"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => handleEdit(ev)}
                    >
                      SỬA
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CancelOutlinedIcon />}
                      size="small"
                      color="error"
                      className="!shadow"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => handleOpenConfirm(ev.id)}
                    >
                      HỦY
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

