import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Background from './components/Background';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Background />
    </Router>
  );
};

export default App;
