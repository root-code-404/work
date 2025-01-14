import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== reEnterPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Replace localhost with your local IP address
            await axios.post('http://192.168.1.5:5000/api/users/signup', { email, password, userType, name });
            alert('Signup successful!');
            navigate('/login');
        } catch (error) {
            alert('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
            <Container className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg transition-all duration-500">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Create Account
                </h2>
                <Form onSubmit={handleSignup} className="space-y-6">
                    <Form.Group controlId="name" className="flex items-center space-x-4">
                        <Form.Label className="text-gray-600 font-semibold w-32 text-left">Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-lg px-4 py-2 flex-grow shadow-md focus:shadow-md focus:outline-none transition-all"
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="flex items-center space-x-4">
                        <Form.Label className="text-gray-600 font-semibold w-32 text-left">Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg px-4 py-2 flex-grow shadow-md focus:shadow-md focus:outline-none transition-all"
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="flex items-center space-x-4">
                        <Form.Label className="text-gray-600 font-semibold w-32 text-left">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg px-4 py-2 flex-grow shadow-md focus:shadow-md focus:outline-none transition-all"
                        />
                    </Form.Group>

                    <Form.Group controlId="reEnterPassword" className="flex items-center space-x-4">
                        <Form.Label className="text-gray-600 font-semibold w-32 text-left">Re-enter Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Re-enter your password"
                            value={reEnterPassword}
                            onChange={(e) => setReEnterPassword(e.target.value)}
                            className="rounded-lg px-4 py-2 flex-grow shadow-md focus:shadow-md focus:outline-none transition-all"
                        />
                    </Form.Group>

                    <Form.Group controlId="userType" className="flex items-center space-x-4">
                        <Form.Label className="text-gray-600 font-semibold w-32 text-left">User Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="rounded-lg px-4 py-2 flex-grow shadow-md focus:shadow-md focus:outline-none transition-all"
                        >
                            <option value="">Select User Type</option>
                            <option value="1">User</option>
                        </Form.Control>
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-800 to-purple-700 text-white font-bold rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        Sign Up
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default SignupForm;
