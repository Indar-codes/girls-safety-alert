import { useEffect, useState } from "react";
import axios from "axios";
function ViewContacts() {

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
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

      setContacts(res.data.emergencyContacts);

    } catch (error) {
      console.log(error);
      alert("Failed to load contacts");
    }
  };

  return (
    <div>
      <h1>Emergency Contacts</h1>

      {contacts.length === 0 ? (
        <p>No Contacts Found</p>
      ) : (
        contacts.map((contact, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px"
            }}
          >
            <h3>{contact.name}</h3>
            <p>{contact.phone}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewContacts;