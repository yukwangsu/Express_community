import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/views/Footer/Footer";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import PostingPage from "./components/views/PostingPage/PostingPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posting" element={<PostingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
