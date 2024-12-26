import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemFormPage = () => {
  const [itemNo, setItemNo] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [features, setFeatures] = useState([]);
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();



  const renderCategoryForm = () => {
    switch (selectedCategory) {
      case "Vehicles":
        return <CarFormPage />;
      // Add cases for other categories
      case "Electronics":
        return <ElectronicsFormPage />;
      case "Furniture":
        return <FurnitureFormPage />;
      default:
        return <div>Please select a category to proceed.</div>;
    }
  };


  // Handle category change and adjust fields based on selected category
  const handleCategoryChange = (e) => {
    setItemCategory(e.target.value);
    setItemType('');  // Reset type when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      itemNo,
      itemName,
      itemCategory,
      itemType,
      itemBrand,
      itemQuantity: parseInt(itemQuantity),
     
      model,
    };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/items/add', newItem);
      alert('Item added successfully!');
      navigate(`/adminpage/item`);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Item Number */}
          <div>
            <label htmlFor="itemNo" className="block text-sm font-medium text-gray-700">Item Number</label>
            <input
              id="itemNo"
              type="text"
              value={itemNo}
              onChange={(e) => setItemNo(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Item Category */}
          <div>
            <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700">Item Category</label>
            <select
              id="itemCategory"
              value={itemCategory}
              onChange={handleCategoryChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Clothes">Clothes</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Beauty">Beauty</option>
              <option value="Other Accessories">Other Accessories</option>
            </select>
          </div>

          {/* Conditionally Render Item Type */}
          {itemCategory && (
            <div>
              <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">Item Type</label>
              <input
                id="itemType"
                type="text"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder={`Enter ${itemCategory} type`}
              />
            </div>
          )}

          {/* Item Brand */}
          <div>
            <label htmlFor="itemBrand" className="block text-sm font-medium text-gray-700">Item Brand</label>
            <input
              id="itemBrand"
              type="text"
              value={itemBrand}
              onChange={(e) => setItemBrand(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Item Quantity */}
          <div>
            <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700">Item Quantity</label>
            <input
              id="itemQuantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Uploading...' : 'Upload Item'}
        </button>
      </form>
      <div>{renderCategoryForm()}</div>
      </div>
    </div>
  );
};

export default ItemFormPage;
