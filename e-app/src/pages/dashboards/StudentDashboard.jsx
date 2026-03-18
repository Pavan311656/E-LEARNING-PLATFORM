import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("APP_COURSES") || "[]"));
  const [enrollments, setEnrollments] = useState(() => JSON.parse(localStorage.getItem("APP_ENROLLMENTS") || "[]"));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("APP_QUIZZES") || "[]"));
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem("APP_COMPLAINTS") || "[]"));

  useEffect(() => {
    localStorage.setItem("APP_COURSES", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("APP_ENROLLMENTS", JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem("APP_QUIZZES", JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem("APP_COMPLAINTS", JSON.stringify(complaints));
  }, [complaints]);

  const enrolledCourses = enrollments.filter(e => e.userId === user.id).map(e => courses.find(c => c.id === e.courseId)).filter(Boolean);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);
  const availableQuizzes = quizzes.filter(q => enrolledCourseIds.includes(q.courseId));
  const availableCourses = courses.filter(c => !enrollments.some(e => e.userId === user.id && e.courseId === c.id));

  const enroll = (courseId) => {
    setEnrollments([...enrollments, { userId: user.id, courseId }]);
  };

  const fileComplaint = (complaint) => {
    setComplaints([...complaints, { id: Date.now(), userId: user.id, userName: user.name, complaint, status: 'pending' }]);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-book-half me-2"></i>E-Learning Platform
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">Welcome, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-white shadow-sm p-3" style={{ width: '250px', minHeight: 'calc(100vh - 76px)' }}>
          <h5 className="text-primary mb-4">Student Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "dashboard" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "Enrolled Courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("Enrolled Courses")}>
                <i className="bi bi-collection me-2"></i>Enrolled Courses
              </button>
            </li>
              <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "Completed Courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("Completed Courses")}>
                <i className="bi bi-check-square-fill me-2"></i>Completed Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "browse" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("browse")}>
                <i className="bi bi-search me-2"></i>Browse Courses
              </button>
            </li>
              <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "mandatory courses" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("mandatory courses")}>
                <i className="bi bi-asterisk me-2"></i>Mandatory Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "quizzes" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("quizzes")}>
                <i className="bi bi-question-circle me-2"></i>Quizzes
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "performance" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("performance")}>
                <i className="bi bi-graph-up me-2"></i>Performance
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "profile" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("profile")}>
                <i className="bi bi-person me-2"></i>Profile
              </button>
            </li>
          
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab === "complaints" ? "text-primary fw-bold" : "text-dark"}`} onClick={() => setActiveTab("complaints")}>
                <i className="bi bi-exclamation-triangle me-2"></i>Complaints
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {activeTab === "dashboard" && (
            <div>
              <div style={{ backgroundColor: '#0DCAF0', color: 'white' }} className="p-5 mb-4 rounded shadow">
                <h1 className="display-4">Welcome back, {user.name}!</h1>
                <p className="lead">Continue your learning journey.</p>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-primary"></i>
                      <h5 className="card-title">Enrolled Courses</h5>
                      <p className="card-text display-4">{enrolledCourses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-trophy display-4 text-success"></i>
                      <h5 className="card-title">Completed Courses</h5>
                      <p className="card-text display-4">0</p> {/* Placeholder */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-info"></i>
                      <h5 className="card-title">Available Courses</h5>
                      <p className="card-text display-4">{courses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-question-circle display-4 text-warning"></i>
                      <h5 className="card-title">Available Quizzes</h5>
                      <p className="card-text display-4">{availableQuizzes.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <h4>Recent Activity</h4>
              <p>No recent activity.</p> {/* Placeholder */}
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4">My Courses</h2>
              <div className="row">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">{course.description}</p>
                        <p className="text-muted">Instructor: {course.instructorName}</p>
                        <div className="progress mb-2">
                          <div className="progress-bar bg-success" style={{ width: '0%' }}></div> {/* Placeholder progress */}
                        </div>
                        <small>0% Complete</small>
                        <button className="btn btn-primary mt-2">Continue Learning</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "browse" && (
            <div>
              <h2 className="mb-4">Browse Courses</h2>
              <div className="row">
                {availableCourses.map(course => (
                  <div key={course.id} className="col-md-4 mb-4">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">{course.description}</p>
                        <p className="text-muted">Instructor: {course.instructorName}</p>
                        <button className="btn btn-success" onClick={() => enroll(course.id)}>Enroll Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              <h2 className="mb-4">Available Quizzes</h2>
              <div className="row">
                {availableQuizzes.map(quiz => (
                  <div key={quiz.id} className="col-md-4 mb-4">
                    <div className="card shadow h-100">
                      <div className="card-body">
                        <h5 className="card-title">{quiz.title}</h5>
                        <p className="card-text">Course: {courses.find(c => c.id === quiz.courseId)?.title}</p>
                        <p className="text-muted">Questions: {quiz.totalQuestions}</p>
                        <button className="btn btn-warning">Take Quiz</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="mb-4">Profile</h2>
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">User Information</h5>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <a href="/profile" className="btn btn-primary">Go to Full Profile</a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h2 className="mb-4">File a Complaint</h2>
              <div className="card shadow">
                <div className="card-body">
                  <ComplaintForm onSubmit={fileComplaint} />
                </div>
              </div>
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
