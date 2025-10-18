import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BoardGamePage from "./components/BoardGamePage";
import MultiplayerModeSelector from "./components/MultiplayerModeSelector";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<BoardGamePage />} />
        <Route path="/" element={<MultiplayerModeSelector />} />
      </Routes>
    </Router>
  );
};

export default App;
