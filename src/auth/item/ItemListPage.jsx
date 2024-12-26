import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaIdCard } from 'react-icons/fa';
import AOS from 'aos';

const ItemListPage = () => {
    const [itemsByType, setItemsByType] = useState({});
    const [filters, setFilters] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemPerPage = 12;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/itemtype/items-by-type');
                const data = response.data;

                setItemsByType(data);

                const options = {};
                for (const type in data) {
                    options[type] = {
                        itemName: [...new Set(data[type].map((item) => item.itemName))],
                        itemBrand: [...new Set(data[type].map((item) => item.itemBrand))],
                        model: [...new Set(data[type].map((item) => item.model))],
                        year: [...new Set(data[type].map((item) => item.year))],
                    };
                }
                setDropdownOptions(options);
            } catch (err) {
                setError('Failed to load items');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleFilterChange = (type, field, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value,
            },
        }));
    };

    const applyFilters = (type, items) => {
        const filter = filters[type] || {};
        return items.filter((item) =>
            Object.entries(filter).every(
                ([key, value]) => !value || String(item[key]).toLowerCase().includes(String(value).toLowerCase())
            )
        );
    };

    const handleDropdownSelect = (type, field, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value,
            },
        }));
        setActiveDropdown(null);
    };

    const handleClearInput = (type, field) => {
        setFilters((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: '',
            },
        }));
    };

    const toggleDropdown = (type, field) => {
        setActiveDropdown((prev) =>
            prev === `${type}-${field}` ? null : `${type}-${field}`
        );
    };

    const handleNext = () => {
        if (currentIndex + itemPerPage < Object.keys(itemsByType).length) {
            setCurrentIndex(currentIndex + itemPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - itemPerPage >= 0) {
            setCurrentIndex(currentIndex - itemPerPage);
        }
    };

    const handleItemClick = (itemId) => {
        if (user) {
            navigate(`/item/${itemId}`);
        } else {
            alert('Please log in to view the item details');
            navigate('/login');
        }
    };

    if (loading) return <div className="loader">Loading items...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Item List</h2>
                {Object.keys(itemsByType).map((type) => (
                    <div key={type} className="mb-8">
                        <h3 className="text-xl font-semibold text-blue-600 mb-4">{type}</h3>
                        {/* Filter Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {['itemName', 'itemBrand', 'model', 'year'].map((field) => (
                                <div key={field} className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder={`Filter by ${field}`}
                                        value={filters[type]?.[field] || ''}
                                        onChange={(e) => handleFilterChange(type, field, e.target.value)}
                                        onClick={() => toggleDropdown(type, field)} // Show dropdown on click
                                        className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                    {/* Clear Icon */}
                                    {filters[type]?.[field] && (
                                        <button
                                            type="button"
                                            onClick={() => handleClearInput(type, field)} // Clear input when clicked
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                    {/* Dropdown for Filter Options */}
                                    {activeDropdown === `${type}-${field}` && (
                                        <div className="absolute top-full left-0 bg-white border rounded-md shadow-lg z-10 w-full max-h-48 overflow-y-auto">
                                            <select
                                                className="p-2 w-full transition-transform transform hover:scale-105"
                                                onChange={(e) => handleDropdownSelect(type, field, e.target.value)} // Handle dropdown select
                                            >
                                                <option value="">Select {field}</option>
                                                {dropdownOptions[type]?.[field]?.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Filtered Items */}
                        {itemsByType[type]?.length > 0 ? (
                            <div className="border-x-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {applyFilters(type, itemsByType[type])
                                    .slice(currentIndex, currentIndex + itemPerPage)
                                    .map((item) => (
                                        <div key={item._id} className="border-spacing-0 border-gray-300 rounded-md shadow-md transition-transform transform hover:scale-105">
                                            <Card
                                                onClick={() => handleItemClick(item._id)}
                                                className="border-collapse border-gray-300 rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-xl w-full h-40 object-cover rounded-t-lg"
                                                data-aos="fade-up"
                                            >
                                                <div>
                                                    <Card.Img
                                                        src={`http://localhost:5000/${item.itemImage}`}
                                                        alt={item.itemName}
                                                        className="rounded-md mb-4 w-full h-40 object-cover rounded-t-lg"
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg transition-opacity duration-300 ease-in-out opacity-50 hover:opacity-100">
                                                    <Card.Body className="text-white p-0">
                                                        <Card.Title className="text-md font-bold">{item.itemBrand} - {item.itemName}</Card.Title>
                                                        <Card.Text className="text-sm">{item.year} | {item.model}</Card.Text>
                                                    </Card.Body>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p>No Items available matching the filters.</p>
                        )}

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline-primary"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="flex items-center space-x-2"
                            >
                                <FaArrowLeft />
                                <span>Previous</span>
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={handleNext}
                                disabled={currentIndex + itemPerPage >= itemsByType[type]?.length}
                                className="w-full sm:w-auto flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <FaArrowRight />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemListPage;
