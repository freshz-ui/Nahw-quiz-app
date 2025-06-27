import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
        <header style={{
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Nahw Quiz
        </header>

        <Routes>
          {!user ? (
            <Route path="*" element={<LoginPage />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/quiz/:unit/:topic" element={<QuizPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
