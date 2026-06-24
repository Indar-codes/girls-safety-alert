import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import MyAlerts from "./pages/myalerts";
import AddContact from "./pages/AddContacts";
import ViewContacts from "./pages/ViewContacts";

function App(){
  return(
    <BrowserRouter>
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/dashboard" element={<Dashboard /> }/>
       <Route path="/my-alerts" element={<MyAlerts />} />
       <Route path="/add-contact" element={<AddContact />} />
       <Route path="/view-contacts" element={<ViewContacts />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
