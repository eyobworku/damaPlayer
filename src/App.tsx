import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BoardGamePage from "./components/BoardGamePage";
import CountWraper from "./count/CountWraper";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/board" element={<BoardGamePage />} />
        <Route path="/" element={<CountWraper />} />
      </Routes>
    </Router>
  );
};

export default App;
