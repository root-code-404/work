import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap"; // Using React Bootstrap components
import axios from "axios";

const CarFormPage = () => {
  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    year: "",
    carType: "Select Car Type", // Default value for Car Type
    price: "",
    priceUnit: "Lakh", // Default unit for price
    description: "",
    features: "",
    carImage: '',
  });
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [showDropdown, setShowDropdown] = useState(false); // Manage dropdown visibility
  const fileInputRef = useRef(null); // Add ref for file input

  // Handling input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Car Type selection
  const handleSelectCarType = (type) => {
    setCarDetails((prev) => ({ ...prev, carType: type }));
    setShowDropdown(false); // Close dropdown after selection
  };

  // Handle Price Unit selection
  const handleSelectPriceUnit = (unit) => {
    setCarDetails((prev) => ({ ...prev, priceUnit: unit }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand", carDetails.brand);
    formData.append("model", carDetails.model);
    formData.append("year", carDetails.year);
    formData.append("carType", carDetails.carType);
    formData.append("price", carDetails.price);
    formData.append("priceUnit", carDetails.priceUnit);
    formData.append("description", carDetails.description);
    formData.append("features", carDetails.features);
    formData.append("carImage", carDetails.carImage);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cars",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data); // Successful response
      setErrorMessage(""); // Clear any previous error messages
      alert("Car added successfully!");

      // Reset form fields after successful submission
      setCarDetails({
        brand: "",
        model: "",
        year: "",
        carType: "Select Car Type",
        price: "",
        priceUnit: "Lakh",
        description: "",
        features: "",
        carImage: '',
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("A car with the same details already exists.");
      } else {
        setErrorMessage("Error submitting form. Please try again.");
      }
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-orange-200 to-red-300 p-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Add Car Details
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Brand and Model in a Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
                Brand
              </Form.Label>
              <Form.Control
                type="text"
                name="brand"
                placeholder="Car Brand"
                value={carDetails.brand}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
                Model
              </Form.Label>
              <Form.Control
                type="text"
                name="model"
                placeholder="Car Model"
                value={carDetails.model}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Year and Price in a Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
                Year
              </Form.Label>
              <Form.Control
                type="number"
                name="year"
                placeholder="Year of Manufacture"
                value={carDetails.year}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
                Price
              </Form.Label>
              <div className="flex space-x-4">
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={carDetails.price}
                  onChange={handleChange}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                />
                {/* Dropdown for Price Unit */}
                <select
                  name="priceUnit"
                  value={carDetails.priceUnit}
                  onChange={(e) => handleSelectPriceUnit(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Lakh">Lakh</option>
                  <option value="Cr">Cr</option>
                  <option value="Million">Million</option>
                </select>
              </div>
            </div>
          </div>

          {/* Car Type Dropdown */}
          <div className="flex flex-col mb-6">
            <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
              Car Type
            </Form.Label>
            <div className="relative">
              <button
                type="button"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-4 focus:ring-blue-400 text-left text-gray-700 flex justify-between items-center"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {carDetails.carType} <span className="text-gray-400">▼</span>
              </button>
              {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
                  <ul className="max-h-60 overflow-auto">
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType("Sedan")}
                    >
                      Sedan
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType("SUV")}
                    >
                      SUV
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType("Coupe")}
                    >
                      Coupe
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType("Convertible")}
                    >
                      Convertible
                    </li>
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                      onClick={() => handleSelectCarType("Truck")}
                    >
                      Truck
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Description and Features */}
          <div className="flex flex-col mb-6">
            <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Car Description"
              value={carDetails.description}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col mb-6">
            <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
              Features
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="features"
              placeholder="Car Features"
              value={carDetails.features}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Car Image Upload */}
          <div className="flex flex-col mb-6">
            <Form.Label className="text-lg font-semibold text-gray-700 mb-2">
              Upload Car Image
            </Form.Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setCarDetails({ ...carDetails, carImage: e.target.files[0] })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg focus:ring-4 focus:ring-blue-400"
          >
            Add Car
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CarFormPage