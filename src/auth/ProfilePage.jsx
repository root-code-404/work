import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminPage from "../pages/AdminPage";
import UserPage from '../pages/UserPage';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserData();
    }, [token]);

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
                <p className="text-white text-lg">Loading profile...</p>
            </div>
        );
    }

    const renderPageContent = () => {
        switch (user.userType) {
            case 0: // Admin
                return (
                    <div className="h-full">
                        <AdminPage />
                    </div>
                );
            case 1: // User
                return (
                    <div className="h-full">
                        <UserPage />
                    </div>
                );
            case 2: // Moderator
                return (
                    <div className="h-full">
                        <h2 className="text-2xl font-bold mb-4">Moderator Dashboard</h2>
                        <p>Welcome, Moderator {user.name}!</p>
                        {/* Add Moderator-specific functionality here */}
                    </div>
                );
            default:
                return <p>Unauthorized access</p>;
        }
    };

    return (
        <div className="flex h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="flex flex-col flex-grow bg-white shadow-lg p-8 text-gray-700">
                {renderPageContent()}
            </div>
        </div>
    );
};

export default ProfilePage;
