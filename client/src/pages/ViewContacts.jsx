// ViewContacts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewContacts.css";

function ViewContacts() {
  const[search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
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

      setContacts(res.data.emergencyContacts);

    } catch (error) {
      console.log(error);
      alert("Failed to load contacts");
    }
  };

  return (
    <div className="contacts-shell">
      <div className="contacts-card">

        <h1 className="contacts-heading">Emergency Contacts</h1>
        <p className="contacts-subtext">People who'll be alerted when you send an SOS</p>

        <div className="contacts-search-wrap">
          <svg className="contacts-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search Contact..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="contacts-search-input"
          />
        </div>

        {contacts.length === 0 ? (
          <p className="contacts-empty">No Contacts Found</p>
        ) : (
          <div className="contacts-list">
            {contacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase())).map((contact,index)=>(
              <div key={index} className="contact-row">
                <div className="contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-info">
                  <h3 className="contact-name">{contact.name}</h3>
                  <a className="contact-phone" href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ViewContacts;