import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CarFormPage = () => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [carBrands, setCarBrands] = useState([]);
  const [carNames, setCarNames] = useState([]);
  const [itemNos, setItemNos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCarType, setSelectedCarType] = useState('');
  const [selectedCarBrand, setSelectedCarBrand] = useState('');
  const [selectedCarName, setSelectedCarName] = useState('');
  const [selectedItemNo, setSelectedItemNo] = useState('');
  const [selectedItemQnty, setSelectedItemQnty] = useState('');


  const fileInputRef = useRef(null);

  const [carDetails, setCarDetails] = useState({
    year: '',
    features: '',
    description: '',
    price: '',
    priceUnit: 'Lakh',
    carImage: '',

  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items/categories/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch types based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const fetchTypes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types`
          );
          setTypes(response.data);
        } catch (error) {
          console.error('Error fetching types:', error);
        }
      };
      fetchTypes();
    }
  }, [selectedCategory]);

  // Fetch car types based on selected category and type
  useEffect(() => {
    if (selectedCategory && selectedType) {
      const fetchCarTypes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models`
          );
          setCarTypes(response.data);
        } catch (error) {
          console.error('Error fetching car types:', error);
        }
      };
      fetchCarTypes();
    }
  }, [selectedCategory, selectedType]);

  // Fetch car brands based on selected category, type, and car type
  useEffect(() => {
    if (selectedCategory && selectedType && selectedCarType) {
      const fetchCarBrands = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedCarType}/brand`
          );
          setCarBrands(response.data);
        } catch (error) {
          console.error('Error fetching car brands:', error);
        }
      };
      fetchCarBrands();
    }
  }, [selectedCategory, selectedType, selectedCarType]);

  // Fetch car names based on selected category, type, car type, and brand
  useEffect(() => {
    if (selectedCategory && selectedType && selectedCarType && selectedCarBrand) {
      const fetchCarNames = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedCarType}/brand/${selectedCarBrand}/name`
          );
          setCarNames(response.data);
        } catch (error) {
          console.error('Error fetching car names:', error);
        }
      };
      fetchCarNames();
    }
  }, [selectedCategory, selectedType, selectedCarType, selectedCarBrand]);

  // Fetch item numbers based on selected car name
  useEffect(() => {
    if (selectedCategory && selectedType && selectedCarType && selectedCarBrand && selectedCarName) {
      const fetchItemNos = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedCarType}/brand/${selectedCarBrand}/name/${selectedCarName}/number`
          );
          setItemNos(response.data);
        } catch (error) {
          console.error('Error fetching item numbers:', error);
        }
      };
      fetchItemNos();
    }
  }, [selectedCategory, selectedType, selectedCarType, selectedCarBrand,selectedCarName]);

  // Fetch item Qnty based on selected car name

  useEffect(() => {
    if (
      selectedCategory &&
      selectedType &&
      selectedCarType &&
      selectedCarBrand &&
      selectedCarName &&
      selectedItemNo
    ) {
      const fetchItemQnty = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedCarType}/brand/${selectedCarBrand}/name/${selectedCarName}/number/${selectedItemNo}/qnty`
          );
          setSelectedItemQnty(response.data);


        } catch (error) {
          console.error('Error fetching item quantity:', error);
        }
      };
      fetchItemQnty();
    }
  }, [
    selectedCategory,
    selectedType,
    selectedCarType,
    selectedCarBrand,
    selectedCarName,
    selectedItemNo,
  ]);
  


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check quantity limit
    if (selectedItemQnty && selectedItemQnty <= 0) {
      alert('Item quantity has been exhausted. Cannot add more cars for this item number.');
      return;
    }

    const formData = new FormData();
    formData.append('itemCategory', selectedCategory);
    formData.append('itemType', selectedType);
    formData.append('itemBrand', selectedCarBrand);
    formData.append('itemName', selectedCarName);
    formData.append('itemNo', selectedItemNo);
    formData.append('itemQuantity', selectedItemQnty);
    formData.append('brand', carDetails.brand);

    formData.append('year', carDetails.year);
    formData.append('model', selectedCarType);
    formData.append('price', carDetails.price);
    formData.append('priceUnit', carDetails.priceUnit);
    formData.append('description', carDetails.description);
    formData.append('features', carDetails.features);
    formData.append('itemImage', fileInputRef.current?.files[0] || '');

    try {
      const response = await axios.post('http://localhost:5000/api/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Car added successfully!');
      setCarDetails({
        year: '',
        features: '',
        description: '',
        price: '',
        priceUnit: 'Lakh',
        carImage: '',
        
      });
      setSelectedCategory('');
      setSelectedType('');
      setSelectedCarType('');
      setSelectedCarBrand('');
      setSelectedCarName('');
      setSelectedItemNo('');
      setSelectedItemQnty('');
      fileInputRef.current.value = ''; // Clear file input
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage('A car with the same details already exists.');
      } else {
        setErrorMessage('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Add Car Details</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
        )}

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded w-full p-2"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type Dropdown */}
        {selectedCategory && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Car Type Dropdown */}
        {selectedType && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Car Type</label>
            <select
              value={selectedCarType}
              onChange={(e) => setSelectedCarType(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Car Type</option>
              {carTypes.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Car Brand Dropdown */}
        {selectedCarType && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Car Brand</label>
            <select
              value={selectedCarBrand}
              onChange={(e) => setSelectedCarBrand(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Car Brand</option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Car Name Dropdown */}
        {selectedCarBrand && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Car Name</label>
            <select
              value={selectedCarName}
              onChange={(e) => setSelectedCarName(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Car Name</option>
              {carNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Item Number */}
        {selectedCarName && (
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Number</label>
            <select
              value={selectedItemNo}
              onChange={(e) => setSelectedItemNo(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Item No</option>
              {itemNos.map((itemNo) => (
                <option key={itemNo} value={itemNo}>
                  {itemNo}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Item Number */}
        
        {selectedItemNo && (
          <div>
            <div>
              <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700">Item Quantity</label>
              <input
                id="itemQuantity"
                type="number"
                value={selectedItemQnty}
                onChange={(e) => setSelectedItemQnty(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                disabled
              />

            </div>
          </div>
        )}
        {/* Item Quantity */}
        

        {/* Car Details Inputs */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Year</label>
          <input
            type="number"
            name="year"
            value={carDetails.year}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Year of Manufacture"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Features</label>
          <textarea
            name="features"
            value={carDetails.features}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Car Features"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={carDetails.description}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Car Description"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={carDetails.price}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Price"
          />
        </div>
        {/* Price Unit */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price Unit</label>
          <select
            name="priceUnit"
            value={carDetails.priceUnit}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="Lakh">Lakh</option>
            <option value="Thousand">Thousand</option>
            <option value="Million">Million</option>
          </select>
        </div>

        {/* Car Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Car Image</label>
          <input
            type="file"
            ref={fileInputRef}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Car
        </button>
        
      </form>
      
    </div>
  );
};

export default CarFormPage;
