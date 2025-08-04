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
    {
      key: "dashboard",
      to: "/admin",
      icon: <DashboardIcon fontSize="small" />,
      label: "Dashboard",
    },
    {
      key: "calendar",
      to: "/calendar",
      icon: <CalendarTodayIcon fontSize="small" />,
      label: "Calendar",
    },
    {
      key: "tasks",
      to: "/tasks",
      icon: <AssignmentIcon fontSize="small" />,
      label: "Tasks",
    },
    {
      key: "user",
      to: "/users",
      icon: <PersonOutlineIcon fontSize="small" />,
      label: "User",
    },
  ];

  const middleMenus = [
    {
      key: "project",
      to: "/project",
      icon: <WorkOutlineIcon fontSize="small" />,
      label: "Project",
    },
    {
      key: "event",
      to: "/event",
      icon: <EventNoteIcon fontSize="small" />,
      label: "Event",
    },
    {
      key: "device",
      to: "/device",
      icon: <DevicesOtherIcon fontSize="small" />,
      label: "Device",
    },
    {
      key: "borrow",
      to: "/borrow",
      icon: <AssignmentReturnIcon fontSize="small" />,
      label: "Borrow",
    },
    {
      key: "kpi",
      to: "/kpi",
      icon: <AssessmentIcon fontSize="small" />,
      label: "KPI",
    },
  ];

  const bottomMenus = [
    {
      key: "setting",
      to: "/setting",
      icon: <SettingsIcon fontSize="small" />,
      label: "Settings",
    },
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
    <div className="bg-slate-800 w-64 min-h-screen fixed left-0 top-0 z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="text-white text-xl font-bold">Task Management</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {/* Top Menu Items */}
        {topMenus.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-cyan-600/20 text-cyan-300 border-r-2 border-cyan-400"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <div
                  className={`${
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-400 group-hover:text-cyan-300"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span>{item.label}</span>

                {/* Active indicator - glow effect */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-l-full shadow-lg shadow-cyan-400/50"></div>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="py-4">
          <div className="border-t border-slate-600/50"></div>
        </div>

        {/* Middle Menu Items */}
        {middleMenus.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-cyan-600/20 text-cyan-300 border-r-2 border-cyan-400"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <div
                  className={`${
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-400 group-hover:text-cyan-300"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span>{item.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-l-full shadow-lg shadow-cyan-400/50"></div>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Bottom Menu Items */}
        <div className="pt-8">
          {bottomMenus.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-cyan-600/20 text-cyan-300 border-r-2 border-cyan-400"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <div
                    className={`${
                      isActive
                        ? "text-cyan-300"
                        : "text-slate-400 group-hover:text-cyan-300"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span>{item.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-l-full shadow-lg shadow-cyan-400/50"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group w-full text-left text-slate-300 hover:bg-red-500/10 hover:text-red-300"
          >
            <div className="text-slate-400 group-hover:text-red-400">
              <ExitToAppIcon fontSize="small" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-600/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
            <PersonOutlineIcon fontSize="small" className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-cyan-300 text-xs">Vice President</p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-96 max-w-[90vw] mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExitToAppIcon className="text-red-400" fontSize="large" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to logout from the system?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={confirmLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  Logout
                </button>
                <button
                  onClick={cancelLogout}
                  className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-200 border border-slate-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
