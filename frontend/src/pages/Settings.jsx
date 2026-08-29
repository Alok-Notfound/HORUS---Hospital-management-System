import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  Monitor,
  Database,
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";
import "../styles/settings.css";

function Settings() {
  const [theme, setTheme] = useState(
    localStorage.getItem("horus-theme") || "light"
  );

  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("horus-theme", theme);
  }, [theme]);

  function handleThemeChange(value) {
    setTheme(value);
  }

  function handleSave() {
    localStorage.setItem("horus-notifications", notifications);
    localStorage.setItem("horus-auto-refresh", autoRefresh);
    localStorage.setItem("horus-refresh-interval", refreshInterval);
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content settings-page">
          <section className="settings-heading">
            <div>
              <span className="page-kicker">SYSTEM / SETTINGS</span>

              <h1>Settings</h1>

              <p>
                Manage your HORUS interface and operational preferences.
              </p>
            </div>
          </section>

          <div className="settings-layout">
            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Monitor size={19} />
                </div>

                <div>
                  <span>APPEARANCE</span>
                  <h2>Display Preferences</h2>
                  <p>
                    Choose how the HORUS interface should appear.
                  </p>
                </div>
              </div>

              <div className="theme-options">
                <button
                  type="button"
                  className={`theme-option ${
                    theme === "light" ? "selected" : ""
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="theme-icon">
                    <Sun size={20} />
                  </div>

                  <div>
                    <strong>Light Mode</strong>
                    <span>Use the standard light interface.</span>
                  </div>

                  {theme === "light" && (
                    <Check size={18} className="theme-check" />
                  )}
                </button>

                <button
                  type="button"
                  className={`theme-option ${
                    theme === "dark" ? "selected" : ""
                  }`}
                  onClick={() => handleThemeChange("dark")}
                >
                  <div className="theme-icon">
                    <Moon size={20} />
                  </div>

                  <div>
                    <strong>Dark Mode</strong>
                    <span>Reduce brightness for low-light environments.</span>
                  </div>

                  {theme === "dark" && (
                    <Check size={18} className="theme-check" />
                  )}
                </button>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <RefreshCw size={19} />
                </div>

                <div>
                  <span>DATA REFRESH</span>
                  <h2>Operational Data</h2>
                  <p>
                    Control how frequently dashboard data refreshes.
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <strong>Automatic Refresh</strong>
                  <span>
                    Automatically refresh operational metrics.
                  </span>
                </div>

                <button
                  type="button"
                  className={`toggle ${
                    autoRefresh ? "on" : ""
                  }`}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  aria-label="Toggle automatic refresh"
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <strong>Refresh Interval</strong>
                  <span>
                    Choose how often data should be refreshed.
                  </span>
                </div>

                <select
                  value={refreshInterval}
                  onChange={(e) =>
                    setRefreshInterval(e.target.value)
                  }
                  disabled={!autoRefresh}
                >
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Bell size={19} />
                </div>

                <div>
                  <span>NOTIFICATIONS</span>
                  <h2>Alert Preferences</h2>
                  <p>
                    Control operational alerts and system notifications.
                  </p>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <strong>Operational Alerts</strong>
                  <span>
                    Receive alerts for critical operational events.
                  </span>
                </div>

                <button
                  type="button"
                  className={`toggle ${
                    notifications ? "on" : ""
                  }`}
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  aria-label="Toggle notifications"
                >
                  <span />
                </button>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <span>SECURITY</span>
                  <h2>System Security</h2>
                  <p>
                    Information about your current administrator access.
                  </p>
                </div>
              </div>

              <div className="security-status">
                <div className="security-status-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <strong>Administrator Access Active</strong>
                  <span>
                    Your account currently has full access to
                    hospital operations modules.
                  </span>
                </div>

                <span className="active-badge">
                  Active
                </span>
              </div>
            </section>

            <section className="settings-card system-card">
              <div className="settings-card-heading">
                <div className="settings-heading-icon">
                  <Database size={19} />
                </div>

                <div>
                  <span>SYSTEM</span>
                  <h2>HORUS Configuration</h2>
                  <p>
                    Current system configuration and interface status.
                  </p>
                </div>
              </div>

              <div className="system-grid">
                <div>
                  <span>ENGINE</span>
                  <strong>Zero-Loss Reconciliation</strong>
                </div>

                <div>
                  <span>STATUS</span>
                  <strong className="system-active">
                    Operational
                  </strong>
                </div>

                <div>
                  <span>INTERFACE</span>
                  <strong>HORUS Operations</strong>
                </div>

                <div>
                  <span>VERSION</span>
                  <strong>1.0.0</strong>
                </div>
              </div>
            </section>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="settings-save"
              onClick={handleSave}
            >
              <Check size={16} />
              Save Preferences
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;