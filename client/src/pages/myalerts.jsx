import { useEffect, useState } from "react";
import axios from "axios";

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

  

  return (
    <div>
      <h1>My Alerts</h1>

      {alerts.length === 0 ? (
        <p>No Alerts Found</p>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px"
            }}
          >
            <h3>{alert.message}</h3>
            <p>Location: {alert.location}</p>
            <p>
              Time: {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyAlerts;