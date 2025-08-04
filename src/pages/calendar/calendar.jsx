import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const members = [
  "Phạm Đức",
  "Trường",
  "Quang",
  "Kiên",
  "Dũng",
  "Sang",
  "Hòa",
  "Thắng",
  "Quốc Huy",
  "Anh Khôi",
  "Đức Thịnh",
];

const shifts = [
  "Trực phòng",
  "Vắng có phép",
  "Vắng không phép",
  "Công tác",
  "Chưa đăng ký",
];

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const times = ["Sáng", "Chiều"];

function getWeekRange(date = new Date()) {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay() + 1;
  const last = first + 6;
  const month = curr.getMonth() + 1;
  const year = curr.getFullYear();
  return `${first < 10 ? "0" + first : first}/${
    month < 10 ? "0" + month : month
  }/${year} - ${last < 10 ? "0" + last : last}/${
    month < 10 ? "0" + month : month
  }/${year}`;
}

function getNextWeekRange(currentWeek) {
  const [startStr] = currentWeek.split(" - ");
  const [day, month, year] = startStr.split("/").map(Number);
  const nextWeekDate = new Date(year, month - 1, day + 7);
  return getWeekRange(nextWeekDate);
}

export default function Calendar() {
  // States cho lịch trực
  const [schedule, setSchedule] = useState(() =>
    members.map((name) => ({
      name,
      shifts: days.map(() => times.map(() => "Chưa đăng ký")),
    }))
  );

  const [allSchedules, setAllSchedules] = useState([
    {
      id: Date.now(),
      week: getWeekRange(),
      data: members.map((name) => ({
        name,
        shifts: days.map(() => times.map(() => "Chưa đăng ký")),
      })),
      isEditable: true,
    },
  ]);

  const [currentIdx, setCurrentIdx] = useState(0);

  // States cho modal
  const [editOpen, setEditOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editDay, setEditDay] = useState(0);
  const [editTime, setEditTime] = useState(0);
  const [editShift, setEditShift] = useState("");

  const [swapOpen, setSwapOpen] = useState(false);
  const [swapFrom, setSwapFrom] = useState({
    idx: null,
    day: null,
    time: null,
  });
  const [swapTo, setSwapTo] = useState({
    idx: null,
    day: null,
    time: null,
  });

  // States cho thông báo
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // States cho chế độ chỉnh sửa
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempSchedule, setTempSchedule] = useState(null);

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const savedSchedules = localStorage.getItem("schedules");
    if (savedSchedules) {
      const parsed = JSON.parse(savedSchedules);
      setAllSchedules(parsed);
      if (parsed.length > 0) {
        setSchedule(parsed[0].data);
      }
    }
  }, []);

  // Lưu vào localStorage
  const saveToStorage = (schedules) => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  };

  // Hiển thị thông báo
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Tạo lịch trực tuần mới
  const handleCreateNewSchedule = () => {
    const currentWeek = allSchedules[currentIdx]?.week || getWeekRange();
    const nextWeek = getNextWeekRange(currentWeek);

    // Kiểm tra xem tuần này đã tồn tại chưa
    const existingWeek = allSchedules.find((s) => s.week === nextWeek);
    if (existingWeek) {
      showNotification("Lịch trực cho tuần này đã tồn tại!", "warning");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      week: nextWeek,
      data: members.map((name) => ({
        name,
        shifts: days.map(() => times.map(() => "Chưa đăng ký")),
      })),
      isEditable: true,
    };

    const updated = [newSchedule, ...allSchedules];
    setAllSchedules(updated);
    saveToStorage(updated);
    setCurrentIdx(0);
    setSchedule(newSchedule.data);
    showNotification("Đã tạo lịch trực tuần mới thành công!");
  };

  // Bắt đầu chỉnh sửa lịch trực
  const handleStartEdit = () => {
    if (!allSchedules[currentIdx]?.isEditable) {
      showNotification("Lịch trực này không thể chỉnh sửa!", "error");
      return;
    }

    setIsEditMode(true);
    setTempSchedule(JSON.parse(JSON.stringify(schedule))); // Deep copy
    showNotification("Đã vào chế độ chỉnh sửa", "info");
  };

  // Lưu thay đổi
  const handleSaveEdit = () => {
    const updated = [...allSchedules];
    updated[currentIdx].data = schedule;
    setAllSchedules(updated);
    saveToStorage(updated);
    setIsEditMode(false);
    setTempSchedule(null);
    showNotification("Đã lưu thay đổi thành công!");
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    if (tempSchedule) {
      setSchedule(tempSchedule);
    }
    setIsEditMode(false);
    setTempSchedule(null);
    showNotification("Đã hủy thay đổi", "info");
  };

  // Xóa lịch trực
  const handleDeleteSchedule = () => {
    if (allSchedules.length === 1) {
      showNotification("Không thể xóa lịch trực cuối cùng!", "error");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc muốn xóa lịch trực tuần ${allSchedules[currentIdx]?.week}?`
      )
    ) {
      const updated = allSchedules.filter((_, i) => i !== currentIdx);
      setAllSchedules(updated);
      saveToStorage(updated);

      const newIdx = currentIdx > 0 ? currentIdx - 1 : 0;
      setCurrentIdx(newIdx);
      setSchedule(updated[newIdx]?.data || []);
      showNotification("Đã xóa lịch trực thành công!");
    }
  };

  // Chuyển đổi lịch trực
  const handleSelectSchedule = (idx) => {
    if (isEditMode) {
      if (window.confirm("Bạn có muốn lưu thay đổi trước khi chuyển lịch?")) {
        handleSaveEdit();
      } else {
        handleCancelEdit();
      }
    }

    setCurrentIdx(idx);
    setSchedule(allSchedules[idx]?.data || []);
  };

  // Sửa ca trực từ cell
  const handleCellClick = (memberIdx, dayIdx, timeIdx) => {
    if (!isEditMode) {
      showNotification("Vui lòng vào chế độ chỉnh sửa trước!", "warning");
      return;
    }

    setEditIdx(memberIdx);
    setEditDay(dayIdx);
    setEditTime(timeIdx);
    setEditShift(schedule[memberIdx].shifts[dayIdx][timeIdx]);
    setEditOpen(true);
  };

  // Xử lý thay đổi ca trực
  const handleShiftChange = (memberIdx, dayIdx, timeIdx, newValue) => {
    if (!isEditMode) {
      showNotification("Vui lòng vào chế độ chỉnh sửa trước!", "warning");
      return;
    }

    const newSchedule = [...schedule];
    newSchedule[memberIdx].shifts[dayIdx][timeIdx] = newValue;
    setSchedule(newSchedule);
  };

  // Lưu thay đổi từ modal
  const handleEditShift = () => {
    const newSchedule = [...schedule];
    newSchedule[editIdx].shifts[editDay][editTime] = editShift;
    setSchedule(newSchedule);
    setEditOpen(false);
    showNotification("Đã cập nhật ca trực!");
  };

  // Bắt đầu đổi ca
  const handleStartSwap = (memberIdx, dayIdx, timeIdx) => {
    if (!isEditMode) {
      showNotification("Vui lòng vào chế độ chỉnh sửa trước!", "warning");
      return;
    }

    setSwapFrom({ idx: memberIdx, day: dayIdx, time: timeIdx });
    setSwapTo({ idx: null, day: null, time: null });
    setSwapOpen(true);
  };

  // Thực hiện đổi ca
  const handleSwapShift = () => {
    const newSchedule = [...schedule];
    const temp = newSchedule[swapFrom.idx].shifts[swapFrom.day][swapFrom.time];
    newSchedule[swapFrom.idx].shifts[swapFrom.day][swapFrom.time] =
      newSchedule[swapTo.idx].shifts[swapTo.day][swapTo.time];
    newSchedule[swapTo.idx].shifts[swapTo.day][swapTo.time] = temp;

    setSchedule(newSchedule);
    setSwapOpen(false);
    showNotification("Đã đổi ca trực thành công!");
  };

  // Lấy màu background cho cell
  const getCellBackground = (value) => {
    switch (value) {
      case "Trực phòng":
        return "#dcfce7";
      case "Vắng có phép":
        return "#fef3c7";
      case "Vắng không phép":
        return "#fee2e2";
      case "Công tác":
        return "#dbeafe";
      default:
        return "#ffffff";
    }
  };

  // Lấy màu text cho cell
  const getCellColor = (value) => {
    switch (value) {
      case "Trực phòng":
        return "#16a34a";
      case "Vắng có phép":
        return "#b45309";
      case "Vắng không phép":
        return "#b91c1c";
      case "Công tác":
        return "#0369a1";
      default:
        return "#374151";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#e0e7ff] to-[#f0fdfa] min-h-screen">
      <Navbar />
      <Box sx={{ p: 4, maxWidth: "100%", overflow: "hidden" }}>
        {/* Header Actions */}
        <Box className="flex items-center gap-3 mb-4 flex-wrap">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
              textTransform: "none",
              px: 3,
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
              },
            }}
            onClick={handleCreateNewSchedule}
          >
            TẠO LỊCH TRỰC TUẦN MỚI
          </Button>

          {!isEditMode ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                borderColor: "#6366f1",
                color: "#6366f1",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                border: "2px solid #6366f1",
                textTransform: "none",
                "&:hover": {
                  background: "#f0f5ff",
                  borderColor: "#6366f1",
                  border: "2px solid #6366f1",
                },
              }}
              onClick={handleStartEdit}
              disabled={!allSchedules[currentIdx]?.isEditable}
            >
              SỬA LỊCH TRỰC
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: 2,
                  background: "#16a34a",
                  color: "#fff",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    background: "#15803d",
                  },
                }}
                onClick={handleSaveEdit}
              >
                LƯU THAY ĐỔI
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  border: "2px solid #6b7280",
                  textTransform: "none",
                  "&:hover": {
                    background: "#f9fafb",
                    borderColor: "#6b7280",
                    border: "2px solid #6b7280",
                  },
                }}
                onClick={handleCancelEdit}
              >
                HỦY
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: 2,
              borderColor: "#ef4444",
              color: "#ef4444",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              border: "2px solid #ef4444",
              textTransform: "none",
              "&:hover": {
                background: "#fee2e2",
                borderColor: "#ef4444",
                border: "2px solid #ef4444",
              },
            }}
            onClick={handleDeleteSchedule}
            disabled={allSchedules.length === 1}
          >
            XÓA LỊCH TRỰC
          </Button>

          <Box sx={{ ml: 2 }}>
            <Select
              value={currentIdx}
              onChange={(e) => handleSelectSchedule(Number(e.target.value))}
              sx={{
                borderRadius: 2,
                minWidth: 200,
                fontWeight: 600,
                background: "#fff",
                border: "2px solid #e5e7eb",
              }}
            >
              {allSchedules.map((s, i) => (
                <MenuItem key={s.id} value={i}>
                  Tuần {s.week}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Status Alert */}
        {isEditMode && (
          <Alert
            severity="info"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Box>
                <Button size="small" onClick={handleSaveEdit} sx={{ mr: 1 }}>
                  Lưu
                </Button>
                <Button size="small" onClick={handleCancelEdit}>
                  Hủy
                </Button>
              </Box>
            }
          >
            Đang ở chế độ chỉnh sửa. Nhấn vào các ô để thay đổi ca trực.
          </Alert>
        )}

        {/* Schedule Table */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow:
              "0 8px 32px 0 rgba(80,102,255,0.18), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
            mb: 4,
            background: "#fff",
            border: "2px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
              <Typography variant="h5" fontWeight="bold" color="#22324a" mb={1}>
                Lịch trực tuần {allSchedules[currentIdx]?.week}
                {isEditMode && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 2,
                      color: "#16a34a",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      background: "#dcfce7",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    ĐANG CHỈNH SỬA
                  </Typography>
                )}
              </Typography>
              <Typography color="text.secondary">
                {isEditMode
                  ? "Nhấn vào các ô để thay đổi ca trực. Nhấp chuột phải để đổi ca với đồng nghiệp."
                  : "Đăng ký tối thiểu 3 buổi/tuần. Nhấn 'Sửa lịch trực' để chỉnh sửa."}
              </Typography>
            </Box>

            <TableContainer sx={{ maxWidth: "100%", overflow: "auto" }}>
              <Table
                sx={{
                  minWidth: 1200,
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRight: "2px solid #cbd5e1",
                        position: "sticky",
                        left: 0,
                        zIndex: 10,
                        width: 150,
                        minWidth: 150,
                      }}
                    >
                      Họ và Tên
                    </TableCell>
                    {days.map((d, di) =>
                      times.map((t, ti) => (
                        <TableCell
                          key={d + t}
                          align="center"
                          sx={{
                            background: ti === 0 ? "#fef9c3" : "#e0f2fe",
                            fontWeight: "bold",
                            border: "1px solid #e2e8f0",
                            borderLeft:
                              di === 0 && ti === 0
                                ? "2px solid #cbd5e1"
                                : "1px solid #e2e8f0",
                            width: 140,
                            minWidth: 140,
                          }}
                        >
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                            {d}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              marginTop: 2,
                            }}
                          >
                            {t}
                          </div>
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedule.map((row, idx) => (
                    <TableRow key={row.name}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRight: "2px solid #cbd5e1",
                          position: "sticky",
                          left: 0,
                          zIndex: 5,
                          width: 150,
                          minWidth: 150,
                        }}
                      >
                        {row.name}
                      </TableCell>
                      {days.map((d, di) =>
                        times.map((t, ti) => {
                          const value = row.shifts[di][ti];
                          return (
                            <TableCell
                              key={d + t}
                              align="center"
                              sx={{
                                background: getCellBackground(value),
                                border: "1px solid #e2e8f0",
                                borderLeft:
                                  di === 0 && ti === 0
                                    ? "2px solid #cbd5e1"
                                    : "1px solid #e2e8f0",
                                cursor: isEditMode ? "pointer" : "default",
                                transition: "all 0.2s ease",
                                width: 140,
                                minWidth: 140,
                                "&:hover": isEditMode
                                  ? {
                                      background: "#e0e7ff",
                                      boxShadow: "inset 0 0 0 2px #6366f1",
                                    }
                                  : {},
                                p: 1,
                              }}
                              onClick={() => handleCellClick(idx, di, ti)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                if (isEditMode) {
                                  handleStartSwap(idx, di, ti);
                                }
                              }}
                            >
                              {value === "Chưa đăng ký" && isEditMode ? (
                                <Select
                                  value={value}
                                  onChange={(e) =>
                                    handleShiftChange(
                                      idx,
                                      di,
                                      ti,
                                      e.target.value
                                    )
                                  }
                                  displayEmpty
                                  size="small"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "13px",
                                    width: "100%",
                                    background: "#ffffff",
                                    borderRadius: 2,
                                    border: "1px solid #d1d5db",
                                    "& .MuiSelect-select": {
                                      padding: "6px 8px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                    "& .MuiSelect-icon": {
                                      color: "#6366f1",
                                      fontSize: "16px",
                                    },
                                  }}
                                  MenuProps={{
                                    PaperProps: {
                                      sx: {
                                        borderRadius: 2,
                                        border: "1px solid #d1d5db",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                      },
                                    },
                                  }}
                                >
                                  {shifts.map((s) => (
                                    <MenuItem
                                      key={s}
                                      value={s}
                                      sx={{
                                        fontSize: "13px",
                                        background: getCellBackground(s),
                                        fontWeight:
                                          s === "Chưa đăng ký" ? 600 : 500,
                                        color: getCellColor(s),
                                        border: "1px solid #e5e7eb",
                                        margin: "2px",
                                        borderRadius: 1,
                                        "&:hover": {
                                          opacity: 0.8,
                                        },
                                      }}
                                    >
                                      {s}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : (
                                <Tooltip
                                  title={
                                    isEditMode
                                      ? "Nhấn để chỉnh sửa, chuột phải để đổi ca"
                                      : value
                                  }
                                >
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      border: "1px solid",
                                      borderColor: getCellColor(value),
                                      color: getCellColor(value),
                                      minHeight: "24px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {value}
                                  </div>
                                </Tooltip>
                              )}
                            </TableCell>
                          );
                        })
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Modal chỉnh sửa ca trực */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, border: "2px solid #e5e7eb" },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e5e7eb" }}>
          Chỉnh sửa ca trực
          <IconButton
            onClick={() => setEditOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#888",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#e5e7eb" }}>
          <Typography fontWeight={500} mb={2}>
            {members[editIdx]} - {days[editDay]} - {times[editTime]}
          </Typography>
          <Select
            value={editShift}
            onChange={(e) => setEditShift(e.target.value)}
            fullWidth
            sx={{
              borderRadius: 2,
              background: "#f8fafc",
              border: "1px solid #d1d5db",
            }}
          >
            {shifts.map((s) => (
              <MenuItem
                key={s}
                value={s}
                sx={{
                  background: getCellBackground(s),
                  color: getCellColor(s),
                  "&:hover": { opacity: 0.8 },
                }}
              >
                {s}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: "1px solid #e5e7eb" }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "#6b7280",
              color: "#6b7280",
              fontWeight: 600,
              px: 3,
              py: 1,
              border: "2px solid #6b7280",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleEditShift}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              py: 1,
              textTransform: "none",
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal đổi ca trực */}
      <Dialog
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, border: "2px solid #e5e7eb" },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e5e7eb" }}>
          Đổi ca trực với đồng nghiệp
          <IconButton
            onClick={() => setSwapOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#888",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#e5e7eb" }}>
          <Typography fontWeight={500} mb={2}>
            Ca hiện tại: {members[swapFrom.idx]} - {days[swapFrom.day]} -{" "}
            {times[swapFrom.time]}
          </Typography>
          <Typography fontWeight={500} mb={2}>
            Chọn ca muốn đổi:
          </Typography>

          <Select
            value={swapTo.idx ?? ""}
            onChange={(e) =>
              setSwapTo({ ...swapTo, idx: Number(e.target.value) })
            }
            fullWidth
            displayEmpty
            sx={{ mb: 2, borderRadius: 2, background: "#f8fafc" }}
          >
            <MenuItem value="" disabled>
              Chọn thành viên
            </MenuItem>
            {members.map((m, i) => (
              <MenuItem key={m} value={i}>
                {m}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={swapTo.day ?? ""}
            onChange={(e) =>
              setSwapTo({ ...swapTo, day: Number(e.target.value) })
            }
            fullWidth
            displayEmpty
            sx={{ mb: 2, borderRadius: 2, background: "#f8fafc" }}
          >
            <MenuItem value="" disabled>
              Chọn ngày
            </MenuItem>
            {days.map((d, i) => (
              <MenuItem key={d} value={i}>
                {d}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={swapTo.time ?? ""}
            onChange={(e) =>
              setSwapTo({ ...swapTo, time: Number(e.target.value) })
            }
            fullWidth
            displayEmpty
            sx={{ borderRadius: 2, background: "#f8fafc" }}
          >
            <MenuItem value="" disabled>
              Chọn ca
            </MenuItem>
            {times.map((t, i) => (
              <MenuItem key={t} value={i}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: "1px solid #e5e7eb" }}>
          <Button
            onClick={() => setSwapOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "#6b7280",
              color: "#6b7280",
              fontWeight: 600,
              px: 3,
              py: 1,
              border: "2px solid #6b7280",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSwapShift}
            variant="contained"
            disabled={
              swapTo.idx === null || swapTo.day === null || swapTo.time === null
            }
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              py: 1,
              textTransform: "none",
            }}
          >
            Đổi ca
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
