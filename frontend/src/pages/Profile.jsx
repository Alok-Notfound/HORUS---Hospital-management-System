import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Building2,
  Save,
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";
import "../styles/profile.css";

const defaultProfile = {
  name: "Administrator",
  email: "admin@horus.health",
  phone: "+91 98765 43210",
  department: "Hospital Operations",
  role: "System Administrator",
};

const PROFILE_STORAGE_KEY = "horus-profile";
const PASSWORD_STORAGE_KEY = "horus-profile-password";

function getStoredProfile() {
  try {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!storedProfile) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(storedProfile) };
  } catch {
    return defaultProfile;
  }
}

function Profile() {
  const [profile, setProfile] = useState(getStoredProfile);
  const [savedProfile, setSavedProfile] = useState(getStoredProfile);

  const [avatar, setAvatar] = useState(() => {
    try {
      return localStorage.getItem("horus-profile-avatar");
    } catch {
      return null;
    }
  });

  const [savedAvatar, setSavedAvatar] = useState(() => {
    try {
      return localStorage.getItem("horus-profile-avatar");
    } catch {
      return null;
    }
  });

  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Password Management State
  const [hasPassword, setHasPassword] = useState(() => {
    try {
      return !!localStorage.getItem(PASSWORD_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
    setSaved(false);
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function handleSave(event) {
    event.preventDefault();
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      if (avatar) {
        localStorage.setItem("horus-profile-avatar", avatar);
      } else {
        localStorage.removeItem("horus-profile-avatar");
      }
      setSavedProfile(profile);
      setSavedAvatar(avatar);
      setSaved(true); window.dispatchEvent(new Event("horus-profile-updated"));
      setTimeout(() => setSaved(false), 4000);
    } catch {
      alert("Unable to save profile. The selected image may be too large.");
    }
  }

  function handleCancel() {
    setProfile(savedProfile);
    setAvatar(savedAvatar);
    setSaved(false);
  }

  function removeAvatar() {
    setAvatar(null);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; localStorage.removeItem("horus-profile-avatar"); window.dispatchEvent(new Event("horus-profile-updated"));
    }
  }

  // Password Change Handler
  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const storedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY);

    // If password exists, verify current password
    if (hasPassword && storedPassword) {
      if (!currentPassword) {
        setPasswordError("Please enter your current password.");
        return;
      }
      if (currentPassword !== storedPassword) {
        setPasswordError("The current password you entered is incorrect.");
        return;
      }
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    // Save new password
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
      setHasPassword(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(
        hasPassword
          ? "Password updated successfully!"
          : "Password created and set successfully! Future changes will require your current password."
      );
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch {
      setPasswordError("Failed to save password. Please try again.");
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content profile-page">
          <section className="profile-heading">
            <div>
              <span>ACCOUNT / PROFILE</span>
              <h1>Administrator Profile</h1>
              <p>
                Manage your personal information, account role, and security credentials.
              </p>
            </div>

            {saved && (
              <div className="profile-saved-message">
                <Check size={14} />
                Profile changes saved successfully
              </div>
            )}
          </section>

          <div className="profile-layout">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* PERSONAL INFORMATION FORM */}
              <form onSubmit={handleSave}>
                <section className="profile-card profile-identity">
                  <div className="profile-card-heading">
                    <div>
                      <span>PROFILE IDENTITY</span>
                      <h2>Personal Information</h2>
                    </div>
                  </div>

                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      {avatar ? (
                        <img src={avatar} alt="Profile avatar" />
                      ) : (
                        <UserRound size={42} />
                      )}

                      <button
                        type="button"
                        className="avatar-camera"
                        onClick={() => fileInputRef.current?.click()}
                        title="Change avatar"
                      >
                        <Camera size={15} />
                      </button>
                    </div>

                    <div className="avatar-details">
                      <strong>{profile.name}</strong>
                      <span>{profile.role}</span>

                      <div className="avatar-actions">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Avatar
                        </button>

                        {avatar && (
                          <button
                            type="button"
                            className="remove-avatar"
                            onClick={removeAvatar}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <small>JPG, PNG or WEBP · Maximum 5 MB</small>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div className="profile-form-grid">
                    <div className="profile-field">
                      <label htmlFor="profile-name">Full Name</label>
                      <div className="profile-input">
                        <UserRound size={15} />
                        <input
                          id="profile-name"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          type="text"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    <div className="profile-field">
                      <label htmlFor="profile-email">Email Address</label>
                      <div className="profile-input">
                        <Mail size={15} />
                        <input
                          id="profile-email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          type="email"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="profile-field">
                      <label htmlFor="profile-phone">Phone Number</label>
                      <div className="profile-input">
                        <Phone size={15} />
                        <input
                          id="profile-phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="profile-field">
                      <label htmlFor="profile-department">Department</label>
                      <div className="profile-input">
                        <Building2 size={15} />
                        <input
                          id="profile-department"
                          name="department"
                          value={profile.department}
                          onChange={handleChange}
                          type="text"
                          placeholder="Enter department"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "0 18px 16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      type="button"
                      className="profile-cancel"
                      onClick={handleCancel}
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button type="submit" className="profile-save">
                      <Save size={14} /> Save Profile
                    </button>
                  </div>
                </section>
              </form>

              {/* CHANGE PASSWORD CARD */}
              <section className="profile-card">
                <div className="profile-card-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <span>SECURITY & AUTHENTICATION</span>
                    <h2>Change Password</h2>
                  </div>

                  <span style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: hasPassword ? "#e7f6ec" : "#fff1df",
                    color: hasPassword ? "#18733c" : "#a65100",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <KeyRound size={11} />
                    {hasPassword ? "Password Protected" : "First Time Setup (No current password required)"}
                  </span>
                </div>

                <form onSubmit={handlePasswordSubmit} style={{ padding: "20px 18px" }}>
                  {passwordError && (
                    <div style={{
                      marginBottom: "16px",
                      padding: "10px 14px",
                      background: "#ffebe8",
                      border: "1px solid #ffc9c2",
                      borderRadius: "6px",
                      color: "#ba1a1a",
                      fontSize: "11px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <AlertCircle size={15} />
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div style={{
                      marginBottom: "16px",
                      padding: "10px 14px",
                      background: "#e7f6ec",
                      border: "1px solid #c8e6d2",
                      borderRadius: "6px",
                      color: "#18733c",
                      fontSize: "11px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <CheckCircle2 size={15} />
                      {passwordSuccess}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: hasPassword ? "1fr 1fr 1fr" : "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                    {/* ONLY SHOW CURRENT PASSWORD IF ALREADY SET */}
                    {hasPassword && (
                      <div className="profile-field">
                        <label htmlFor="current-pass">Current Password</label>
                        <div className="profile-input" style={{ position: "relative" }}>
                          <Lock size={14} />
                          <input
                            id="current-pass"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={{ background: "none", border: "none", color: "#757684", cursor: "pointer", padding: 0 }}
                          >
                            {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="profile-field">
                      <label htmlFor="new-pass">New Password</label>
                      <div className="profile-input" style={{ position: "relative" }}>
                        <KeyRound size={14} />
                        <input
                          id="new-pass"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{ background: "none", border: "none", color: "#757684", cursor: "pointer", padding: 0 }}
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label htmlFor="confirm-pass">Confirm New Password</label>
                      <div className="profile-input" style={{ position: "relative" }}>
                        <KeyRound size={14} />
                        <input
                          id="confirm-pass"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ background: "none", border: "none", color: "#757684", cursor: "pointer", padding: 0 }}
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                    <small style={{ color: "#757684", fontSize: "10px" }}>
                      {hasPassword
                        ? "Requires your current password to authorize updates."
                        : "First-time setup: No current password needed. Set it once and future changes will be protected."}
                    </small>

                    <button
                      type="submit"
                      style={{
                        height: "36px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0 16px",
                        borderRadius: "5px",
                        border: "none",
                        background: "#00288e",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      <Lock size={13} />
                      {hasPassword ? "Update Password" : "Set Password"}
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <aside className="profile-side-column">
              <section className="profile-card account-card">
                <div className="profile-card-heading">
                  <div>
                    <span>ACCOUNT INFORMATION</span>
                    <h2>Access &amp; Role</h2>
                  </div>
                </div>

                <div className="account-row">
                  <div className="account-icon">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <span>Account Role</span>
                    <strong>{profile.role}</strong>
                  </div>
                </div>

                <div className="account-row">
                  <div className="account-icon">
                    <Building2 size={17} />
                  </div>

                  <div>
                    <span>Department</span>
                    <strong>{profile.department}</strong>
                  </div>
                </div>

                <div className="account-status">
                  <i />
                  <span>Account Active</span>
                </div>
              </section>

              <section className="profile-card security-card">
                <div className="security-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <strong>Administrator Access</strong>
                  <p>
                    Your account has full authorization to manage hospital operations, patient admissions, pharmacy inventory, and system security credentials.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
