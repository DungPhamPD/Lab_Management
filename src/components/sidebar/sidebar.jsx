import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Sidebar = ({ isSidebarOpen }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const topMenus = [
    { key: "dashboard", to: "/admin", icon: <DashboardIcon fontSize="medium" />, label: "Dashboard" },
    { key: "calendar", to: "/calendar", icon: <CalendarTodayIcon fontSize="medium" />, label: "Calendar" },
    { key: "tasks", to: "/tasks", icon: <AssignmentIcon fontSize="medium" />, label: "Tasks" },
    { key: "user", to: "/users", icon: <PersonOutlineIcon fontSize="medium" />, label: "User" },
  ];
  const middleMenus = [
    { key: "project", to: "/project", icon: <WorkOutlineIcon fontSize="medium" />, label: "Project" },
    { key: "event", to: "/event", icon: <EventNoteIcon fontSize="medium" />, label: "Event" },
    { key: "device", to: "/device", icon: <DevicesOtherIcon fontSize="medium" />, label: "Device" },
    { key: "borrow", to: "/borrow", icon: <AssignmentReturnIcon fontSize="medium" />, label: "Borrow" },
    { key: "kpi", to: "/kpi", icon: <AssessmentIcon fontSize="medium" />, label: "KPI" },
  ];
  const bottomMenus = [
    { key: "setting", to: "/setting", icon: <SettingsIcon fontSize="medium" />, label: "Setting" },
  ];

  const handleLogout = () => setShowConfirmation(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowConfirmation(false);
    navigate("/login", { replace: true });
  };
  const cancelLogout = () => setShowConfirmation(false);

  return (
    <div
      className="bg-white flex flex-col transition-all duration-200 shadow"
      style={{
        width: 256,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="flex flex-col h-full px-0 py-6">
        <div className="flex items-center justify-center mb-8">
          <span className="font-extrabold text-xl text-gray-800 tracking-wide drop-shadow">
            Task Management
          </span>
        </div>
        <ul className="flex flex-col gap-1 px-4">
          {topMenus.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1 px-4 mt-4">
          {middleMenus.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1 px-4 mt-4">
          {bottomMenus.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 text-base w-full focus:outline-none rounded-lg font-medium transition"
              style={{ background: "transparent" }}
            >
              <ExitToAppIcon fontSize="medium" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl px-10 py-8 w-[370px] max-w-full flex flex-col items-center"
            style={{
              border: "2.5px solid #60a5fa",
              boxShadow: "0 8px 32px 0 rgba(80,102,255,0.15), 0 1.5px 8px 0 rgba(80,102,255,0.10)",
            }}
          >
            <p className="mb-6 text-center text-base font-semibold text-gray-800">
              Bạn có chắc chắn muốn đăng xuất?
            </p>
            <div className="flex justify-center gap-5 w-full">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-7 py-2 rounded-full font-semibold text-base shadow transition"
                onClick={confirmLogout}
              >
                Đồng ý
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-7 py-2 rounded-full font-semibold text-base shadow transition"
                onClick={cancelLogout}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
