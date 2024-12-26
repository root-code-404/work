import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

            if (response.data.token && response.data.user) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);

                if (user.userType === 0) {
                    navigate('/');
                } else if (user.userType === 1) {
                    navigate('/');
                } else if (user.userType === 2) {
                    navigate('/');
                }
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="bg-gray-100 p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Login to Your Account</h2>
                {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring-4 focus:ring-yellow-400 transition duration-300 ease-in-out"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="user_password"
                            className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring-4 focus:ring-yellow-400 transition duration-300 ease-in-out"
                            autoComplete='new-password'
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-gray-600 hover:text-yellow-500 transition duration-300">Forgot your password?</a>
                </div>

                <div className="mt-4 text-center">
                    <button onClick={() => navigate('/signup')} className="text-yellow-500 hover:text-yellow-600 font-semibold">
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
