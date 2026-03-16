import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));

  useEffect(() => {
    localStorage.setItem("APP_COURSES", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("APP_ENROLLMENTS", JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  const enrolledCourses = enrollments.filter(e => e.userId === user.id).map(e => courses.find(c => c.id === e.courseId)).filter(Boolean);

  const availableCourses = courses.filter(c => !enrollments.some(e => e.userId === user.id && e.courseId === c.id));

  const enroll = (courseId) => {
    setEnrollments([...enrollments, { userId: user.id, courseId }]);
  };

  const fileComplaint = (complaint) => {
    setComplaints([...complaints, { id: Date.now(), userId: user.id, userName: user.name, complaint, status: 'pending' }]);
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Student Dashboard - {user.name}</span>
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
            <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>User Management</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "complaints" ? "active" : ""}`} onClick={() => setActiveTab("complaints")}>Complaint Management</button>
          </li>
        </ul>

        <div className="mt-4">
          {activeTab === "courses" && (
            <div>
              <h4>Available Courses</h4>
              {availableCourses.map(course => (
                <div key={course.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                    <p>Instructor: {course.instructorName}</p>
                    <button className="btn btn-primary" onClick={() => enroll(course.id)}>Enroll</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "enrolls" && (
            <div>
              <h4>My Enrolled Courses</h4>
              {enrolledCourses.map(course => (
                <div key={course.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <h4>Assessments & Quizzes</h4>
              <p>Quizzes for enrolled courses will be listed here.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h4>User Profile</h4>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h4>File a Complaint</h4>
              <ComplaintForm onSubmit={fileComplaint} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplaintForm({ onSubmit }) {
  const [complaint, setComplaint] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(complaint);
    setComplaint("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea className="form-control" rows="4" value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Describe your complaint..." required />
      <button className="btn btn-warning mt-2">Submit Complaint</button>
    </form>
  );
}
``