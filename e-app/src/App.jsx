import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatBot from "./components/chat_bot/ChatBot";



const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const StudentDashboard = lazy(() => import("./pages/dashboards/StudentDashboard"));
const InstructorDashboard = lazy(() => import("./pages/dashboards/InstructorDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile"));
const Home = lazy(() => import("./pages/Home"));


export default function App() {
  return (
    
    <BrowserRouter>
    <ChatBot />
      <Suspense fallback={<div>Loading...</div>}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["student", "instructor", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor-profile"
            element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <InstructorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
