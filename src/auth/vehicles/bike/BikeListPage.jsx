import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { FaSearch, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

const BikeListPage = () => {
    const [bikes, setBikes] = useState([]);
    const [filters, setFilters] = useState({
        itemBrand: '',
        year: '',
        itemType: '',
        itemName: '',
    });
    const [brands, setBrands] = useState([]);
    const [uniqueItemNames, setUniqueItemNames] = useState([]);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [uniqueModels, setUniqueModels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const bikesPerPage = 12;
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
        const fetchBikes = async () => {
            try {
                const query = Object.entries(filters)
                    .filter(([key, value]) => value)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
                const searchQueryParam = searchQuery ? `&search=${searchQuery}` : '';
                const response = await axios.get(`http://localhost:5000/api/bikes?${query}${searchQueryParam}`);
                setBikes(response.data);

                setBrands([...new Set(response.data.map((bike) => bike.itemBrand))]);
                setUniqueItemNames([...new Set(response.data.map((bike) => bike.itemName))]);
                setUniqueYears([...new Set(response.data.map((bike) => bike.year))]);
                setUniqueModels([...new Set(response.data.map((bike) => bike.model))]);
            } catch (error) {
                console.error('Error fetching bikes:', error);
            }
        };

        fetchBikes();
    }, [filters, searchQuery]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const debounceTimeout = setTimeout(() => {
            setSearchQuery(value);
        }, 300);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setCurrentIndex(0);
    };

    const handleNext = () => {
        if (currentIndex + bikesPerPage < bikes.length) {
            setCurrentIndex(currentIndex + bikesPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - bikesPerPage >= 0) {
            setCurrentIndex(currentIndex - bikesPerPage);
        }
    };

    const handleCardClick = (itemId) => {
        if (user) {
            navigate(`/item/${itemId}`);
        } else {
            alert('Please log in to view the bike details');
            navigate('/login');
        }
    };

    return (
        <div className="container mx-auto px-0 py-8 ">
            <div className="text-center mb-10 max-w-lg mx-auto">
                <p data-aos="fade-up" className="text-sm text-primary">
                    Top Selling Bikes For You
                </p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">
                    Bikes
                </h1>
                <p data-aos="fade-up" className="text-sm text-gray-500">
                    Explore our collection of top-rated bikes loved by our customers.
                </p>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search bikes by brand or model..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            </div>

            <div className="mb-6">
                <h3 className="text-3xl font-semibold mb-4 text-black-600">Best Bikes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6 p-6 rounded-lg">
                    <Form.Select
                        name="itemBrand"
                        value={filters.itemBrand}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Brands</option>
                        {brands.map((itemBrand) => (
                            <option key={itemBrand} value={itemBrand}>
                                {itemBrand}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Years</option>
                        {uniqueYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Select
                        name="itemName"
                        value={filters.itemName}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Bikes Name</option>
                        {uniqueItemNames.map((itemName, index) => (
                            <option key={index} value={itemName}>
                                {itemName}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Select
                        name="itemName"
                        value={filters.itemName}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Models</option>
                        {uniqueModels.map((itemName, index) => (
                            <option key={index} value={itemName}>
                                {itemName}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            <div className="mb-10">
                {bikes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
                        {bikes.slice(currentIndex, currentIndex + bikesPerPage).map((bike) => (
                            <Card
                                key={bike._id}
                                onClick={() => handleCardClick(bike._id)}
                                className="space-y-3 bg-white relative rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                                data-aos="fade-up"
                            >
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:5000/${bike.itemImage}`}
                                    className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110"
                                    alt="Bike Image"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg transition-opacity duration-300 ease-in-out opacity-50 hover:opacity-100">
                                    <Card.Body className="text-white p-0">
                                        <Card.Title className="text-md font-bold">{bike.itemBrand} - {bike.itemName}</Card.Title>
                                        <Card.Text className="text-sm">{bike.year} | {bike.itemType}</Card.Text>
                                    </Card.Body>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>No bikes available matching the filters.</p>
                )}
            </div>

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
                    disabled={currentIndex + bikesPerPage >= bikes.length}
                    className="flex items-center space-x-2"
                >
                    <span>Next</span>
                    <FaArrowRight />
                </Button>
            </div>
        </div>
    );
};

export default BikeListPage;
