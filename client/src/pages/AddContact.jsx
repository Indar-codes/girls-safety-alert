import { useState } from "react";
import axios from "axios";
import "./AddContact.css";

function AddContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddContact = async () => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://girls-safety-alert.onrender.com/emergency-contact",
        { name, phone, consent },
        { headers: { Authorization: "Bearer " + token } }
      );
      setMessage("Contact added. They can receive your SOS text and location.");
      setName("");
      setPhone("");
      setConsent(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add contact.");
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
        <p className="contact-subtext">Only add someone who agreed to receive emergency texts and your location.</p>
        <div className="contact-field-group">
          <label htmlFor="contactName">Name</label>
          <input id="contactName" type="text" placeholder="Name" value={name}
            onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="contact-field-group">
          <label htmlFor="contactPhone">Phone</label>
          <input id="contactPhone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit Indian mobile" value={phone}
            onChange={(event) => setPhone(event.target.value)} />
        </div>
        <label style={{display:"flex", gap:"0.6rem", alignItems:"flex-start", margin:"1rem 0", textAlign:"left"}}>
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>I have their permission to send SOS texts and share my location with them.</span>
        </label>
        {message && <p role="status">{message}</p>}
        <button className="contact-submit-button" onClick={handleAddContact}
          disabled={!consent || !name.trim() || !phone.trim()}>
          Add Contact
        </button>
      </div>
    </div>
  );
}

export default AddContact;
