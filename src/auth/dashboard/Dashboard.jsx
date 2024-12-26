import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/sidebar";

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [brands, setBrands] = useState([]);
  const [brandItems, setBrandItems] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items/categories/all");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/items/categories/${category}/types`
      );
      setSelectedCategory(category);
      setTypes(response.data);
      setItems([]);
      setSelectedType(null);
      setBrands([]);
      setBrandItems([]);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleTypeClick = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${type}/items`
      );
      const fetchedItems = response.data;
      const uniqueBrands = [...new Set(fetchedItems.map((item) => item.itemBrand))];

      setSelectedType(type);
      setItems(fetchedItems);
      setBrands(uniqueBrands);
      setBrandItems([]);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleBrandClick = async (brand) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/brands/${brand}`
      );
      setBrandItems(response.data);
    } catch (error) {
      console.error("Error fetching brand items:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`);
      setBrandItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        categories={categories}
        types={types}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onTypeClick={handleTypeClick}
      />

      <div className="w-3/4 p-4">
        {selectedType ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Brands in {selectedCategory} - {selectedType}
            </h2>
            <div className="mb-4 flex gap-4">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <button
                    key={brand}
                    className="bg-gray-200 py-1 px-3 rounded hover:bg-gray-300"
                    onClick={() => handleBrandClick(brand)}
                  >
                    {brand}
                  </button>
                ))
              ) : (
                <p>No brands found for this type.</p>
              )}
            </div>

            <div>
              {brandItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 border rounded-lg bg-white shadow"
                    >
                      <h3 className="text-lg font-semibold">{item.itemName}</h3>
                      <p>Brand: {item.itemBrand}</p>
                      <p>Quantity: {item.itemQuantity}</p>
                      <p>Model: {item.model}</p>

                      <div className="mt-2">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                          onClick={() => navigate(`/edit-item/${item._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items found for the selected brand.</p>
              )}
            </div>
          </div>
        ) : selectedCategory ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Select a type in {selectedCategory}
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <p>Select a category from the sidebar to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;