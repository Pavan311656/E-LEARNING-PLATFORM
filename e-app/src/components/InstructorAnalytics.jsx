import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { setMouseClickAxisIndex } from 'recharts/types/state/tooltipSlice';

const InstructorAnalytics = ({ userId, courses, enrollments, quizzes, quizAttempts }) => {
  // Calculate real data from props
  const myCourses = courses.filter(c => c.instructorId === userId);
  const myEnrollments = enrollments.filter(e => myCourses.some(c => c.id === e.courseId));
  const myQuizzes = quizzes.filter(q => myCourses.some(c => c.id === q.courseId));
  const myQuizAttempts = quizAttempts.filter(qa => myQuizzes.some(q => q.id === qa.quizId));

  // Course progress lookup from localStorage (shared state in this demo app)
  const rawProgress = localStorage.getItem('APP_COURSE_PROGRESS') || '{}';
  const courseProgress = JSON.parse(rawProgress);

  // Overview Cards Data
  const courseRatings = JSON.parse(localStorage.getItem('APP_COURSE_RATINGS') || '{}');
  const myCourseRatings = myCourses.map(course => courseRatings[course.id]).filter(Boolean);
  const avgInstructorRating = myCourseRatings.length > 0 ? (myCourseRatings.reduce((sum, r) => sum + (r.instructorRating || 0), 0) / myCourseRatings.length).toFixed(1) : '0.0';

  const totalStudents = new Set(myEnrollments.map(e => e.userId)).size;
  const totalRevenue = myEnrollments.length * 50; // Assuming $50 per enrollment
  const averageRating = avgInstructorRating;
  const avgCourseRating = averageRating; // alias for display without throwing reference error
  const completionRate = myCourses.length > 0
    ? Math.round(myCourses.reduce((acc, c) => acc + (courseProgress[c.id]?.progress || 0), 0) / myCourses.length)
    : 0;

  // Enrollment Trend Data (last 30 days)
  const enrollmentTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayEnrollments = myEnrollments.filter(e => {
      const enrollDate = new Date(e.enrolledAt || Date.now());
      return enrollDate.toDateString() === date.toDateString();
    }).length;
    return {
      date: date.toLocaleDateString(),
      enrollments: dayEnrollments
    };
  });

  // Monthly Revenue Data (last 12 months)
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthEnrollments = myEnrollments.filter(e => {
      const enrollDate = new Date(e.enrolledAt || Date.now());
      return enrollDate.getMonth() === date.getMonth() && enrollDate.getFullYear() === date.getFullYear();
    }).length;
    return {
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      revenue: monthEnrollments * 50
    };
  });

  // Course Engagement Data
  const getDurationMinutes = (durationLabel) => {
    if (!durationLabel) return 120;
    const match = durationLabel.match(/\d+(\.\d+)?/);
    if (!match) return 120;
    const value = parseFloat(match[0]);
    if (durationLabel.toLowerCase().includes('week')) return Math.round(value * 7 * 60);
    if (durationLabel.toLowerCase().includes('day')) return Math.round(value * 24 * 60);
    if (durationLabel.toLowerCase().includes('hour')) return Math.round(value * 60);
    return Math.round(value * 60);
  };

  const courseEngagement = myCourses.map(course => {
    const courseEnrollments = myEnrollments.filter(e => e.courseId === course.id);
    const progressPercent = courseProgress[course.id]?.progress || 0;
    const completed = progressPercent >= 100 ? courseEnrollments.length : 0;
    const durationMinutes = getDurationMinutes(course.duration);
    const avgWatchTime = Math.round((progressPercent / 100) * durationMinutes);
    return {
      course: course.title,
      enrolled: courseEnrollments.length,
      completed,
      completionRate: progressPercent,
      avgWatchTime
    };
  });

  // Drop-off Analysis (dynamic based on course progress)
  const dropOffData = [
    { lesson: 'Introduction', completion: 100 },
    { lesson: 'Chapter 1', completion: myCourses.length > 0 ? Math.round(myCourses.reduce((sum, course) => sum + Math.min(courseProgress[course.id]?.progress || 0, 20), 0) / myCourses.length) : 0 },
    { lesson: 'Chapter 2', completion: myCourses.length > 0 ? Math.round(myCourses.reduce((sum, course) => sum + Math.min(courseProgress[course.id]?.progress || 0, 40), 0) / myCourses.length) : 0 },
    { lesson: 'Chapter 3', completion: myCourses.length > 0 ? Math.round(myCourses.reduce((sum, course) => sum + Math.min(courseProgress[course.id]?.progress || 0, 60), 0) / myCourses.length) : 0 },
    { lesson: 'Chapter 4', completion: myCourses.length > 0 ? Math.round(myCourses.reduce((sum, course) => sum + Math.min(courseProgress[course.id]?.progress || 0, 80), 0) / myCourses.length) : 0 },
    { lesson: 'Final Quiz', completion: myCourses.length > 0 ? Math.round(myCourses.reduce((sum, course) => sum + (courseProgress[course.id]?.progress || 0), 0) / myCourses.length) : 0 }
  ];

  // Quiz Performance
  const quizPerformance = myQuizAttempts.length > 0 ? {
    averageScore: Math.round(myQuizAttempts.reduce((sum, qa) => sum + (qa.score || 0), 0) / myQuizAttempts.length),
    passRate: Math.round((myQuizAttempts.filter(qa => (qa.score || 0) >= 60).length / myQuizAttempts.length) * 100)
  } : { averageScore: 0, passRate: 0 };

  // Recent Reviews (dynamic from course ratings)
  const recentReviews = myCourseRatings
    .filter(r => r.comment)
    .sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt))
    .slice(0, 3)
    .map(r => ({
      student: 'Anonymous Student', // Since we don't have student names in ratings
      rating: r.courseRating,
      review: r.comment,
      date: new Date(r.ratedAt).toLocaleDateString()
    }));

  return (
    <div className="instructor-analytics">
      <h2 className="mb-4 fw-bold text-dark">Analytics Dashboard</h2>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-people-fill display-4 text-primary mb-2"></i>
              <h5 className="card-title">Total Students</h5>
              <h3 className="text-primary">{totalStudents}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-cash display-4 text-success mb-2"></i>
              <h5 className="card-title">Total Revenue</h5>
              <h3 className="text-success">${totalRevenue}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-star-fill display-4 text-warning mb-2"></i>
              <h5 className="card-title">Average Rating</h5>
              <h3 className="text-warning">{averageRating}/5</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-check-circle-fill display-4 text-info mb-2"></i>
              <h5 className="card-title">Completion Rate</h5>
              <h3 className="text-info">{completionRate}%</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-star-fill display-4 text-warning mb-2"></i>
              <h5 className="card-title">Avg Course Rating</h5>
              <h3 className="text-warning">{avgCourseRating}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <i className="bi bi-person-badge-fill display-4 text-success mb-2"></i>
              <h5 className="card-title">Avg Instructor Rating</h5>
              <h3 className="text-success">{avgInstructorRating}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="card shadow border-0 mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Enrollment Trend (Last 30 Days)</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enrollments" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row mb-4">
        {/* Revenue Analytics */}
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Monthly Revenue</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#28a745" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Course Engagement */}
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Course Engagement</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Enrolled</th>
                      <th>Completed</th>
                      <th>Completion Rate</th>
                      <th>Total Watch Time (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseEngagement.map((course, index) => (
                      <tr key={index}>
                        <td>{course.course}</td>
                        <td>{course.enrolled}</td>
                        <td>{course.completed}</td>
                        <td>{course.completionRate}%</td>
                        <td>{course.avgWatchTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Drop-off Analysis */}
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Drop-off Analysis</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dropOffData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lesson" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completion" stroke="#ffc107" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="col-md-6 mb-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Quiz Performance</h5>
            </div>
            <div className="card-body text-center">
              <div className="row">
                <div className="col-6">
                  <h4 className="text-primary">{quizPerformance.averageScore}%</h4>
                  <p>Average Score</p>
                </div>
                <div className="col-6">
                  <h4 className="text-success">{quizPerformance.passRate}%</h4>
                  <p>Pass Rate</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Passed', value: quizPerformance.passRate },
                      { name: 'Failed', value: 100 - quizPerformance.passRate }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#28a745" />
                    <Cell fill="#dc3545" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="card shadow border-0 mb-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Recent Reviews</h5>
        </div>
        <div className="card-body">
          {recentReviews.map((review, index) => (
            <div key={index} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{review.student}</h6>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                    ))}
                  </div>
                  <p className="mb-1">{review.review}</p>
                </div>
                <small className="text-muted">{review.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;