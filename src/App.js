import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './component/Login';
import Register from './component/Register';
import Dashboard from './component/Dashboard';

function App() {
  return (
    <div>
      <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
