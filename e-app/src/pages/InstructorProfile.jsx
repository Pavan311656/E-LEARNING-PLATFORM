import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/InstructorProfile.css";

export default function InstructorProfile() {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("information");
  const [instructorData, setInstructorData] = useState({
    phoneNumber: "",
    bio: "",
    profilePicture: null,
    profilePicturePreview: "/default-profile.png",
    qualifications: "",
    linkedinUrl: "",
    portfolioUrl: "",
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    subjectExpertise: "",
    availabilitySlots: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState(instructorData);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Simulated instructor data
  const [coursesCreated] = useState([
    { id: 1, title: "React Basics", studentsEnrolled: 150, rating: 4.8, reviews: 45 },
    { id: 2, title: "JavaScript Advanced", studentsEnrolled: 200, rating: 4.9, reviews: 63 },
    { id: 3, title: "Web Design Masterclass", studentsEnrolled: 120, rating: 4.7, reviews: 38 },
  ]);

  const [studentFeedback] = useState([
    { id: 1, studentName: "Raj Kumar", feedback: "Excellent teaching style!", rating: 5 },
    { id: 2, studentName: "Priya Singh", feedback: "Very clear explanations", rating: 5 },
    { id: 3, studentName: "Amit Patel", feedback: "Great course structure", rating: 4 },
    { id: 4, studentName: "Neha Gupta", feedback: "Could improve pacing", rating: 4 },
  ]);

  const [earningsData] = useState({
    totalEarnings: 45000,
    thisMonthEarnings: 8500,
    thisMonthRevenue: 15200,
    totalStudents: 470,
    totalCourses: 3,
    averageRating: 4.8,
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem(`INSTRUCTOR_PROFILE_${user.id}`);
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setInstructorData(data);
      setOriginalData(data);
    }
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage({ type: "", text: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInstructorData(prev => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      if (instructorData.newPassword && instructorData.newPassword !== instructorData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return;
      }

      localStorage.setItem(`INSTRUCTOR_PROFILE_${user.id}`, JSON.stringify(instructorData));

      if (updateUserProfile) {
        updateUserProfile(instructorData);
      }

      setOriginalData(instructorData);
      setIsEditMode(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  const handleCancel = () => {
    setInstructorData(originalData);
    setIsEditMode(false);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="instructor-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="back-button">
          <a href="/dashboard/instructor" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </a>
        </div>
        <h1 className="mb-0">
          <i className="bi bi-briefcase me-2"></i>Instructor Profile
        </h1>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`} role="alert">
          <i className={`bi bi-${message.type === "success" ? "check-circle" : "exclamation-circle"} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
        </div>
      )}

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src={instructorData.profilePicturePreview} alt="Profile" />
            <div className="avatar-overlay">
              <span className="badge bg-warning">Instructor</span>
            </div>
          </div>
          <div className="user-info text-center mb-4">
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-muted mb-2">{user.email}</p>
            <span className="badge bg-warning">Instructor</span>
            <div className="instructor-rating mt-2">
              <div className="rating-stars">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-half text-warning"></i>
              </div>
              <small>4.8 Rating</small>
            </div>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-tab ${activeTab === "information" ? "active" : ""}`}
              onClick={() => setActiveTab("information")}
            >
              <i className="bi bi-person me-2"></i>Profile Info
            </button>
            <button
              className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="bi bi-gear me-2"></i>Account Settings
            </button>
            <button
              className={`nav-tab ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <i className="bi bi-lightbulb me-2"></i>Teaching Preferences
            </button>
            <button
              className={`nav-tab ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <i className="bi bi-graph-up me-2"></i>Activity & Analytics
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Profile Information Tab */}
          {activeTab === "information" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-person me-2"></i>Profile Information
                </h3>
                {!isEditMode && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit
                  </button>
                )}
              </div>

              <div className="section-body">
                {/* Profile Picture */}
                <div className="form-section">
                  <label className="form-label fw-bold">Profile Picture</label>
                  <div className="profile-picture-upload">
                    {isEditMode ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-control mb-3"
                        />
                        <img
                          src={instructorData.profilePicturePreview}
                          alt="Preview"
                          className="preview-img"
                        />
                      </>
                    ) : (
                      <img
                        src={instructorData.profilePicturePreview}
                        alt="Profile"
                        className="preview-img"
                      />
                    )}
                  </div>
                </div>

                {/* Name (Read-only) */}
                <div className="form-section">
                  <label className="form-label fw-bold">Name</label>
                  {isEditMode ? (
                    <input
                    type="text"
                    className="form-control"
                    value={user.name}
                    onChange={handleInputChange}
                  />
                    ) : (
                        <input
                      type="text"
                      className="form-control"
                      value={user.name || "Not provided"}
                      disabled
                    />
                  )}
                </div>
                <div className="form-section">
                  <label className="form-label fw-bold">Email</label>
                   {isEditMode ? (
                    <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                  ) : (
                    <input
                      type="email"
                      className="form-control"
                      value={user.email|| "Not provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Phone Number */}
                <div className="form-section">
                  <label className="form-label fw-bold">Phone Number</label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      value={instructorData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <input
                      type="tel"
                      className="form-control"
                      value={instructorData.phoneNumber || "Not provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Bio/Description */}
                <div className="form-section">
                  <label className="form-label fw-bold">Bio / Short Description</label>
                  {isEditMode ? (
                    <textarea
                      name="bio"
                      className="form-control"
                      value={instructorData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your teaching experience"
                      rows="4"
                    ></textarea>
                  ) : (
                    <textarea
                      className="form-control"
                      value={instructorData.bio || "Not provided"}
                      disabled
                      rows="4"
                    ></textarea>
                  )}
                </div>

                {/* Qualifications */}
                <div className="form-section">
                  <label className="form-label fw-bold">Qualifications</label>
                  <small className="text-muted d-block mb-2">Degrees, certifications, and credentials (comma-separated)</small>
                  {isEditMode ? (
                    <textarea
                      name="qualifications"
                      className="form-control"
                      value={instructorData.qualifications}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Sc Computer Science, AWS Certified Solutions Architect, Oracle Java Certified"
                      rows="3"
                    ></textarea>
                  ) : (
                    <div className="qualifications-display">
                      {instructorData.qualifications ? (
                        <div>
                          {instructorData.qualifications.split(",").map((qual, index) => (
                            <span key={index} className="badge bg-info me-2 mb-2">
                              {qual.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No qualifications added</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="form-section">
                  <label className="form-label fw-bold">Social Links</label>
                  
                  {/* LinkedIn */}
                  <div className="social-link-group mb-3">
                    <label className="form-label">
                      <i className="bi bi-linkedin me-2"></i>LinkedIn Profile
                    </label>
                    {isEditMode ? (
                      <input
                        type="url"
                        name="linkedinUrl"
                        className="form-control"
                        value={instructorData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <>
                        {instructorData.linkedinUrl ? (
                          <a href={instructorData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                            {instructorData.linkedinUrl}
                          </a>
                        ) : (
                          <p className="text-muted">Not provided</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Portfolio */}
                  <div className="social-link-group">
                    <label className="form-label">
                      <i className="bi bi-globe me-2"></i>Portfolio Website
                    </label>
                    {isEditMode ? (
                      <input
                        type="url"
                        name="portfolioUrl"
                        className="form-control"
                        value={instructorData.portfolioUrl}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                      />
                    ) : (
                      <>
                        {instructorData.portfolioUrl ? (
                          <a href={instructorData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                            {instructorData.portfolioUrl}
                          </a>
                        ) : (
                          <p className="text-muted">Not provided</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditMode && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === "settings" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-gear me-2"></i>Account Settings
                </h3>
                {!isEditMode && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit
                  </button>
                )}
              </div>

              <div className="section-body">
                {/* Change Password */}
                <div className="settings-group">
                  <h5 className="mb-3">
                    <i className="bi bi-lock me-2"></i>Change Password
                  </h5>
                  {isEditMode && (
                    <>
                      <div className="form-section">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="form-control"
                          value={instructorData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="form-section">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="form-control"
                          value={instructorData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="form-section">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          value={instructorData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="settings-group">
                  <h5 className="mb-3">
                    <i className="bi bi-shield-check me-2"></i>Two-Factor Authentication
                  </h5>
                  {isEditMode ? (
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="twoFactorAuth"
                        id="twoFactorAuth"
                        checked={instructorData.twoFactorAuth}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="twoFactorAuth">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  ) : (
                    <p>
                      <span className={`badge ${instructorData.twoFactorAuth ? "bg-success" : "bg-secondary"}`}>
                        {instructorData.twoFactorAuth ? "Enabled" : "Disabled"}
                      </span>
                    </p>
                  )}
                </div>

                {/* Notification Preferences */}
                <div className="settings-group">
                  <h5 className="mb-3">
                    <i className="bi bi-bell me-2"></i>Notification Preferences
                  </h5>
                  {isEditMode ? (
                    <>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="emailNotifications"
                          id="emailNotifications"
                          checked={instructorData.emailNotifications}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          <i className="bi bi-envelope me-2"></i>Email Notifications
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="smsNotifications"
                          id="smsNotifications"
                          checked={instructorData.smsNotifications}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          <i className="bi bi-telephone me-2"></i>SMS Notifications
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="appNotifications"
                          id="appNotifications"
                          checked={instructorData.appNotifications}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="appNotifications">
                          <i className="bi bi-app-indicator me-2"></i>App Notifications
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="notification-summary">
                      <p>
                        <i className={`bi ${instructorData.emailNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        Email Notifications: {instructorData.emailNotifications ? "Enabled" : "Disabled"}
                      </p>
                      <p>
                        <i className={`bi ${instructorData.smsNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        SMS Notifications: {instructorData.smsNotifications ? "Enabled" : "Disabled"}
                      </p>
                      <p>
                        <i className={`bi ${instructorData.appNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        App Notifications: {instructorData.appNotifications ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditMode && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teaching Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-lightbulb me-2"></i>Teaching Preferences
                </h3>
                {!isEditMode && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit
                  </button>
                )}
              </div>

              <div className="section-body">
                {/* Subject Expertise */}
                <div className="form-section">
                  <label className="form-label fw-bold">Subject Expertise Tags</label>
                  <small className="text-muted d-block mb-2">Topics you specialize in (comma-separated)</small>
                  {isEditMode ? (
                    <textarea
                      name="subjectExpertise"
                      className="form-control"
                      value={instructorData.subjectExpertise}
                      onChange={handleInputChange}
                      placeholder="e.g., React, JavaScript, Web Development, Node.js, MongoDB"
                      rows="3"
                    ></textarea>
                  ) : (
                    <div className="expertise-display">
                      {instructorData.subjectExpertise ? (
                        <div>
                          {instructorData.subjectExpertise.split(",").map((expertise, index) => (
                            <span key={index} className="badge bg-success me-2 mb-2">
                              {expertise.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No expertise tags added</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Availability Slots */}
                <div className="form-section">
                  <label className="form-label fw-bold">Availability for Live Sessions</label>
                  <small className="text-muted d-block mb-2">Your available time slots for teaching</small>
                  {isEditMode ? (
                    <textarea
                      name="availabilitySlots"
                      className="form-control"
                      value={instructorData.availabilitySlots}
                      onChange={handleInputChange}
                      placeholder="e.g., Monday-Friday 2-5 PM, Saturday 10 AM-12 PM, Sunday 6-8 PM"
                      rows="3"
                    ></textarea>
                  ) : (
                    <div className="availability-display">
                      {instructorData.availabilitySlots ? (
                        <div className="availability-slots">
                          {instructorData.availabilitySlots.split(",").map((slot, index) => (
                            <span key={index} className="slot-badge">
                              <i className="bi bi-calendar-event me-2"></i>{slot.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No availability slots added</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditMode && (
                  <div className="action-buttons">
                    <button
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity & Analytics Tab */}
          {activeTab === "activity" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-graph-up me-2"></i>Activity & Analytics
                </h3>
              </div>

              <div className="section-body">
                {/* Earnings Dashboard */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-wallet2 me-2"></i>Earnings Dashboard
                  </h5>
                  <div className="earnings-grid">
                    <div className="earning-card">
                      <div className="earning-label">Total Earnings</div>
                      <div className="earning-value">₹{earningsData.totalEarnings.toLocaleString()}</div>
                      <div className="earning-detail">All time</div>
                    </div>
                    <div className="earning-card">
                      <div className="earning-label">This Month</div>
                      <div className="earning-value">₹{earningsData.thisMonthEarnings.toLocaleString()}</div>
                      <div className="earning-detail">Current month earnings</div>
                    </div>
                    <div className="earning-card">
                      <div className="earning-label">Total Revenue</div>
                      <div className="earning-value">₹{earningsData.thisMonthRevenue.toLocaleString()}</div>
                      <div className="earning-detail">This month revenue</div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-bar-chart me-2"></i>Teaching Statistics
                  </h5>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{earningsData.totalCourses}</div>
                      <div className="stat-label">Courses Created</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{earningsData.totalStudents}</div>
                      <div className="stat-label">Total Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{earningsData.averageRating.toFixed(1)}</div>
                      <div className="stat-label">Average Rating</div>
                    </div>
                  </div>
                </div>

                {/* Courses Created */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-book me-2"></i>Courses Created
                  </h5>
                  {coursesCreated.length > 0 ? (
                    <div className="row">
                      {coursesCreated.map(course => (
                        <div key={course.id} className="col-md-4 mb-3">
                          <div className="card course-card">
                            <div className="card-body">
                              <h6 className="card-title">{course.title}</h6>
                              <div className="course-stats">
                                <div className="stat">
                                  <i className="bi bi-people me-2 text-primary"></i>
                                  <span>{course.studentsEnrolled} Students</span>
                                </div>
                                <div className="stat">
                                  <i className="bi bi-star-fill me-2 text-warning"></i>
                                  <span>{course.rating.toFixed(1)}</span>
                                </div>
                                <div className="stat">
                                  <i className="bi bi-chat me-2 text-info"></i>
                                  <span>{course.reviews} Reviews</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No courses created yet</p>
                  )}
                </div>

                {/* Student Feedback */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-chat-left-quote me-2"></i>Student Feedback & Ratings
                  </h5>
                  {studentFeedback.length > 0 ? (
                    <div className="feedback-list">
                      {studentFeedback.map(feedback => (
                        <div key={feedback.id} className="feedback-card">
                          <div className="feedback-header">
                            <strong>{feedback.studentName}</strong>
                            <div className="feedback-rating">
                              {[...Array(feedback.rating)].map((_, i) => (
                                <i key={i} className="bi bi-star-fill text-warning"></i>
                              ))}
                            </div>
                          </div>
                          <p className="feedback-text">{feedback.feedback}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No feedback yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
