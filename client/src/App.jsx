import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyAlerts from "./pages/MyAlerts";
import AddContact from "./pages/AddContact";
import ViewContacts from "./pages/ViewContacts";
import Profile from "./pages/Profile"
function App(){
  return(
    <BrowserRouter>
     <Routes>
       <Route path="/" element={<Navigate to="/login"/>} /> 
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/dashboard" element={<Dashboard /> }/>
       <Route path="/my-alerts" element={<MyAlerts />} />
       <Route path="/add-contact" element={<AddContact />} />
       <Route path="/view-contacts" element={<ViewContacts />} />
       <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
