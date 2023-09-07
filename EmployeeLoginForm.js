
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './EmployeeLoginForm.css'; 

const EmployeeLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8081/employee-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginStatus('success');
      } else {
        setLoginStatus('error');
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginStatus('error');
    }
  };

  if (loginStatus === 'success') {
    return <Navigate to="/employee-dashboard" />;
  }

  return (
    <div className="login-container">
      <div className="login-form"> 
        <h2>Employee Login</h2>
        <form>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={handleLogin}>Employee Login</button>
        </form>
        {loginStatus === 'error' && <p>Login failed. Please check your credentials.</p>}
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default EmployeeLoginForm;