import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // Icons for hamburger menu
import DarkMode from "./DarkMode";

const Navbar = ({ handleOrderPopup }) => {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const generalLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Top Rated", link: "/#services" },
    { id: 3, name: "Kids Wear", link: "/#kids" },
    { id: 4, name: "Mens Wear", link: "/#mens" },
    { id: 5, name: "Electronics", link: "/#electronics" },
    { id: 6, name: "View Items", link: "/items-by-type" },
    { id: 9, name: "Profile", link: "/profile" },
  ];

  const roleBasedLinks = {
    user: [{ id: 7, name: "Cart", link: "/cart" }],
    admin: [{ id: 8, name: "Add Item Details", link: "/upload" }],
    moderator: [{ id: 10, name: "Add Item Details", link: "/moderator" }],
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserType(response.data.userType);
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch(() => {
          setUserType(null);
          setIsLoggedIn(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserType(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="flex justify-center items-center py-4">Loading...</div>;
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 dark:text-white shadow-md">
      {/* Top Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center px-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 text-3xl font-extrabold text-white hover:text-gray-200 transition-all ease-out duration-300">
            <img
              src={Logo}
              alt="Logo"
              className="w-12 h-12 rounded-full shadow-md transform hover:scale-110 transition-all duration-300"
            />
            <span className="text-lg">Shopsy</span>
          </NavLink>

          {/* Hamburger Menu for Mobile */}
          <button onClick={toggleMenu} className="block sm:hidden text-white text-3xl">
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* Desktop Search and Order */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search"
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 ease-in-out rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-2 focus:border-primary dark:border-gray-500 dark:bg-gray-800 dark:text-white"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 text-lg" />
            </div>

            <button
              onClick={handleOrderPopup}
              className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 text-white py-2 px-5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
            >
              <span className="hidden sm:block">Order</span>
              <FaShoppingCart className="text-xl" />
            </button>

            <DarkMode />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className={`${menuOpen ? "block" : "hidden"} sm:flex justify-center items-center flex-col sm:flex-row bg-white dark:bg-gray-900 dark:text-white`}>
        <ul className="flex flex-col sm:flex-row gap-6 px-4 sm:px-0">
          {generalLinks.map((link) => (
            <li key={link.id}>
              <NavLink to={link.link} className="hover:text-primary transform hover:scale-110 transition-all ease-in-out duration-300">
                {link.name}
              </NavLink>
            </li>
          ))}

          {isLoggedIn && roleBasedLinks[userType === 0 ? "admin" : userType === 1 ? "user" : "moderator"]?.map((link) => (
            <li key={link.id}>
              <NavLink to={link.link} className="hover:text-primary transform hover:scale-110 transition-all ease-in-out duration-300">
                {link.name}
              </NavLink>
            </li>
          ))}

          {!isLoggedIn && (
            <li>
              <NavLink to="/login" className="hover:text-primary transform hover:scale-110 transition-all ease-in-out duration-300">
                Signin
              </NavLink>
            </li>
          )}

          {isLoggedIn && (
            <li className="relative">
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-all ease-in-out duration-300"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
