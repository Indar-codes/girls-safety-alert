import { useState } from "react";
import axios from "axios";
import "./AddContact.css";

function AddContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddContact = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://girls-safety-alert.onrender.com/emergency-contact",
        { name, phone },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Contact Added Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to add contact.");
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
          <input id="contactName" type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="contact-field-group">
          <label htmlFor="contactPhone">Phone</label>
          <input id="contactPhone" type="text" placeholder="Phone" value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button className="contact-submit-button" onClick={handleAddContact}>
          Add Contact
        </button>
      </div>
    </div>
  );
}

export default AddContact;
