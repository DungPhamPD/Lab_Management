import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Login } from "./components/Login.jsx";
import { Register } from "./components/Register.jsx";
import DashboardAdmin from "./pages/home/dashboard-admin.jsx";
import Sidebar from "./components/sidebar/sidebar.jsx";
import Users from "./pages/users/users.jsx";
import Task from "./pages/tasks/task.jsx";
import Event from "./pages/event/event.jsx";
import Device from "./pages/device/device.jsx";
import Project from "./pages/project/project.jsx";
import KPI from "./pages/kpi/kpi.jsx";
import Calendar from "./pages/calendar/calendar.jsx";
import { useState } from "react";
import BorrowPage from "./pages/borrow/borrow";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [isSidebarOpen] = useState(true);
  const location = useLocation();

  // Ẩn sidebar ở trang login và register
  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar isSidebarOpen={isSidebarOpen} />}
      <div
        className="main-content"
        style={{
          marginLeft: !hideSidebar ? (isSidebarOpen ? 256 : 72) : 0,
          transition: "margin-left 0.2s",
          width: "100%",
        }}
      >
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Task />
              </PrivateRoute>
            }
          />
          <Route
            path="/event"
            element={
              <PrivateRoute>
                <Event />
              </PrivateRoute>
            }
          />
          <Route
            path="/device"
            element={
              <PrivateRoute>
                <Device />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <Project />
              </PrivateRoute>
            }
          />
          <Route
            path="/kpi"
            element={
              <PrivateRoute>
                <KPI />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrow"
            element={
              <PrivateRoute>
                <BorrowPage isAdmin={true} currentUser="Nguyễn Văn A" />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
