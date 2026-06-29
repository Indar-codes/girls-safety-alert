// Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {

    const [user, setUser] = useState({});
    const[editName, setEditName] = useState("");
    const[editPhone,setEditPhone] = useState("");
    const[alertCount,setAlertCount] = useState(0);
    const[lastAlert,setLastAlert] = useState(null);


    useEffect(() => {
        fetchProfile();
        fetchAlerts();

    }, []);

    const fetchProfile = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://girls-safety-alert.onrender.com/profile",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            setUser(res.data);
            setEditName(res.data.name);
            setEditPhone(res.data.phone);

        } catch (error) {
            console.log(error);
        }
    };
    const fetchAlerts = async() => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "https://girls-safety-alert.onrender.com/my-alerts",
                {
                    headers: {
                        Authorization:"Bearer " + token
                    }
                }
            );
            setAlertCount(res.data.length);
            if(res.data.length>0){
                setLastAlert(res.data[0]);
                console.log(res.data[0]);
            }
        } catch(error) {
        console.log(error);
        }
    };
    const handleUpdate = async() => {
        console.log("Save button clicked");
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://girls-safety-alert.onrender.com/user/${user._id}`,
                {
                    name: editName,
                    phone: editPhone
                },
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );
            alert("Profile Updated Successfully");
            fetchProfile();
        }catch(error) {
            console.log(error);
        }
    };

    const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <div className="profile-shell">
            <div className="profile-card">

                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>
                    <div>
                        <h1 className="profile-heading">User Profile</h1>
                        <p className="profile-subtext">{user.name} &middot; {user.phone}</p>
                    </div>
                </div>

                <div className="profile-stats-row">
                    <div className="profile-stat-card">
                        <span className="profile-stat-value">{user.emergencyContacts?.length || 0}</span>
                        <span className="profile-stat-label">Emergency contacts</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="profile-stat-value">{alertCount}</span>
                        <span className="profile-stat-label">Total alerts</span>
                    </div>
                </div>

                <div className="profile-section">
                    <h2 className="profile-section-title">Edit details</h2>

                    <div className="profile-field-group">
                        <label htmlFor="editName">Name</label>
                        <input
                            id="editName"
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Edit Name"
                        />
                    </div>

                    <div className="profile-field-group">
                        <label htmlFor="editPhone">Phone</label>
                        <input
                            id="editPhone"
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Edit Phone"
                        />
                    </div>

                    <button className="profile-save-button" onClick={handleUpdate}>
                        Save Changes
                    </button>
                </div>

                {lastAlert && (
                    <div className="profile-section">
                        <h2 className="profile-section-title">Last alert</h2>
                        <div className="last-alert-card">
                            <div className="last-alert-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>{lastAlert.location}</span>
                            </div>
                            <div className="last-alert-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2"/>
                                </svg>
                                <span>{new Date(lastAlert.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Profile;