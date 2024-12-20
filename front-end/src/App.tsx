import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Background from './components/Background';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Background />
      </Router>
    </AuthProvider>
  );
};

export default App;
