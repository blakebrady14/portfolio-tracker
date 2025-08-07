import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../services/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo/Title */}
        <div className="logo">
          <div className="logo-icon">📊</div>
          <h1>Portfolio Tracker</h1>
          <p className="subtitle">Track your investments with confidence</p>
        </div>
        
        {/* Auth Form */}
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
        
        {/* Switch Auth Mode */}
        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="link-button"
            >
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
