import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { FaSearch, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';

const CarListPage = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    year: '',
    type: '',
    model: '',
  });
  const [brands, setBrands] = useState([]);
  const [uniqueitems, setUniqueitems] = useState([]);
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
        const response = await axios.get(`http://localhost:5000/api/items?${query}`);
        setCars(response.data);

        setBrands([...new Set(response.data.map(car => car.brand))]);
        setUniqueitems([...new Set(response.data.map(car => car.item))]);
        setUniqueYears([...new Set(response.data.map(car => car.year))]);
        setUniqueModels([...new Set(response.data.map(car => car.model))]);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [filters]);

  useEffect(() => {
    setCurrentIndex(0); // Reset to page 1 whenever the search query changes
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentIndex(0); // Reset the page index when filters change
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearchQuery =
      car?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car?.model?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearchQuery;
  });

  const sortedCars = filteredCars.sort((a, b) => {
    if (a?.brand?.toLowerCase() < b?.brand?.toLowerCase()) return -1;
    if (a?.brand?.toLowerCase() > b?.brand?.toLowerCase()) return 1;
    if (a?.model?.toLowerCase() < b?.model?.toLowerCase()) return -1;
    if (a?.model?.toLowerCase() > b?.model?.toLowerCase()) return 1;
    return 0;
  });

  const totalCars = sortedCars.length;

  const carsToDisplay = sortedCars.slice(currentIndex, currentIndex + carsPerPage);

  const handleNext = () => {
    if (currentIndex + carsPerPage < totalCars) {
      setCurrentIndex(currentIndex + carsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - carsPerPage >= 0) {
      setCurrentIndex(currentIndex - carsPerPage);
    }
  };

  const handleCardClick = (carId) => {
    if (user) {
      navigate(`/car/${carId}`);
    } else {
      alert('Please log in to view the car details');
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto px-0 py-8 ">
      <div className="text-center mb-10 max-w-lg mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Vars For You
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Cars
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-500">
            Explore our collection of top-rated cars loved by our customers.
          </p>
        </div>
    
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

      <div className="mb-6">
        <h3 className="text-3xl font-semibold mb-4 text-black-600">Best Cars</h3>
        <div className="flex space-x-6 mb-6  p-6 rounded-lg ">
          <Form.Select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 p-4 ease-in-outp-4 border-0 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
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
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="bg-gradient-to-r from-yellow-700 to-orange-400 text-gray p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Car Types</option>
            {uniqueitems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Models</option>
            {uniqueModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
      {/* Car Section with Heading */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {carsToDisplay.map((car) => (
            <Card
              key={car._id}
              onClick={() => handleCardClick(car._id)}
              className="space-y-3 bg-white  relative rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
            >
              {/* Car Image */}
              <Card.Img
                variant="top"
                src={`http://localhost:5000/${car.carImage}`}
                className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110"
                alt="Car Image"
              />

              {/* Card Body - Positioned over the image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg transition-opacity duration-300 ease-in-out opacity-50 hover:opacity-100">
                <Card.Body className="text-white p-0 ">
                  <Card.Title className="text-md font-bold">{car.brand} - {car.model}</Card.Title>
                  <Card.Text className="text-sm">{car.year} | {car.item}</Card.Text>
                </Card.Body>
              </div>
            </Card>
          ))}
        </div>
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
          disabled={currentIndex + carsPerPage >= totalCars}
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
