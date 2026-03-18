import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ManualQuizCreator from "../../components/forms/ManualQuizCreator";

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
    setQuizzes([...quizzes, { ...quiz, id: quiz.id ?? Date.now() }]);
  };

  const updateQuiz = (updatedQuiz) => {
    setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
  };

  const removeQuiz = (quizId) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
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
              <QuizManager
                courses={myCourses}
                quizzes={myQuizzes}
                allCourses={courses}
                onCreateQuiz={addQuiz}
                onUpdateQuiz={updateQuiz}
                onDeleteQuiz={removeQuiz}
              />
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
              <h2 className="mb-4">Profile</h2>
              <div className="card shadow">
                <div className="card-body">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <a href="/instructor-profile" className="btn btn-primary">Go to Full Profile</a>
                </div>
              </div>
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

function ManualQuizCreatorWrapper({ courses, onCreateQuiz, onCreated }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const handleCreateQuiz = (quizData) => {
    if (!selectedCourseId) {
      alert("Please select a course for the quiz.");
      return;
    }
    const newId = Date.now();
    const quiz = {
      id: newId,
      courseId: selectedCourseId,
      title: quizData.title,
      questions: quizData.questions,
      totalQuestions: quizData.totalQuestions,
      createdAt: quizData.createdAt,
      published: quizData.published,
    };
    onCreateQuiz(quiz);
    onCreated?.(newId);
    alert("Quiz created successfully!");
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Select Course</label>
        <select className="form-control" value={selectedCourseId} onChange={(e) => setSelectedCourseId(Number(e.target.value) || "")}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      {selectedCourseId && <ManualQuizCreator onCreate={handleCreateQuiz} />}
    </div>
  );
}

function QuizManager({ courses, quizzes, allCourses, onCreateQuiz, onUpdateQuiz, onDeleteQuiz }) {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === selectedQuizId);

  const publishedQuizzes = quizzes.filter(q => q.published);

  const handleSelectQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setEditMode(false);
  };

  const handleSelectQuizFromCreate = (quizId) => {
    setSelectedQuizId(quizId);
    setEditMode(false);
  };

  const handlePublishToggle = (quiz) => {
    onUpdateQuiz({ ...quiz, published: !quiz.published });
  };

  return (
    <div className="container-fluid p-0">
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => { setActiveTab('create'); setSelectedQuizId(null); }}>
            Create Quiz
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'my-quizzes' ? 'active' : ''}`} onClick={() => { setActiveTab('my-quizzes'); setEditMode(false); }}>
            My Quizzes
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'published' ? 'active' : ''}`} onClick={() => { setActiveTab('published'); setEditMode(false); }}>
            Published Quizzes
          </button>
        </li>
      </ul>

      {activeTab === 'create' && (
        <div className="row gy-4">
          <div className="col-lg-7">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Create / Edit Quiz</h5>
                <ManualQuizCreatorWrapper
                  courses={courses}
                  onCreateQuiz={onCreateQuiz}
                  onCreated={(id) => {
                    setSelectedQuizId(id);
                    setActiveTab('create');
                    setEditMode(false);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Automatic by CSV</h5>
                <p className="text-muted">Upload a CSV to create quiz questions quickly.</p>
                <div className="mb-3">
                  <input type="file" accept=".csv" className="form-control" disabled />
                  <small className="text-muted">(Coming soon)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <h5 className="mt-4">Recently Created Quizzes</h5>
            <div className="row">
              {quizzes.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-secondary">No quizzes created yet.</div>
                </div>
              )}
              {quizzes.slice().reverse().map(quiz => (
                <div key={quiz.id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm" onClick={() => handleSelectQuizFromCreate(quiz.id)} style={{ cursor: 'pointer' }}>
                    <div className="card-body">
                      <h5 className="card-title">{quiz.title}</h5>
                      <p className="card-text mb-2"><strong>Course:</strong> {allCourses.find(c => c.id === quiz.courseId)?.title || '—'}</p>
                      <p className="mb-2"><small className="text-muted">Questions: {quiz.totalQuestions}</small></p>
                      <span className={`badge ${quiz.published ? 'bg-success' : 'bg-secondary'}`}>{quiz.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedQuizId && (
              <div className="mt-4">
                <h5>Preview Selected Quiz</h5>
                <QuizPreview
                  key={selectedQuizId}
                  quiz={quizzes.find(q => q.id === selectedQuizId)}
                  course={allCourses.find(c => c.id === quizzes.find(q => q.id === selectedQuizId)?.courseId)}
                  onUpdateQuiz={onUpdateQuiz}
                  onDeleteQuiz={(id) => {
                    onDeleteQuiz(id);
                    setSelectedQuizId(null);
                  }}
                  onTogglePublish={handlePublishToggle}
                  editMode={editMode}
                  setEditMode={setEditMode}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {(activeTab === 'my-quizzes' || activeTab === 'published') && (
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">{activeTab === 'published' ? 'Published Quizzes' : 'Your Quizzes'}</h5>
                {activeTab === 'published' && publishedQuizzes.length === 0 && (
                  <div className="alert alert-info">No published quizzes yet.</div>
                )}
                {(activeTab === 'my-quizzes' ? quizzes : publishedQuizzes).map(q => (
                  <button
                    key={q.id}
                    className={`btn btn-outline-primary w-100 text-start mb-2 ${selectedQuizId === q.id ? 'active' : ''}`}
                    onClick={() => handleSelectQuiz(q.id)}
                  >
                    <div className="fw-bold">{q.title}</div>
                    <small className="text-muted">{allCourses.find(c => c.id === q.courseId)?.title || 'No course'}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {activeQuiz ? (
              <QuizPreview
                key={activeQuiz.id}
                quiz={activeQuiz}
                course={allCourses.find(c => c.id === activeQuiz.courseId)}
                onUpdateQuiz={onUpdateQuiz}
                onDeleteQuiz={(id) => {
                  onDeleteQuiz(id);
                  setSelectedQuizId(null);
                }}
                onTogglePublish={handlePublishToggle}
                editMode={editMode}
                setEditMode={setEditMode}
              />
            ) : (
              <div className="alert alert-secondary">Select a quiz to preview and manage it (or create a new one).</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizPreview({ quiz, course, onUpdateQuiz, onDeleteQuiz, onTogglePublish, editMode, setEditMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftQuestion, setDraftQuestion] = useState(null);

  const question = quiz.questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setDraftQuestion(null);
  }, [quiz.id]);

  useEffect(() => {
    if (editMode && question) {
      setDraftQuestion(question);
    }
  }, [editMode, question]);

  const updateQuestion = (updates) => {
    const updatedQuestions = quiz.questions.map((q, idx) => idx === currentIndex ? { ...q, ...updates } : q);
    onUpdateQuiz({ ...quiz, questions: updatedQuestions, totalQuestions: updatedQuestions.length });
  };

  const deleteQuestion = () => {
    if (!window.confirm('Remove this question from the quiz?')) return;
    const updated = quiz.questions.filter((_, idx) => idx !== currentIndex);
    onUpdateQuiz({ ...quiz, questions: updated, totalQuestions: updated.length });
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const toggleOption = (option) => {
    if (!question) return;
    if (question.type === 'single') {
      updateQuestion({ correctAnswer: option });
    } else if (question.type === 'multiple') {
      const existing = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const next = existing.includes(option) ? existing.filter(o => o !== option) : [...existing, option];
      updateQuestion({ correctAnswer: next });
    }
  };

  const onQuestionFieldChange = (field, value) => {
    setDraftQuestion(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    if (!draftQuestion) return;
    updateQuestion(draftQuestion);
    setDraftQuestion(null);
  };

  const renderOptionRow = (opt, idx) => {
    const isCorrect = question.type === 'multiple'
      ? (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(opt))
      : question.correctAnswer === opt;

    const baseClasses = 'p-2 rounded d-flex justify-content-between align-items-center mb-2';
    const statusClasses = isCorrect ? 'bg-success-subtle border border-success text-success' : 'bg-white border border-secondary';

    return (
      <div key={idx} className={`${baseClasses} ${statusClasses}`}>
        <div className="d-flex align-items-center gap-2">
          {question.type === 'multiple' ? (
            <i className="bi bi-check2-square"></i>
          ) : (
            <i className="bi bi-circle"></i>
          )}
          {editMode ? (
            <input
              className="form-control form-control-sm"
              value={draftQuestion?.options?.[idx] ?? opt}
              onChange={(e) => {
                const copy = [...(draftQuestion?.options ?? question.options)];
                copy[idx] = e.target.value;
                onQuestionFieldChange('options', copy);
              }}
            />
          ) : (
            <span>{opt}</span>
          )}
        </div>
        {editMode ? (
          <button className="btn btn-sm btn-outline-danger" onClick={() => {
            const copy = [...(draftQuestion?.options ?? question.options)];
            copy.splice(idx, 1);
            onQuestionFieldChange('options', copy);
          }}>Remove</button>
        ) : (
          <button className="btn btn-sm btn-outline-primary" onClick={() => toggleOption(opt)}>
            {isCorrect ? 'Correct' : 'Mark'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="card-title mb-1">{quiz.title}</h4>
            <p className="mb-1"><small className="text-muted">Course: {course?.title ?? '—'}</small></p>
            <p className="mb-1"><small className="text-muted">Questions: {quiz.questions.length}</small></p>
          </div>
          <div className="text-end">
            <button className={`btn btn-sm ${quiz.published ? 'btn-outline-success' : 'btn-success'} me-2`} onClick={() => onTogglePublish(quiz)}>
              {quiz.published ? 'Unpublish' : 'Publish'}
            </button>
            <button className={`btn btn-sm ${editMode ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Exit Edit' : 'Edit'}
            </button>
            <button className="btn btn-sm btn-danger ms-2" onClick={() => onDeleteQuiz(quiz.id)}>Delete</button>
          </div>
        </div>

        {quiz.questions.length === 0 ? (
          <div className="alert alert-warning">No questions in this quiz.</div>
        ) : (
          <>
            {/* Question navigation */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentIndex === quiz.questions.length - 1}
                  onClick={() => setCurrentIndex(i => Math.min(quiz.questions.length - 1, i + 1))}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
              <div>
                <span className="badge bg-secondary">Q{currentIndex + 1} of {quiz.questions.length}</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">Question {currentIndex + 1}</h5>
                      <button className="btn btn-sm btn-outline-danger" onClick={deleteQuestion}>Remove Question</button>
                    </div>
                    {editMode ? (
                      <div className="mb-3">
                        <label className="form-label">Question Text</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={draftQuestion?.questionText ?? question.questionText}
                          onChange={(e) => onQuestionFieldChange('questionText', e.target.value)}
                        />
                      </div>
                    ) : (
                      <p className="mb-3">{question.questionText}</p>
                    )}
                    <div className="mb-3">
                      <span className="badge bg-info">Type: {question.type}</span>
                    </div>

                    <div>
                      <h6 className="mb-2">Options</h6>
                      {question.options.length === 0 && <p className="text-muted">No options defined.</p>}
                      {question.options.map(renderOptionRow)}
                    </div>

                    {editMode && (
                      <div className="mt-3">
                        <button className="btn btn-primary btn-sm" onClick={saveDraft}>Save Changes</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title">Jump to Question</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {quiz.questions.map((_, idx) => (
                        <button
                          key={idx}
                          className={`btn btn-sm ${idx === currentIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setCurrentIndex(idx)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
