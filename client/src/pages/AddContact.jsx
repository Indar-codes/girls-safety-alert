import { useState, useEffect } from "react";
import axios from "axios";
import "./AddContact.css";

function AddContact() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchProfile();
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

      setUserId(res.data._id);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAddContact = async () => {
    try {
      console.log("User ID =",userId);
      console.log("Adding Contact =",{name,phone});
      await axios.put(
        `https://girls-safety-alert.onrender.com/user/${userId}/emergency-contact`,
        {
          name,
          phone
        }
      );
      console.log("Contact Added Successfully")
      alert("Contact Added Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contact-shell">
      <div className="contact-card">

        <div className="contact-brand">
          <span className="contact-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M19 8v6M22 11h-6"/>
            </svg>
          </span>
        </div>

        <h2 className="contact-heading">Add Emergency Contact</h2>
        <p className="contact-subtext">They'll be notified if you ever send an SOS alert</p>

        <div className="contact-field-group">
          <label htmlFor="contactName">Name</label>
          <input
            id="contactName"
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="contact-field-group">
          <label htmlFor="contactPhone">Phone</label>
          <input
            id="contactPhone"
            type="text"
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button className="contact-submit-button" onClick={handleAddContact}>
          Add Contact
        </button>

      </div>
    </div>
  );
}

export default AddContact;