import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PurchasePage = () => {
  const [itemDetails, setItemDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { Id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const itemResponse = await axios.get(`http://localhost:5000/api/itemtype/${Id}`);
        setItemDetails(itemResponse.data);

        const userResponse = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(userResponse.data);

        if (itemResponse.data?.itemBrand) {
          fetchRecommendedItems(itemResponse.data.itemBrand);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [Id, token]);

  const fetchRecommendedItems = async (brand) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/itemtype/recommendations?itemBrand=${brand}`
      );
      setRecommendedItems(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const handlePurchaseConfirmation = async () => {
    if (!userDetails) {
      alert("You must be logged in to make a purchase.");
      return;
    }

    if (itemDetails.item?.itemQuantity <= 0) {
      alert("Item is out of stock.");
      return;
    }

    const purchaseData = {
      userId: userDetails._id,
      itemId: itemDetails.item.itemId,
      quantity: quantity,
      itemTypeId: itemDetails.item._id,
      itemType: itemDetails.item.itemType,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/purchase", purchaseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Purchase successful!");
        navigate("/purchase-success");
      }
    } catch (error) {
      console.error("Error making purchase:", error);
      alert("There was an error with your purchase. Please try again.");
    }
  };

  const handleAddToWishlist = () => {
    if (!wishlist.some((item) => item._id === itemDetails._id)) {
      setWishlist([...wishlist, itemDetails]);
      alert("Added to wishlist!");
    } else {
      alert("Item already in wishlist.");
    }
  };

  if (!itemDetails || !userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow sticky top-0 z-10 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">ItemShop</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/wishlist")}
        >
          Wishlist ({wishlist.length})
        </button>
      </header>

      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded p-4">
          <img
            src={itemDetails.item?.itemImage ? `http://localhost:5000/${itemDetails.item.itemImage}` : "default-image.png"}
            alt={itemDetails.item?.itemBrand || "Unknown Brand"}
            className="w-full h-64 object-contain rounded"
          />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {itemDetails.item?.itemBrand || "Unknown Brand"} {itemDetails.item?.itemName || "Unknown Item"}
          </h2>
          <p className="text-gray-600">Year: {itemDetails.item?.year || "Unknown Year"}</p>
          <p className="text-green-600 text-xl font-bold">
            Price: ${itemDetails.item?.price || "N/A"}
          </p>

          {itemDetails.item?.itemQuantity > 0 ? (
            <div className="mt-4">
              <label className="block text-gray-700">Quantity</label>
              <select
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded p-2 w-full mt-2"
              >
                {[...Array(itemDetails.item.itemQuantity).keys()].map((num) => (
                  <option key={num} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-red-600 mt-2">Out of Stock</p>
          )}

          <button
            onClick={handlePurchaseConfirmation}
            disabled={itemDetails.item?.itemQuantity === 0 || loading}
            className="bg-blue-500 text-white w-full py-2 mt-4 rounded hover:bg-blue-600"
          >
            {loading ? "Processing..." : "Confirm Purchase"}
          </button>

          <button
            onClick={handleAddToWishlist}
            className="bg-gray-200 w-full py-2 mt-2 rounded hover:bg-gray-300"
          >
            Add to Wishlist
          </button>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-bold text-gray-800">Recommended items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {recommendedItems.map((item) => (
              <div
                key={item._id}
                className="p-4 border border-gray-200 rounded shadow-sm cursor-pointer"
                onClick={() => navigate(`/purchase/${item._id}`)}
              >
                <img
                  src={item.itemImage ? `http://localhost:5000/${item.itemImage}` : "default-image.png"}
                  alt={item.itemBrand || "Unknown Brand"}
                  className="w-full h-32 object-contain rounded"
                />
                <h4 className="text-lg font-semibold text-gray-800 mt-2">
                  {item.itemBrand || "Unknown Brand"} {item.itemName || "Unknown Item"}
                </h4>
                <p className="text-gray-600">{item.year || "Unknown Year"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
