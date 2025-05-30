import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import BoardGamePage from "./components/BoardGamePage";
import TestSoket from "./components/TestSoket";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route path="/board" element={<BoardGamePage />} />
        <Route path="/chat" element={<TestSoket />} />
      </Routes>
    </Router>
  );
};

export default App;
