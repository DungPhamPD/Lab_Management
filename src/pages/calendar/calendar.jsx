import { useState } from "react";
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
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    return `${first < 10 ? "0" + first : first}/${month}/${year} - ${last < 10 ? "0" + last : last
        }/${month}/${year}`;
}

export default function Calendar() {
    const [schedule, setSchedule] = useState(() =>
        members.map((name) => ({
            name,
            shifts: days.map(() => times.map(() => "Chưa đăng ký")),
        }))
    );
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
    const [allSchedules, setAllSchedules] = useState([
        {
            week: getWeekRange(),
            data: members.map((name) => ({
                name,
                shifts: days.map(() => times.map(() => "Chưa đăng ký")),
            })),
        },
    ]);
    const [currentIdx, setCurrentIdx] = useState(0);

    // Tạo lịch trực mới cho tuần mới
    const handleCreateNewSchedule = () => {
        const newWeek = getWeekRange(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );
        setAllSchedules([
            {
                week: newWeek,
                data: members.map((name) => ({
                    name,
                    shifts: days.map(() => times.map(() => "Chưa đăng ký")),
                })),
            },
            ...allSchedules,
        ]);
        setCurrentIdx(0);
    };

    // Sửa lịch trực (chỉ cho phép sửa lịch đang xem)
    const handleEditSchedule = () => {
        const updated = [...allSchedules];
        updated[currentIdx].data = schedule;
        setAllSchedules(updated);
    };

    // Xóa lịch trực cũ
    const handleDeleteSchedule = (idx) => {
        if (window.confirm("Bạn có chắc muốn xóa lịch trực này?")) {
            const updated = allSchedules.filter((_, i) => i !== idx);
            setAllSchedules(updated);
            setCurrentIdx(0);
        }
    };

    // Khi chuyển lịch trực
    const handleSelectSchedule = (idx) => {
        setCurrentIdx(idx);
    };

    // Lịch trực hiện tại
    const currentSchedule = allSchedules[currentIdx]?.data || [];

    // Sửa ca trực
    const handleEditShift = () => {
        const newSchedule = [...schedule];
        newSchedule[editIdx].shifts[editDay][editTime] = editShift;
        setSchedule(newSchedule);
        setEditOpen(false);
    };

    // Đổi ca trực
    const handleSwapShift = () => {
        const newSchedule = [...schedule];
        const temp = newSchedule[swapFrom.idx].shifts[swapFrom.day][swapFrom.time];
        newSchedule[swapFrom.idx].shifts[swapFrom.day][swapFrom.time] =
            newSchedule[swapTo.idx].shifts[swapTo.day][swapTo.time];
        newSchedule[swapTo.idx].shifts[swapTo.day][swapTo.time] = temp;
        setSchedule(newSchedule);
        setSwapOpen(false);
    };

    return (
        <div className="bg-gradient-to-br from-[#e0e7ff] to-[#f0fdfa] min-h-screen">
            <Navbar />
            <Box sx={{ p: 4 }}>
                <Box className="flex items-center gap-3 mb-4">
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
                            px: 2,
                            py: 1,
                            "&:hover": {
                                background: "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
                            },
                        }}
                        onClick={handleCreateNewSchedule}
                    >
                        Tạo lịch trực tuần mới
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{
                            borderRadius: 2,
                            borderColor: "#6366f1",
                            color: "#6366f1",
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            "&:hover": {
                                background: "#f0f5ff",
                                borderColor: "#6366f1",
                            },
                        }}
                        onClick={handleEditSchedule}
                    >
                        Sửa lịch trực
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        sx={{
                            borderRadius: 2,
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            "&:hover": {
                                background: "#fee2e2",
                                borderColor: "#ef4444",
                            },
                        }}
                        onClick={() => handleDeleteSchedule(currentIdx)}
                        disabled={allSchedules.length === 1}
                    >
                        Xóa lịch trực
                    </Button>
                    <Box sx={{ ml: 2 }}>
                        <Select
                            value={currentIdx}
                            onChange={(e) => handleSelectSchedule(Number(e.target.value))}
                            sx={{ borderRadius: 2, minWidth: 180, fontWeight: 600 }}
                        >
                            {allSchedules.map((s, i) => (
                                <MenuItem key={s.week + i} value={i}>
                                    {s.week}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow:
                            "0 8px 32px 0 rgba(80,102,255,0.18), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
                        mb: 4,
                        background: "#fff",
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" color="#22324a" mb={2}>
                            Lịch trực tuần {allSchedules[currentIdx]?.week}
                        </Typography>
                        <Typography color="text.secondary" mb={2}>
                            Đăng ký tối thiểu 3 buổi/tuần. Nhấn vào ca để chỉnh sửa hoặc đổi ca
                            với đồng nghiệp.
                        </Typography>
                        <TableContainer
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                fontWeight: "bold",
                                                background: "#f3f4f6",
                                            }}
                                        >
                                            Họ và Tên
                                        </TableCell>
                                        {days.map((d, di) => (
                                            times.map((t, ti) => (
                                                <TableCell
                                                    key={d + t}
                                                    align="center"
                                                    sx={{
                                                        background:
                                                            ti === 0
                                                                ? "#fef9c3"
                                                                : ti === 1
                                                                    ? "#e0f2fe"
                                                                    : "#ede9fe",
                                                        fontWeight: "bold",
                                                        borderRight: ti < times.length - 1 ? "1px solid #e5e7eb" : undefined,
                                                    }}
                                                >
                                                    {d} <br />
                                                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                        {t}
                                                    </span>
                                                </TableCell>
                                            ))
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentSchedule.map((row, idx) => (
                                        <TableRow key={row.name}>
                                            <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                            {days.map((d, di) =>
                                                times.map((t, ti) => {
                                                    const value = row.shifts[di][ti];
                                                    const isEditing =
                                                        editIdx === idx &&
                                                        editDay === di &&
                                                        editTime === ti &&
                                                        editOpen;
                                                    return (
                                                        <TableCell
                                                            key={d + t}
                                                            align="center"
                                                            sx={{
                                                                background:
                                                                    value === "Trực phòng"
                                                                        ? "#22c55e22"
                                                                        : value === "Vắng có phép"
                                                                            ? "#fde68a"
                                                                            : value === "Vắng không phép"
                                                                                ? "#fee2e2"
                                                                                : value === "Công tác"
                                                                                    ? "#bae6fd"
                                                                                    : "#fff",
                                                                borderRadius: 2,
                                                                cursor: "pointer",
                                                                boxShadow: "0 1px 4px rgba(99,102,241,0.07)",
                                                                transition: "box-shadow 0.2s",
                                                                "&:hover": {
                                                                    boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
                                                                    background: "#e0e7ff",
                                                                },
                                                            }}
                                                        >
                                                            {value === "Chưa đăng ký" ? (
                                                                <Select
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const newSchedule = [...currentSchedule];
                                                                        newSchedule[idx].shifts[di][ti] = e.target.value;
                                                                        setSchedule(newSchedule);
                                                                    }}
                                                                    displayEmpty
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        fontSize: 15,
                                                                        background:
                                                                            value === "Trực phòng"
                                                                                ? "#22c55e22"
                                                                                : value === "Vắng có phép"
                                                                                    ? "#fde68a"
                                                                                    : value === "Vắng không phép"
                                                                                        ? "#fee2e2"
                                                                                        : value === "Công tác"
                                                                                            ? "#bae6fd"
                                                                                            : "#fff",
                                                                        borderRadius: 2,
                                                                        minWidth: 120,
                                                                        boxShadow: "0 1px 4px rgba(99,102,241,0.07)",
                                                                        "& .MuiSelect-icon": { color: "#6366f1" },
                                                                    }}
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            sx: {
                                                                                borderRadius: 2,
                                                                                boxShadow:
                                                                                    "0 8px 32px 0 rgba(80,102,255,0.18)",
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    {shifts.map((s) => (
                                                                        <MenuItem
                                                                            key={s}
                                                                            value={s}
                                                                            sx={{
                                                                                background:
                                                                                    s === "Trực phòng"
                                                                                        ? "#22c55e22"
                                                                                        : s === "Vắng có phép"
                                                                                            ? "#fde68a"
                                                                                            : s === "Vắng không phép"
                                                                                                ? "#fee2e2"
                                                                                                : s === "Công tác"
                                                                                                    ? "#bae6fd"
                                                                                                    : "#fff",
                                                                                fontWeight: s === "Chưa đăng ký" ? 600 : 500,
                                                                                color:
                                                                                    s === "Trực phòng"
                                                                                        ? "#16a34a"
                                                                                        : s === "Vắng có phép"
                                                                                            ? "#b45309"
                                                                                            : s === "Vắng không phép"
                                                                                                ? "#b91c1c"
                                                                                                : "#22324a",
                                                                                "&:hover": {
                                                                                    background:
                                                                                        s === "Trực phòng"
                                                                                            ? "#16a34a22"
                                                                                            : s === "Vắng có phép"
                                                                                                ? "#fde68a"
                                                                                                : s === "Vắng không phép"
                                                                                                    ? "#fee2e2"
                                                                                                    : s === "Công tác"
                                                                                                        ? "#bae6fd"
                                                                                                        : "#e0e7ff",
                                                                                },
                                                                            }}
                                                                        >
                                                                            {s}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            ) : (
                                                                <span>{value}</span>
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
            >
                <DialogTitle>
                    Chỉnh sửa ca trực
                    <IconButton
                        aria-label="close"
                        onClick={() => setEditOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "#888",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography fontWeight={500} mb={2}>
                        {members[editIdx]} - {days[editDay]} - {times[editTime]}
                    </Typography>
                    <Select
                        value={editShift}
                        onChange={(e) => setEditShift(e.target.value)}
                        fullWidth
                        sx={{
                            borderRadius: 2,
                            background: "#f3f4f6",
                            mb: 2,
                        }}
                    >
                        {shifts.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
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
                        onClick={handleEditShift}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            background:
                                "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                            color: "#fff",
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
                            textTransform: "none",
                            "&:hover": {
                                background:
                                    "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
                            },
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
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    Đổi ca trực với đồng nghiệp
                    <IconButton
                        aria-label="close"
                        onClick={() => setSwapOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "#888",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography fontWeight={500} mb={2}>
                        Chọn thành viên và ca muốn đổi
                    </Typography>
                    <Select
                        value={swapTo.idx ?? ""}
                        onChange={(e) =>
                            setSwapTo({ ...swapTo, idx: Number(e.target.value) })
                        }
                        fullWidth
                        sx={{
                            borderRadius: 2,
                            background: "#f3f4f6",
                            mb: 2,
                        }}
                        displayEmpty
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
                        sx={{
                            borderRadius: 2,
                            background: "#f3f4f6",
                            mb: 2,
                        }}
                        displayEmpty
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
                        sx={{
                            borderRadius: 2,
                            background: "#f3f4f6",
                            mb: 2,
                        }}
                        displayEmpty
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
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setSwapOpen(false)}
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
                        onClick={handleSwapShift}
                        variant="contained"
                        disabled={
                            swapTo.idx === null ||
                            swapTo.day === null ||
                            swapTo.time === null
                        }
                        sx={{
                            borderRadius: 2,
                            background:
                                "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                            color: "#fff",
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
                            textTransform: "none",
                            "&:hover": {
                                background:
                                    "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
                            },
                        }}
                    >
                        Đổi ca
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}