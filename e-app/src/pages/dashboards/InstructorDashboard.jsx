import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");

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

  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: Date.now(), instructorId: user.id, instructorName: user.name }]);
  };

  const addQuiz = (quiz) => {
    setQuizzes([...quizzes, { ...quiz, id: Date.now() }]);
  };

  const fileComplaint = (complaint) => {
    setComplaints([...complaints, { id: Date.now(), userId: user.id, userName: user.name, complaint, status: 'pending' }]);
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Instructor Dashboard - {user.name}</span>
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
              <h4>My Courses</h4>
              <CourseForm onSubmit={addCourse} />
              {myCourses.map(course => (
                <div key={course.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "enrolls" && (
            <div>
              <h4>Enrollments</h4>
              {myCourses.map(course => (
                <div key={course.id}>
                  <h5>{course.title}</h5>
                  {enrollments.filter(e => e.courseId === course.id).map(e => (
                    <p key={e.userId}>Student ID: {e.userId}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <h4>Assessments & Quizzes</h4>
              <QuizForm onSubmit={addQuiz} courses={myCourses} />
              {quizzes.filter(q => myCourses.some(c => c.id === q.courseId)).map(quiz => (
                <div key={quiz.id} className="card mb-2">
                  <div className="card-body">
                    <h5>{quiz.title}</h5>
                    <p>Course: {courses.find(c => c.id === quiz.courseId)?.title}</p>
                  </div>
                </div>
              ))}
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

function CourseForm({ onSubmit }) {
  const [course, setCourse] = useState({ title: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(course);
    setCourse({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input className="form-control mb-2" placeholder="Course Title" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} required />
      <textarea className="form-control mb-2" placeholder="Description" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} required />
      <button className="btn btn-success">Add Course</button>
    </form>
  );
}

function QuizForm({ onSubmit, courses }) {
  const [quiz, setQuiz] = useState({ courseId: "", title: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quiz);
    setQuiz({ courseId: "", title: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <select className="form-control mb-2" value={quiz.courseId} onChange={(e) => setQuiz({ ...quiz, courseId: e.target.value })} required>
        <option value="">Select Course</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <input className="form-control mb-2" placeholder="Quiz Title" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} required />
      <button className="btn btn-success">Add Quiz</button>
    </form>
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
