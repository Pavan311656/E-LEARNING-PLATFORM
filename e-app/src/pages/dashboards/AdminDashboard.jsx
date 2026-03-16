import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout, users, updateUser, removeUser } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));

  useEffect(() => {
    localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  const verifyUser = (userId) => {
    updateUser(userId, { verified: true });
  };

  const solveComplaint = (complaintId) => {
    setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: 'solved' } : c));
  };

  const removeInstructor = (userId) => {
    removeUser(userId);
    setCourses(courses.filter(c => c.instructorId !== userId));
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Admin Dashboard - {user.name}</span>
          <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-4">
        <ul className="nav nav-pills flex-column flex-md-row mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "courses" ? "active" : ""}`} onClick={() => setActiveTab("courses")}>Course Management</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "enrolls" ? "active" : ""}`} onClick={() => setActiveTab("enrolls")}>Enroll Management</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "assessments" ? "active" : ""}`} onClick={() => setActiveTab("assessments")}>Assessments & Quizzes</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>User Management</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "complaints" ? "active" : ""}`} onClick={() => setActiveTab("complaints")}>Complaint Management</button>
          </li>
        </ul>

        <div className="mt-4">
          {activeTab === "courses" && (
            <div>
              <h4>All Courses</h4>
              {courses.map(course => (
                <div key={course.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                    <p>Instructor: {course.instructorName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "enrolls" && (
            <div>
              <h4>All Enrollments</h4>
              {enrollments.map(e => {
                const course = courses.find(c => c.id === e.courseId);
                const student = users.find(u => u.id === e.userId);
                return (
                  <div key={`${e.userId}-${e.courseId}`} className="card mb-2">
                    <div className="card-body">
                      <p>Student: {student?.name}</p>
                      <p>Course: {course?.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <h4>All Quizzes</h4>
              {quizzes.map(quiz => {
                const course = courses.find(c => c.id === quiz.courseId);
                return (
                  <div key={quiz.id} className="card mb-2">
                    <div className="card-body">
                      <h5>{quiz.title}</h5>
                      <p>Course: {course?.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h4>All Users</h4>
              {users.map(u => (
                <div key={u.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{u.name} ({u.role})</h5>
                    <p>Email: {u.email}</p>
                    <p>Verified: {u.verified ? "Yes" : "No"}</p>
                    {!u.verified && <button className="btn btn-success" onClick={() => verifyUser(u.id)}>Verify</button>}
                    {u.role === "instructor" && <button className="btn btn-danger" onClick={() => removeInstructor(u.id)}>Remove Instructor</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h4>All Complaints</h4>
              {complaints.map(c => (
                <div key={c.id} className="card mb-2">
                  <div className="card-body">
                    <h5>From: {c.userName}</h5>
                    <p>{c.complaint}</p>
                    <p>Status: {c.status}</p>
                    {c.status === 'pending' && <button className="btn btn-primary" onClick={() => solveComplaint(c.id)}>Mark as Solved</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}