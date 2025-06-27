import { useState } from 'react';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for the login link!');
  };

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1>Nahw Quiz Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: '0.5rem', margin: '1rem 0', width: '300px' }}
      />
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>
        Send Magic Link
      </button>
      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
