import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ManualQuizCreator from "../../components/forms/ManualQuizCreator";
import InstructorProfile from "../InstructorProfile";
export default function InstructorDashboard() {
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

  const myCourses = courses.filter(c => c.instructorId === user.id);
  const myEnrollments = enrollments.filter(e => myCourses.some(c => c.id === e.courseId));
  const myQuizzes = quizzes.filter(q => myCourses.some(c => c.id === q.courseId));

  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: Date.now(), instructorId: user.id, instructorName: user.name }]);
  };

  const addQuiz = (quiz) => {
    setQuizzes([...quizzes, { ...quiz, id: Date.now() }]);
  };

  const fileComplaint = (complaint) => {
    setComplaints([...complaints, { id: Date.now(), userId: user.id, userName: user.name, complaint, status: 'pending' }]);
  };

  const totalCourses = myCourses.length;
  const totalEnrollments = myEnrollments.length;
  const totalQuizzes = myQuizzes.length;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-mortarboard me-2"></i>E-Learning Platform
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
          <h5 className="text-primary mb-4">Instructor Menu</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "dashboard" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-house-door me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "courses" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("courses")}>
                <i className="bi bi-collection me-2"></i>My Courses
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "create-course" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("create-course")}>
                <i className="bi bi-plus-circle me-2"></i>Create Course
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "students" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("students")}>
                <i className="bi bi-people me-2"></i>Students
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "quizzes" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("quizzes")}>
                <i className="bi bi-question-circle me-2"></i>Quizzes
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "analytics" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("analytics")}>
                <i className="bi bi-bar-chart me-2"></i>Analytics
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className={`nav-link btn btn-link text-start ${activeTab !== "profile" ? "text-dark fw-bold" : "text-primary"}`} onClick={() => setActiveTab("profile")}>
                <i className="bi bi-person me-2"></i>Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          {activeTab === "dashboard" && (
            <div>
              <div className="text-white p-5 mb-4 rounded shadow" style={{backgroundColor:'#0DCAF0',color:'white'}}>
                <h1 className="display-4">Instructor Dashboard</h1>
                <p className="lead">Manage your courses and students.</p>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-book display-4 text-primary"></i>
                      <h5 className="card-title">My Courses</h5>
                      <p className="card-text display-4">{totalCourses}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-people display-4 text-success"></i>
                      <h5 className="card-title">Total Enrollments</h5>
                      <p className="card-text display-4">{totalEnrollments}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow">
                    <div className="card-body">
                      <i className="bi bi-question-circle display-4 text-warning"></i>
                      <h5 className="card-title">My Quizzes</h5>
                      <p className="card-text display-4">{totalQuizzes}</p>
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
                {myCourses.map(course => (
                  <div key={course.id} className="col-md-6 mb-4">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text">{course.description}</p>
                        <p className="text-muted">Enrollments: {enrollments.filter(e => e.courseId === course.id).length}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "create-course" && (
            <div>
              <h2 className="mb-4">Create New Course</h2>
              <div className="card shadow">
                <div className="card-body">
                  <CourseForm onSubmit={addCourse} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="mb-4">Enrolled Students</h2>
              {myCourses.map(course => (
                <div key={course.id} className="mb-4">
                  <h4>{course.title}</h4>
                  <div className="row">
                    {enrollments.filter(e => e.courseId === course.id).map(e => (
                      <div key={e.userId} className="col-md-4 mb-3">
                        <div className="card shadow">
                          <div className="card-body">
                            <p className="card-text">Student ID: {e.userId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              <h2 className="mb-4">My Quizzes</h2>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">Create Quiz</h5>
                      <ManualQuizCreatorWrapper courses={myCourses} onCreateQuiz={addQuiz} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">Automatic by CSV</h5>
                      <p className="text-muted">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
              <h4>My Created Quizzes</h4>
              <div className="row">
                {myQuizzes.map(quiz => (
                  <div key={quiz.id} className="col-md-4 mb-4">
                    <div className="card shadow">
                      <div className="card-body">
                        <h5 className="card-title">{quiz.title}</h5>
                        <p className="card-text">Course: {courses.find(c => c.id === quiz.courseId)?.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h2 className="mb-4">Analytics</h2>
              <p>Analytics will be displayed here.</p> {/* Placeholder */}
            </div>
          )}

{activeTab === "profile" && (
  <div>
    <InstructorProfile />
  </div>
)}
        </div>
      </div>
    </div>
  );
}

function CourseForm({ onSubmit }) {
  const [course, setCourse] = useState({ title: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(course);
    setCourse({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Course Title</label>
        <input className="form-control" placeholder="Course Title" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" placeholder="Description" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} required />
      </div>
      <button className="btn btn-primary">Add Course</button>
    </form>
  );
}

function ManualQuizCreatorWrapper({ courses, onCreateQuiz }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const handleCreateQuiz = (quizData) => {
    if (!selectedCourseId) {
      alert("Please select a course for the quiz.");
      return;
    }
    const quiz = {
      courseId: selectedCourseId,
      title: quizData.title,
      questions: quizData.questions,
      totalQuestions: quizData.totalQuestions,
      createdAt: quizData.createdAt
    };
    onCreateQuiz(quiz);
    alert("Quiz created successfully!");
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Select Course</label>
        <select className="form-control" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      {selectedCourseId && <ManualQuizCreator onCreate={handleCreateQuiz} />}
    </div>
  );
}
