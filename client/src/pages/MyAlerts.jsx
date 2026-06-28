import { useEffect, useState } from "react";
import axios from "axios";
import "./MyAlerts.css";

function MyAlerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(()=>{
    fetchAlerts();
  })

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/my-alerts",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setAlerts(res.data);

    } catch (error) {
      console.log(error);
      alert("Failed to load alerts");
    }
  };
  const handleResolve = async (id) => {
    console.log("Resolved Clicked",id);
    try{
      await axios.put(`http://localhost:5000/alert/${id}/resolve`);
      console.log("API SUccess");
      alert("Alert Resolved");
      fetchAlerts();
    }catch(error) {
      console.log(error);
      console.log(error.response);
      alert(error.message);
    }
  };
  const handleDelete =async(id) => {
    console.log("Delete API hit");
    
    const confirmDelete =window.confirm("Are you sure want to delete this alert");
    if(!confirmDelete) return;
    try{
      await axios.delete(`http://localhost:5000/alert/${id}`);
      alert("Alert Deleted Successfuly");
      fetchAlerts();
    }catch(error) {
      console.log(error);
      alert(error.message);
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
            {alerts.map((alert, index) => (
              <div key={index} className="alert-row">

                <div className="alert-row-top">
                  <h3 className="alert-message">{alert.message}</h3>
                  <span className={`alert-status-badge ${alert.status === "Pending" ? "status-pending" : "status-resolved"}`}>
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
                  <button className="alert-btn alert-btn-map" onClick={() => window.open('https://www.google.com/maps?q=${alert.location}', "_blank")}>
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