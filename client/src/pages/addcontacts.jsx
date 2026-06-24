import { useState, useEffect } from "react";
import axios from "axios";

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
        "http://localhost:5000/profile",
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

      await axios.put(
        `http://localhost:5000/user/${userId}/emergency-contact`,
        {
          name,
          phone
        }
      );

      alert("Contact Added Successfully");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Add Emergency Contact</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAddContact}>
        Add Contact
      </button>

    </div>
  );
}

export default AddContact;