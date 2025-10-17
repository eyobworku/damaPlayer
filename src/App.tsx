import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BoardGamePage from "./components/BoardGamePage";
import CountWraper from "./count/CountWraper";
import MultiplayerModeSelector from "./components/MultiplayerModeSelector";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<BoardGamePage />} />
        <Route path="/" element={<MultiplayerModeSelector />} />
        <Route path="/count" element={<CountWraper />} />
      </Routes>
    </Router>
  );
};

export default App;
