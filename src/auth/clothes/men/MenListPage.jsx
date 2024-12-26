import { FaStar } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, CardBody } from 'react-bootstrap';
import { FaSearch, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

const MenListPage = ({ handleOrderPopup }) => {
    const [men, setMen] = useState([]);
    const [filters, setFilters] = useState({
        itemBrand: '',
        year: '',
        model: '',
        itemName: '',
    });
    const [brands, setBrands] = useState([]);
    const [uniqueItemName, setUniqueItemName] = useState([]);
    const [uniqueYears, setUniqueYears] = useState([]);
    const [uniqueModels, setUniqueModels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const menPerPage = 12;
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
        const fetchmen = async () => {
            try {
                const query = Object.entries(filters)
                    .filter(([key, value]) => value)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
                const searchQueryParam = searchQuery ? `&search=${searchQuery}` : '';
                const response = await axios.get(`http://localhost:5000/api/men?${query}${searchQueryParam}`);
                setMen(response.data);
                setBrands([...new Set(response.data.map(item => item.itemBrand))]);
                setUniqueItemName([...new Set(response.data.map(item => item.itemName))]);
                setUniqueYears([...new Set(response.data.map(item => item.year))]);
                setUniqueModels([...new Set(response.data.map(item => item.model))]);
            } catch (error) {
                console.error('Error fetching men:', error);
            }
        };

        fetchmen();
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
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        setCurrentIndex(0);
    };

    const handleNext = () => {
        if (currentIndex + menPerPage < men.length) {
            setCurrentIndex(currentIndex + menPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - menPerPage >= 0) {
            setCurrentIndex(currentIndex - menPerPage);
        }
    };

    const handleCardClick = (itemId) => {
        if (user) {
            navigate(`/item/${itemId}`);
        } else {
            alert('Please log in to view the item details');
            navigate('/login');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="text-center mb-10 max-w-lg mx-auto">
                <p data-aos="fade-up" className="text-sm text-primary">Top Selling Vars For You</p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">Men</h1>
                <p data-aos="fade-up" className="text-sm text-gray-500">Explore our collection of top-rated men loved by our customers.</p>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search men by brand or model..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            </div>

            <div className="mb-6">
                <h3 className="text-3xl font-semibold mb-4 text-black-600">Best Men</h3>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-6 rounded-lg">
                    <Form.Select
                        name="itemBrand"
                        value={filters.itemBrand}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Brands</option>
                        {brands.map(itemBrand => (
                            <option key={itemBrand} value={itemBrand}>{itemBrand}</option>
                        ))}
                    </Form.Select>

                    <Form.Select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Years</option>
                        {uniqueYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Form.Select>

                    <Form.Select
                        name="itemName"
                        value={filters.itemName}
                        onChange={handleFilterChange}
                        className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                    >
                        <option value="">All Clothes Name</option>
                        {uniqueItemName.map((itemName, index) => (
                            <option key={index} value={itemName}>{itemName}</option>
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
                            <option key={index} value={itemName}>{itemName}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            <div className="text-left mb-32">
                <p data-aos="fade-up" className="text-sm text-primary">Explore Men’s Collection</p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">Men’s List</h1>
                <p data-aos="fade-up" className="text-xs text-gray-400">Discover the best styles in men’s fashion, tailored for all occasions.</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 mb-7">
                {men.slice(currentIndex, currentIndex + menPerPage).map((product) => (
                    <Card
                        key={product.id}
                        onClick={() => handleCardClick(product._id)}
                        data-aos="zoom-in"
                        className="w-full rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
                    >
                        <div className="h-[110px]">
                            <Card.Img
                                src={`http://localhost:5000/${product.itemImage}`}
                                alt={product.itemName}
                                className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                            />
                        </div>
                        <Card.Body className="p-4 text-center">
                            <div className="w-full flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`${index < product.rating ? "text-yellow-500" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <h1 className="text-xl font-bold">{product.itemBrand}</h1>
                            <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                                {product.model}
                            </p>
                            <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                                {product.itemName}
                            </p>
                            <button
                                className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                                onClick={handleOrderPopup}
                            >
                                Order Now
                            </button>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between mt-10">
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
                    disabled={currentIndex + menPerPage >= men.length}
                    className="flex items-center space-x-2"
                >
                    <span>Next</span>
                    <FaArrowRight />
                </Button>
            </div>
        </div>
    );
};

export default MenListPage;
