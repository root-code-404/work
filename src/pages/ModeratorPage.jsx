import React from 'react';
import ProfilePage from '../auth/ProfilePage';
import Main from '../components/Main';

const ModeratorPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Moderator Dashboard</h1>
      <div className="mb-6">
        <ProfilePage />
      </div>
      <div>
        <Main userType={2} />
      </div>
    </div>
  );
};

export default ModeratorPage;
