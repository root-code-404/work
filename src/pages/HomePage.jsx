import React from 'react';

const HomePage = ({ userType }) => {
  const getRoleName = () => {
    if (userType === 0) return 'Admin';
    if (userType === 1) return 'User';
    if (userType === 2) return 'Moderator';
    return 'Guest';
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-yellow-400">Welcome, {getRoleName()}!</h1>
      <p className="mt-4 text-lg text-gray-300">This is your personalized dashboard.</p>
    </div>
  );
};

export default HomePage;
