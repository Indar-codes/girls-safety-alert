import { useEffect, useState } from "react";
import axios from "axios";
import "./MyAlerts.css";

function MyAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://girls-safety-alert.onrender.com/my-alerts",
        { headers: { Authorization: "Bearer " + token } }
      );
      setAlerts(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load alerts.");
    }
  };

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://girls-safety-alert.onrender.com/alert/" + id + "/resolve",
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Alert Resolved");
      fetchAlerts();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to resolve alert.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "https://girls-safety-alert.onrender.com/alert/" + id,
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Alert Deleted Successfully");
      fetchAlerts();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete alert.");
    }
  };

  return (
    <div className="alerts-shell">
      <div className="alerts-card">
        <h1 className="alerts-heading">My Alerts</h1>
        <p className="alerts-subtext">Every SOS you've sent, with its status and location</p>
        {alerts.length === 0 ? (
          <p className="alerts-empty">No Alerts Found</p>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert._id} className="alert-row">
                <div className="alert-row-top">
                  <h3 className="alert-message">{alert.message}</h3>
                  <span className={"alert-status-badge " +
                    (alert.status === "Pending" ? "status-pending" : "status-resolved")}>
                    {alert.status}
                  </span>
                </div>
                <div className="alert-detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{alert.location}</span>
                </div>
                <div className="alert-detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                <div className="alert-actions">
                  {alert.status === "Pending" && (
                    <button className="alert-btn alert-btn-resolve" onClick={() => handleResolve(alert._id)}>
                      Resolve Alert
                    </button>
                  )}
                  <button className="alert-btn alert-btn-delete" onClick={() => handleDelete(alert._id)}>
                    Delete Alert
                  </button>
                  <button className="alert-btn alert-btn-map"
                    onClick={() => window.open(
                      "https://www.google.com/maps?q=" + encodeURIComponent(alert.location),
                      "_blank",
                      "noopener,noreferrer"
                    )}>
                    View on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAlerts;
