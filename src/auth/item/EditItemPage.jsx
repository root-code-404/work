import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditItemPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams(); // Get item ID from URL params
  const [itemDetails, setItemDetails] = useState([]);

  // Fetch item details


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/items/${itemId}`
        );
        setItemDetails(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
        alert("Error fetching item details!");
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Exclude _id from the update payload
      const { _id, ...updates } = itemDetails;

      // Update the item
      const itemResponse = await axios.put(
        `http://localhost:5000/api/items/${itemId}`,
        updates
      );

      console.log("Item updated successfully:", itemResponse.data);
      alert("Item updated successfully!");
      navigate("/adminpage/dashboard");
    } catch (error) {
      console.error("Error updating item:", error);
      alert(`Failed to update item: ${error.response?.data?.message || error.message}`);
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Item</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-2">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={itemDetails.itemName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Brand</label>
          <input
            type="text"
            name="itemBrand"
            value={itemDetails.itemBrand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            name="itemQuantity"
            value={itemDetails.itemQuantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Model</label>
          <input
            type="text"
            name="model"
            value={itemDetails.model}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditItemPage;
