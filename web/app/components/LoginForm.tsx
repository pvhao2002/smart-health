'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './LoginForm.css';
import apiClient from "@/api/apiClient";
import { API_ENDPOINTS } from "@/constants/api";
import Spinner from "@/app/components/Spinner";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
            const { token, refreshToken, email: userEmail, role } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user_email', userEmail);
            localStorage.setItem('user_role', role);

            router.push('/admin');
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(
                err.response?.status === 401
                    ? 'Sai email hoặc mật khẩu.'
                    : 'Lỗi hệ thống, vui lòng thử lại sau.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <div className="gym-login-page">
                <div className="gym-overlay">
                    <div className="login-card">
                        <h1 className="brand">FITZONE ADMIN</h1>
                        <p className="subtitle">Train Hard · Stay Strong · Manage Smart 💪</p>

                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="coach@fitzone.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="error">{error}</p>}

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Login'}
                            </button>

                            <p className="note">© 2025 FitZone Fitness System</p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
