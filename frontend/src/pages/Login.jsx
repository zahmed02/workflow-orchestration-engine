import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            onLogin();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-surface-container-low border border-outline-variant p-8 rounded-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-on-surface mb-6 text-center">FlowState Login</h2>
                {error && <div className="bg-error-container/20 text-error p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                               className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                               className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary" required />
                    </div>
                    <button type="submit" className="w-full bg-primary text-on-primary-container py-2 rounded-lg font-semibold hover:brightness-110 transition">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-on-surface-variant text-sm">
                    Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;