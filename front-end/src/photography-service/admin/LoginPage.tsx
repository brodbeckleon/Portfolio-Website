import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Replace with your real endpoint, for example: `/api/login`
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Suppose the token is returned in data.token
                localStorage.setItem('token', data.token);
                navigate('/admin');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during login.');
        }
    };

    return (
        <div style={{
            marginTop: '50px',
            textAlign: 'center',
            backgroundColor: 'white',
        }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'inline-block' }}>
                <div className={"grid"}>
                        <label htmlFor="email">Email: </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />

                        <label htmlFor="password">Password: </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                </div>

                <button
                    type="submit"
                    style={{ width: '100%', marginTop: '10px' }}
                >Log In
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
