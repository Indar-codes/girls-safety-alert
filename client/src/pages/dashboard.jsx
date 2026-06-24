import axios from "axios";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const handleSOS = async () => {
        try {
            const token = localStorage.getItem("token");

            console.log("TOKEN =", token);

            const res = await axios.post(
                "http://localhost:5000/sos",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            alert("SOS Alert Sent");
            console.log(res.data);

        } catch (error) {

            console.log("FULL ERROR =", error);
            console.log("RESPONSE =", error.response);
            console.log("MESSAGE =", error.message);

            alert(error.message);
        }
    };
    const handleProfile = async () => {
     try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
        "http://localhost:5000/profile",
        {
            headers: {
            Authorization: "Bearer " + token
            }
        }
        );

        console.log(res.data);
        alert("Profile Loaded");
     } catch (error) {
        console.log(error);
     }
     };
     
   

    return (
        <div>
            <h1>Dashboard</h1>

            <button
                onClick={handleSOS}
                style={{
                    background: "red",
                    color: "white",
                    padding: "20px",
                    fontSize: "20px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer"
                }}
            >
                ⚠️ SOS ALERT
            </button>
            <button onClick={handleProfile}>
                Get Profile
            </button>
            <br /><br />

            <button onClick={()=> navigate("/my-alerts")}>
                My Alerts
            </button>
            <br /><br />

            <button onClick={()=> navigate("/add-contact")}>
                Add Contact
            </button>
            <br /><br />

            <button onClick={()=> navigate("/view-contact")}>
                View-Contacts
            </button>
        </div>
    );
}

export default Dashboard;