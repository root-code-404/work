import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 0: Admin, 1: User, 2: Moderator
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Simulate fetching user details
    const userData = JSON.parse(localStorage.getItem('useType')) || {};
    setUserType(userData.userType);
    setUserDetails(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ userType, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
