import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [types, setTypes] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  // Fetch categories when the component mounts
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

  // Fetch types based on the selected category
  useEffect(() => {
    if (selectedCategory) {
      const fetchTypes = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/items/categories/${selectedCategory}/types`);
          setTypes(response.data);
        } catch (error) {
          console.error('Error fetching types:', error);
        }
      };
      fetchTypes();
    } else {
      setTypes([]);
    }
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedType(''); // Reset selected type when category changes
  };

  // Handle type selection
  const handleTypeClick = (type) => {
    setSelectedType(type);
    navigate('/adminpage/form', { state: { category: selectedCategory, type }, key: `${selectedCategory}-${type}` });
  };

  // Toggle category visibility
  const handleListButtonClick = () => {
    setShowCategorySelector(!showCategorySelector);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold tracking-wide mb-4 text-center">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/adminpage/details"
              className="block py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              List
            </Link>
          </li>
          <li>
            <Link
              to="/adminpage/items-by-type"
              className="block py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              View Item List
            </Link>
          </li>
          <li>
            <Link
              to="/adminpage/item"
              className="block py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              Add Item
            </Link>
          </li>
          <li>
            <Link
              to="/adminpage/dashboard"
              className="block py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/adminpage/purchase-history"
              className="block py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              Purchase History
            </Link>
          </li>

          <li>
            <button
              onClick={handleListButtonClick}
              className="block w-full py-3 px-4 text-lg bg-blue-700 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:bg-blue-600"
            >
              {showCategorySelector ? 'Close' : 'Add  Items'}
            </button>
          </li>
        </ul>

        {/* Category Selector */}
        {showCategorySelector && (
          <div className="mt-6">
            <select
              className="block w-full border rounded-md p-3 mb-4 bg-white text-gray-800"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Select Item Type:</h2>
                <div className="grid grid-cols-2 gap-4">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeClick(type)}
                      className={`py-2 px-4 rounded-lg shadow-md transform transition-all duration-200 ${selectedType === type
                          ? 'bg-blue-700 text-white hover:scale-110'
                          : 'bg-blue-500 text-white hover:scale-105'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform ">
          <Outlet key={`${selectedCategory}-${selectedType}`} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
