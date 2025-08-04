import { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
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
} from "@mui/material";
import { Download, EmojiEvents, Assessment, Person, CalendarMonth, Close } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";

const mockMembers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    weekKPI: 92,
    monthKPI: 89,
    tasks: 12,
    attitude: 9,
    hours: 40,
    meetings: 3,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    weekKPI: 98,
    monthKPI: 95,
    tasks: 15,
    attitude: 10,
    hours: 42,
    meetings: 4,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    weekKPI: 85,
    monthKPI: 88,
    tasks: 10,
    attitude: 8,
    hours: 38,
    meetings: 2,
  },
];

function getTopMember(members, type = "weekKPI") {
  return members.reduce((top, curr) => (curr[type] > top[type] ? curr : top), members[0]);
}

export default function KPI() {
  const [period, setPeriod] = useState("week");
  const [openReport, setOpenReport] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [editData, setEditData] = useState({});

  const topKPI = getTopMember(mockMembers, period === "week" ? "weekKPI" : "monthKPI");
  const topTask = getTopMember(mockMembers, "tasks");

  // Export to Excel
  const handleExportExcel = () => {
    const data = mockMembers.map((m) => ({
      "Tên thành viên": m.name,
      "KPI Tuần": m.weekKPI,
      "KPI Tháng": m.monthKPI,
      "Số task": m.tasks,
      "Thái độ": m.attitude,
      "Giờ làm việc": m.hours,
      "Số lần họp": m.meetings,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KPI");
    XLSX.writeFile(wb, "KPI_Report.xlsx");
  };

  // Export to PDF (simple, using browser print)
  const handleExportPDF = () => {
    window.print();
  };

  // Khi nhấn nút cập nhật
  const handleEdit = (member) => {
    setEditMember(member);
    setEditData({ ...member });
    setEditOpen(true);
  };

  // Lưu cập nhật
  const handleSaveEdit = () => {
    // Cập nhật dữ liệu vào mockMembers (nếu dùng API thì gọi API ở đây)
    const idx = mockMembers.findIndex((m) => m.id === editMember.id);
    if (idx !== -1) {
      mockMembers[idx] = { ...editData };
    }
    setEditOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#e0e7ff] to-[#f0fdfa] min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Box sx={{ p: 4 }}>
          <Box className="flex justify-between items-center mb-8">
            <Typography variant="h4" fontWeight="bold" color="#22324a">
              <Assessment sx={{ mr: 1, color: "#6366f1" }} />
              Quản lý KPI thành viên
            </Typography>
            <Box className="flex gap-2">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={handleExportExcel}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Xuất Excel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Download />}
                onClick={handleExportPDF}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Xuất PDF
              </Button>
            </Box>
          </Box>

          <Box className="flex gap-6 mb-8 flex-wrap">
            <Card sx={{ minWidth: 260, borderRadius: 3, background: "#fff" }}>
              <CardContent className="flex items-center gap-4">
                <EmojiEvents sx={{ fontSize: 40, color: "#f59e42" }} />
                <Box>
                  <Typography fontWeight="bold" color="#22324a">
                    Hiệu suất cao nhất ({period === "week" ? "Tuần" : "Tháng"})
                  </Typography>
                  <Typography>
                    <b>{topKPI.name}</b> - {period === "week" ? topKPI.weekKPI : topKPI.monthKPI} điểm
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 260, borderRadius: 3, background: "#fff" }}>
              <CardContent className="flex items-center gap-4">
                <Person sx={{ fontSize: 40, color: "#60a5fa" }} />
                <Box>
                  <Typography fontWeight="bold" color="#22324a">
                    Nhiều task nhất
                  </Typography>
                  <Typography>
                    <b>{topTask.name}</b> - {topTask.tasks} task
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 260, borderRadius: 3, background: "#fff" }}>
              <CardContent className="flex items-center gap-4">
                <CalendarMonth sx={{ fontSize: 40, color: "#6366f1" }} />
                <Box>
                  <Typography fontWeight="bold" color="#22324a">
                    Xem KPI cá nhân
                  </Typography>
                  <Select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    size="small"
                    sx={{ ml: 1, borderRadius: 2, minWidth: 100, background: "#f3f4f6" }}
                  >
                    <MenuItem value="week">Theo tuần</MenuItem>
                    <MenuItem value="month">Theo tháng</MenuItem>
                  </Select>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box className="bg-white rounded-2xl shadow p-6">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" fontWeight="bold" color="#22324a">
                Bảng đánh giá KPI {period === "week" ? "tuần" : "tháng"}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thành viên</TableCell>
                    <TableCell align="center">KPI Tuần</TableCell>
                    <TableCell align="center">KPI Tháng</TableCell>
                    <TableCell align="center">Số task</TableCell>
                    <TableCell align="center">Thái độ</TableCell>
                    <TableCell align="center">Giờ làm việc</TableCell>
                    <TableCell align="center">Tham gia họp</TableCell>
                    <TableCell align="center">Chi tiết</TableCell>
                    <TableCell align="center">Cập nhật</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockMembers.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <Box className="flex items-center gap-2">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #6366f1",
                            }}
                          />
                          <span>{m.name}</span>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{m.weekKPI}</TableCell>
                      <TableCell align="center">{m.monthKPI}</TableCell>
                      <TableCell align="center">{m.tasks}</TableCell>
                      <TableCell align="center">{m.attitude}/10</TableCell>
                      <TableCell align="center">{m.hours}h</TableCell>
                      <TableCell align="center">{m.meetings}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton onClick={() => { setSelectedMember(m); setOpenReport(true); }}>
                            <Assessment color="primary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Cập nhật">
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{
                              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                              color: "#fff",
                              borderRadius: 2,
                              fontWeight: 600,
                              boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
                              textTransform: "none",
                              px: 2,
                              py: 1,
                              "&:hover": {
                                background: "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
                              },
                            }}
                            onClick={() => handleEdit(m)}
                          >
                            Cập nhật
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>

      {/* Modal chi tiết KPI */}
      <Dialog open={openReport} onClose={() => setOpenReport(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Chi tiết KPI thành viên
          <IconButton
            aria-label="close"
            onClick={() => setOpenReport(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#888" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Box>
              <Box className="flex items-center gap-3 mb-4">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #6366f1",
                  }}
                />
                <Box>
                  <Typography fontWeight="bold">{selectedMember.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {period === "week"
                      ? `KPI tuần: ${selectedMember.weekKPI}`
                      : `KPI tháng: ${selectedMember.monthKPI}`}
                  </Typography>
                </Box>
              </Box>
              <Box className="mb-2">
                <Typography>
                  <b>Số task hoàn thành:</b> {selectedMember.tasks}
                </Typography>
                <Typography>
                  <b>Thái độ:</b> {selectedMember.attitude}/10
                </Typography>
                <Typography>
                  <b>Giờ làm việc:</b> {selectedMember.hours}h
                </Typography>
                <Typography>
                  <b>Tham gia họp:</b> {selectedMember.meetings} lần
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReport(false)} color="primary" variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal cập nhật KPI */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(80,102,255,0.18), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#22324a" }}>
          Cập nhật KPI thành viên
          <IconButton
            aria-label="close"
            onClick={() => setEditOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#888" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editMember && (
            <Box>
              <Box className="flex items-center gap-3 mb-4">
                <img
                  src={editMember.avatar}
                  alt={editMember.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #6366f1",
                  }}
                />
                <Box>
                  <Typography fontWeight="bold">{editMember.name}</Typography>
                </Box>
              </Box>
              <Box className="space-y-3">
                <Box>
                  <Typography fontWeight={500}>KPI Tuần</Typography>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editData.weekKPI}
                    onChange={e => setEditData({ ...editData, weekKPI: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
                <Box>
                  <Typography fontWeight={500}>KPI Tháng</Typography>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editData.monthKPI}
                    onChange={e => setEditData({ ...editData, monthKPI: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
                <Box>
                  <Typography fontWeight={500}>Số task</Typography>
                  <input
                    type="number"
                    min={0}
                    value={editData.tasks}
                    onChange={e => setEditData({ ...editData, tasks: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
                <Box>
                  <Typography fontWeight={500}>Thái độ</Typography>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={editData.attitude}
                    onChange={e => setEditData({ ...editData, attitude: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
                <Box>
                  <Typography fontWeight={500}>Giờ làm việc</Typography>
                  <input
                    type="number"
                    min={0}
                    value={editData.hours}
                    onChange={e => setEditData({ ...editData, hours: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
                <Box>
                  <Typography fontWeight={500}>Tham gia họp</Typography>
                  <input
                    type="number"
                    min={0}
                    value={editData.meetings}
                    onChange={e => setEditData({ ...editData, meetings: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "#6366f1",
              color: "#6366f1",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                background: "#f0f5ff",
                borderColor: "#6366f1",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
              },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}