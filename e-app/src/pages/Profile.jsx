import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("information");
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    profilePicture: null,
    profilePicturePreview: "/default-profile.png",
    preferredLanguage: "English",
    interests: "",
    darkMode: false,
    fontSize: "16",
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState(profileData);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Simulated enrolled courses and certificates
  const [enrolledCourses] = useState([
    { id: 1, name: "React Basics", progress: 75, status: "in-progress" },
    { id: 2, name: "JavaScript Advanced", progress: 100, status: "completed" },
    { id: 3, name: "Web Design", progress: 50, status: "in-progress" },
  ]);

  const [certificates] = useState([
    { id: 1, courseName: "JavaScript Advanced", completedDate: "2026-01-15" },
    { id: 2, courseName: "HTML & CSS Basics", completedDate: "2025-12-20" },
  ]);

  useEffect(() => {
    const savedProfile = localStorage.getItem(`PROFILE_${user.id}`);
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfileData(data);
      setOriginalData(data);
    }
  }, [user.id]);

  useEffect(() => {
    if (profileData.darkMode) {
      document.documentElement.style.backgroundColor = "#1a1a1a";
      document.documentElement.style.color = "#ffffff";
    } else {
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#000000";
    }
  }, [profileData.darkMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
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
        setProfileData(prev => ({
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
      // Validation
      if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return;
      }

      if (profileData.dateOfBirth && new Date(profileData.dateOfBirth) > new Date()) {
        setMessage({ type: "error", text: "Date of birth cannot be in the future" });
        return;
      }

      // Save profile
      localStorage.setItem(`PROFILE_${user.id}`, JSON.stringify(profileData));

      // Update user profile in auth context
      if (updateUserProfile) {
        updateUserProfile(profileData);
      }

      setOriginalData(profileData);
      setIsEditMode(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditMode(false);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="profile-container" style={{ fontSize: `${profileData.fontSize}px` }}>
      {/* Header */}
      <div className="profile-header">
        <div className="back-button">
          <a href="/dashboard/student" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </a>
        </div>
        <h1 className="mb-0">
          <i className="bi bi-person-circle me-2"></i>My Profile
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
        {/* Sidebar with Tabs */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src={profileData.profilePicturePreview} alt="Profile" />
            <div className="avatar-overlay">
              <span className="badge bg-primary">{user.role}</span>
            </div>
          </div>
          <div className="user-info text-center mb-4">
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-muted mb-2">{user.email}</p>
            <span className="badge bg-info">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-tab ${activeTab === "information" ? "active" : ""}`}
              onClick={() => setActiveTab("information")}
            >
              <i className="bi bi-person me-2"></i>Profile Information
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
              <i className="bi bi-sliders me-2"></i>Learning Preferences
            </button>
            <button
              className={`nav-tab ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <i className="bi bi-graph-up me-2"></i>Activity
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
                {/* Profile Picture Upload */}
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
                          src={profileData.profilePicturePreview}
                          alt="Preview"
                          className="preview-img"
                        />
                      </>
                    ) : (
                      <img
                        src={profileData.profilePicturePreview}
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

                {/* Email (Read-only) */}
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
                      value={user.email || "Not provided"}
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
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <input
                      type="tel"
                      className="form-control"
                      value={profileData.phoneNumber || "Not provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Date of Birth */}
                <div className="form-section">
                  <label className="form-label fw-bold">Date of Birth</label>
                  {isEditMode ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.dateOfBirth || "Not provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Gender */}
                <div className="form-section">
                  <label className="form-label fw-bold">Gender</label>
                  {isEditMode ? (
                    <select
                      name="gender"
                      className="form-select"
                      value={profileData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select (optional)</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.gender || "Not provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Address */}
                <div className="form-section">
                  <label className="form-label fw-bold">Address</label>
                  {isEditMode ? (
                    <textarea
                      name="address"
                      className="form-control"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      rows="3"
                    ></textarea>
                  ) : (
                    <textarea
                      className="form-control"
                      value={profileData.address || "Not provided"}
                      disabled
                      rows="3"
                    ></textarea>
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
                          value={profileData.currentPassword}
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
                          value={profileData.newPassword}
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
                          value={profileData.confirmPassword}
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
                        checked={profileData.twoFactorAuth}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="twoFactorAuth">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  ) : (
                    <p>
                      <span className={`badge ${profileData.twoFactorAuth ? "bg-success" : "bg-secondary"}`}>
                        {profileData.twoFactorAuth ? "Enabled" : "Disabled"}
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
                          checked={profileData.emailNotifications}
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
                          checked={profileData.smsNotifications}
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
                          checked={profileData.appNotifications}
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
                        <i className={`bi ${profileData.emailNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        Email Notifications: {profileData.emailNotifications ? "Enabled" : "Disabled"}
                      </p>
                      <p>
                        <i className={`bi ${profileData.smsNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        SMS Notifications: {profileData.smsNotifications ? "Enabled" : "Disabled"}
                      </p>
                      <p>
                        <i className={`bi ${profileData.appNotifications ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"} me-2`}></i>
                        App Notifications: {profileData.appNotifications ? "Enabled" : "Disabled"}
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

          {/* Learning Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-sliders me-2"></i>Learning Preferences
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
                {/* Preferred Language */}
                <div className="form-section">
                  <label className="form-label fw-bold">Preferred Language</label>
                  {isEditMode ? (
                    <select
                      name="preferredLanguage"
                      className="form-select"
                      value={profileData.preferredLanguage}
                      onChange={handleInputChange}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.preferredLanguage}
                      disabled
                    />
                  )}
                </div>

                {/* Interests/Skills Tags */}
                <div className="form-section">
                  <label className="form-label fw-bold">Interests/Skills</label>
                  {isEditMode ? (
                    <textarea
                      name="interests"
                      className="form-control"
                      value={profileData.interests}
                      onChange={handleInputChange}
                      placeholder="Enter your interests and skills (comma-separated)"
                      rows="3"
                    ></textarea>
                  ) : (
                    <div className="interests-display">
                      {profileData.interests ? (
                        <div>
                          {profileData.interests.split(",").map((interest, index) => (
                            <span key={index} className="badge bg-info me-2 mb-2">
                              {interest.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No interests added</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Accessibility Options */}
                <div className="form-section">
                  <h5 className="mb-3">
                    <i className="bi bi-palette me-2"></i>Accessibility Options
                  </h5>

                  {/* Dark Mode */}
                  <div className="accessibility-option mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label mb-0">
                        <i className="bi bi-moon-stars me-2"></i>Dark Mode
                      </label>
                      {isEditMode ? (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="darkMode"
                            id="darkMode"
                            checked={profileData.darkMode}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="darkMode"></label>
                        </div>
                      ) : (
                        <span className={`badge ${profileData.darkMode ? "bg-dark" : "bg-light"}`}>
                          {profileData.darkMode ? "ON" : "OFF"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="accessibility-option">
                    <label className="form-label">
                      <i className="bi bi-type me-2"></i>Font Size
                    </label>
                    {isEditMode ? (
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="range"
                          name="fontSize"
                          className="form-range"
                          min="12"
                          max="24"
                          value={profileData.fontSize}
                          onChange={handleInputChange}
                        />
                        <span className="badge bg-secondary">{profileData.fontSize}px</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={`${profileData.fontSize}px`}
                        disabled
                      />
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

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>
                  <i className="bi bi-graph-up me-2"></i>Activity & Progress
                </h3>
              </div>

              <div className="section-body">
                {/* Enrolled Courses */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-collection me-2"></i>Enrolled Courses
                  </h5>
                  {enrolledCourses.length > 0 ? (
                    <div className="row">
                      {enrolledCourses.map(course => (
                        <div key={course.id} className="col-md-6 mb-3">
                          <div className="card course-card">
                            <div className="card-body">
                              <h6 className="card-title">{course.name}</h6>
                              <div className="progress mb-2">
                                <div
                                  className={`progress-bar ${course.status === "completed" ? "bg-success" : "bg-primary"}`}
                                  style={{ width: `${course.progress}%` }}
                                  role="progressbar"
                                  aria-valuenow={course.progress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <p className="mb-0 text-muted">
                                <small>{course.progress}% Complete</small>
                              </p>
                              <span className={`badge ${course.status === "completed" ? "bg-success" : "bg-info"}`}>
                                {course.status === "completed" ? "Completed" : "In Progress"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No enrolled courses yet</p>
                  )}
                </div>

                {/* Certificates Earned */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-award me-2"></i>Certificates Earned
                  </h5>
                  {certificates.length > 0 ? (
                    <div className="row">
                      {certificates.map(cert => (
                        <div key={cert.id} className="col-md-6 mb-3">
                          <div className="card certificate-card">
                            <div className="card-body text-center">
                              <i className="bi bi-award display-4 text-warning"></i>
                              <h6 className="card-title mt-2">{cert.courseName}</h6>
                              <p className="text-muted mb-2">
                                <small>Completed: {new Date(cert.completedDate).toLocaleDateString()}</small>
                              </p>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-download me-1"></i>Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No certificates earned yet</p>
                  )}
                </div>

                {/* Progress Summary */}
                <div className="activity-section">
                  <h5 className="mb-3">
                    <i className="bi bi-bar-chart me-2"></i>Progress Summary
                  </h5>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{enrolledCourses.length}</div>
                      <div className="stat-label">Enrolled Courses</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{enrolledCourses.filter(c => c.status === "completed").length}</div>
                      <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{certificates.length}</div>
                      <div className="stat-label">Certificates</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length) || 0}%
                      </div>
                      <div className="stat-label">Avg Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
