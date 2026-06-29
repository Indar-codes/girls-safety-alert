// Dashboard.jsx
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./Dashboard.css";

const EMERGENCY_SERVICES = [
    {
        name: "National Emergency",
        number: "112",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
        )
    },
    {
        name: "Police",
        number: "100",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z"/>
            </svg>
        )
    },
    {
        name: "Ambulance",
        number: "108",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
            </svg>
        )
    },
    {
        name: "Fire Brigade",
        number: "101",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c2 3-1 4-1 7a3 3 0 003 3c2 0 3-1.5 3-3.5 2 2 3 5 3 7.5a6 6 0 01-12 0c0-4 2-6 4-9 0 0-1-3 0-5z"/>
            </svg>
        )
    },
    {
        name: "Women Helpline",
        number: "1091",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M12 12v7M9 16h6"/>
            </svg>
        )
    },
    {
        name: "Child Helpline",
        number: "1098",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0114 0v2"/>
            </svg>
        )
    }
];

const SAFETY_TIPS = [
    {
        text: "Share your live location with trusted contacts.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
        )
    },
    {
        text: "Keep your phone charged before travelling.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 7h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"/>
                <path d="M22 10v4"/><path d="M11 9l-2 3h3l-2 3"/>
            </svg>
        )
    },
    {
        text: "Save emergency contacts in the application.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>
            </svg>
        )
    },
    {
        text: "Stay in well-lit public places whenever possible.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
        )
    },
    {
        text: "Use the SOS button only during real emergencies.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/>
                <path d="M12 8v4M12 16h.01"/>
            </svg>
        )
    },
    {
        text: "Contact Police (112/100) immediately if you feel unsafe.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
        )
    }
];

function Dashboard() {
    const[name, setName] = useState("");
    const[isEmergency,setIsEmergency] = useState(false);
    const[showResolve,setShowResolve] = useState(false);
    const [alertCount,setAlertCount] = useState(0);
    const [contactCount,setContactCount] = useState(0);
    const navigate = useNavigate();

    const handleLogout = ()=> {
        localStorage.removeItem("token");
        navigate("/login");
    };
    const handleResolve = () => {
        setIsEmergency(false);
        setShowResolve(false);

        alert("Emergency Resolved");
    };
    const handleSOS = async () => {
        
        try {
            const token = localStorage.getItem("token");
            const position = await new
            Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const location = position.coords.latitude + "," + position.coords.longitude;

            console.log("TOKEN =", token);

            const res = await axios.post(
                "https://girls-safety-alert.onrender.com/sos",
                {location: location},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );
            setIsEmergency(true);
            setShowResolve(true);
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
        "https://girls-safety-alert.onrender.com/profile",
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
     useEffect(()=> {
        fetchProfile();
        fetchAlerts();
     },[]);
     const fetchProfile = async() => {
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
            setName(res.data.name);
            setContactCount(
                res.data.emergencyContacts.length
            );
        }catch(error){
            console.log(error);
        }
     };
     const fetchAlerts = async() => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "https://girls-safety-alert.onrender.com/my-alerts",
                {
                    headers: {
                        Authorization: "Bearee " + token
                    }
                }
            );
            setAlertCount(res.data.length);
        } catch(error) {
            console.log(error);
        }
     };

    return (
        <div className="dashboard-shell">
            <div className="dashboard-card">

                <header className="dashboard-header">
                    <div className="brand">
                        <span className="brand-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z"/>
                            </svg>
                        </span>
                        <span className="brand-name">Girls Safety Alert</span>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </header>

                <p className="greeting">Welcome back, <strong>{name}</strong></p>

                <div className={`status-badge ${isEmergency ? "status-alert" : "status-safe"}`}>
                    <span className="status-dot" />
                    {isEmergency ? "Emergency active" : "You're safe"}
                </div>

                <div className="sos-wrap">
                    {isEmergency && <span className="sos-ring sos-ring-1" aria-hidden="true" />}
                    {isEmergency && <span className="sos-ring sos-ring-2" aria-hidden="true" />}
                    <button
                        className={`sos-button ${isEmergency ? "sos-button-active" : ""}`}
                        onClick={handleSOS}
                    >
                        <span className="sos-label">SOS</span>
                        <span className="sos-sub">Tap to alert</span>
                    </button>
                </div>

                {showResolve && (
                    <button className="resolve-button" onClick={handleResolve}>
                        ✅ Resolve Emergency
                    </button>
                )}

                {/* --- NEW: Emergency Services section --- */}
                <section className="emergency-section">
                    <h2 className="dashboard-section-title">
                        <span className="section-title-icon" aria-hidden="true">🚨</span>
                        Emergency Services
                    </h2>
                    <div className="emergency-grid">
                        {EMERGENCY_SERVICES.map((service) => (
                            <div className="emergency-card" key={service.name}>
                                <div className="emergency-icon-wrap">{service.icon}</div>
                                <span className="emergency-name">{service.name}</span>
                                <span className="emergency-number">{service.number}</span>
                                <a
                                    className="emergency-call-btn"
                                    href={`tel:${service.number}`}
                                    onClick={() => { window.location.href = `tel:${service.number}`; }}
                                >
                                    Call
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- NEW: Safety Tips section --- */}
                <section className="safety-section">
                    <h2 className="dashboard-section-title">
                        <span className="section-title-icon" aria-hidden="true">🛡</span>
                        Safety Tips
                    </h2>
                    <div className="safety-tips-list">
                        {SAFETY_TIPS.map((tip, idx) => (
                            <div className="safety-tip-row" key={idx}>
                                <span className="safety-tip-icon">{tip.icon}</span>
                                <span className="safety-tip-text">{tip.text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-value">{alertCount}</span>
                        <span className="stat-label">Total alerts</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{contactCount}</span>
                        <span className="stat-label">Emergency contacts</span>
                    </div>
                </div>

                <div className="actions-grid">
                    <button className="action-button" onClick={()=> navigate("/my-alerts")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                        My Alerts
                    </button>

                    <button className="action-button" onClick={()=> navigate("/add-contact")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M19 8v6M22 11h-6"/>
                        </svg>
                        Add Contact
                    </button>

                    <button className="action-button" onClick={()=> navigate("/view-contacts")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                        View Contacts
                    </button>

                    <button className="action-button" onClick={() => navigate("/profile")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M6.5 19a5.5 5.5 0 0111 0"/>
                        </svg>
                        My Profile
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;