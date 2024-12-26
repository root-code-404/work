import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'; // React Bootstrap components

const CarEditForm = () => {
  const [car, setCar] = useState({
    brand: '',
    model: '',
    carType: '',
    features: '',
    description: '',
    price: '',
    priceUnit: '',
    carImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const { id } = useParams();
  const [showDropdown, setShowDropdown] = useState(false); // To toggle dropdown visibility
  const navigate = useNavigate();

  const handleSelectCarType = (type) => {
    setCar({ ...car, carType: type });
    setShowDropdown(false); // Close dropdown after selection
  };

  useEffect(() => {
  const fetchCar = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
      setCar(response.data);
      // Ensure the carImage path is correct
      if (response.data.carImage) {
        setImagePreview(`http://localhost:5000/uploads/${response.data.carImage}`);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching car details:', error);
      setLoading(false);
    }
  };
  fetchCar();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCar({ ...car, carImage: file });
      setImagePreview(URL.createObjectURL(file)); // Create a URL for the selected image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in car) {
      formData.append(key, car[key]);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Update Response:', response.data); // Check the response for any issues
      navigate('/adminpage/list');
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Edit Car Details</h2>
      <Form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Brand</Form.Label>
          <Form.Control
            type="text"
            name="brand"
            value={car.brand || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Model */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Model</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={car.model || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Car Type Dropdown */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Car Type</Form.Label>
          <div className="relative">
            <button
              type="button"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-4 focus:ring-blue-400 text-left text-gray-700 flex justify-between items-center"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {car.carType || 'Select Car Type'} <span className="text-gray-400">▼</span>
            </button>
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
                <ul className="max-h-60 overflow-auto">
                  {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((type) => (
                    <li
                      key={type}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType(type)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Features</Form.Label>
          <Form.Control
            type="text"
            name="features"
            value={car.features || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
            placeholder="Comma-separated list of features"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={car.description || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={car.price || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Price Unit */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Price Unit</Form.Label>
          <Form.Control
            type="text"
            name="priceUnit"
            value={car.priceUnit || ''}
            onChange={handleChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Car Image */}
        <div className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700">Car Image</Form.Label>
          <Form.Control
            type="file"
            name="carImage"
            onChange={handleImageChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Car Preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CarEditForm;
