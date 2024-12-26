import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { FaSearch, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

const CarListPage = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    itemBrand: '',
    year: '',
    itemType: '',
    itemName: '',
  });
  const [brands, setBrands] = useState([]);
  const [uniqueItemName, setUniqueItemName] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueModels, setUniqueModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const carsPerPage = 12;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a default duration
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
    const fetchCars = async () => {
      try {
        const query = Object.entries(filters)
          .filter(([key, value]) => value)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        const searchQueryParam = searchQuery ? `&search=${searchQuery}` : '';
        const response = await axios.get(`http://localhost:5000/api/cars?${query}${searchQueryParam}`);
        setCars(response.data);

        // Update dropdown filters
        setBrands([...new Set(response.data.map(car => car.itemBrand))]);
        setUniqueItemName([...new Set(response.data.map(car => car.itemName))]);
        setUniqueYears([...new Set(response.data.map(car => car.year))]);
        setUniqueModels([...new Set(response.data.map(car => car.model))]);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
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
    }, 300); // Adjust debounce delay as needed
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentIndex(0); // Reset the page index when filters change
  };

  const handleNext = () => {
    if (currentIndex + carsPerPage < cars.length) {
      setCurrentIndex(currentIndex + carsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - carsPerPage >= 0) {
      setCurrentIndex(currentIndex - carsPerPage);
    }
  };

  const handleCardClick = (itemId) => {
    if (user) {
      navigate(`/item/${itemId}`);
    } else {
      alert('Please log in to view the car details');
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10 max-w-lg mx-auto">
        <p data-aos="fade-up" className="text-sm text-primary">
          Top Selling Cars For You
        </p>
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          Cars
        </h1>
        <p data-aos="fade-up" className="text-sm text-gray-500">
          Explore our collection of top-rated cars loved by our customers.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search cars by brand or model..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
        />
        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500" />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-3xl font-semibold mb-4 text-black-600">Best Cars</h3>
        <div className="flex flex-wrap gap-4 mb-6 p-6 rounded-lg">
          <Form.Select
            name="itemBrand"
            value={filters.itemBrand}
            onChange={handleFilterChange}
            className="w-full sm:w-auto p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
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
            className="w-full sm:w-auto p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
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
            className="w-full sm:w-auto p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Cars Name</option>
            {uniqueItemName.map((itemName, index) => (
              <option key={index} value={itemName}>
                {itemName}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            name="itemName"
            value={filters.itemName}
            onChange={handleFilterChange}
            className="w-full sm:w-auto p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
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

      {/* Car List */}
      <div className="mb-10">
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cars.slice(currentIndex, currentIndex + carsPerPage).map((car) => (
              <Card
                key={car._id}
                onClick={() => handleCardClick(car._id)}
                className="space-y-3 bg-white relative rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                data-aos="fade-up"
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/${car.itemImage}`}
                  className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110"
                  alt="Car Image"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg transition-opacity duration-300 ease-in-out opacity-50 hover:opacity-100">
                  <Card.Body className="text-white p-0">
                    <Card.Title className="text-md font-bold">
                      {car.itemBrand} - {car.itemName}
                    </Card.Title>
                    <Card.Text className="text-sm">
                      {car.year} | {car.itemType}
                    </Card.Text>
                  </Card.Body>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>No cars available matching the filters.</p>
        )}
      </div>

      {/* Pagination */}
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
          disabled={currentIndex + carsPerPage >= cars.length}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <FaArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default CarListPage;
