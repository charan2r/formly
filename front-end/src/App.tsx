import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Background from './components/Background';

const App: React.FC = () => {
  return (
    <Router>
      <Background />
      <Routes>
        <Route path="/overview" element={<div></div>} />
        <Route path="/" element={<div></div>} />
        <Route path="/audit-logs" element={<div></div>} />
      </Routes>
    </Router>
  );
};

export default App;
