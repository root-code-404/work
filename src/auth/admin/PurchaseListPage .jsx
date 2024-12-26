import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseListPage = () => {
    const [userDetails, setUserDetails] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [itemsByCategory, setItemsByCategory] = useState([]);
    const [itemsByType, setItemsByType] = useState([]);
    const [itemsByBrand, setItemsByBrand] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [userId, setUserId] = useState(""); // Assume you get the userId dynamically
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");

    useEffect(() => {
        // Fetch purchase history on initial load
        fetchPurchaseHistory();
    }, []);

    const fetchPurchaseHistory = async () => {
        try {
            const res = await axios.get("/api/purchases");
            setPurchaseHistory(res.data);
        } catch (error) {
            console.error("Error fetching purchase history:", error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const res = await axios.get(`/api/purchases/userdetails/${userId}`);
            setUserDetails(res.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const fetchItemsByCategory = async (category) => {
        try {
            const res = await axios.get(`/api/purchases/items/category/${category}`);
            setItemsByCategory(res.data);
        } catch (error) {
            console.error("Error fetching items by category:", error);
        }
    };

    const fetchItemsByType = async (type) => {
        try {
            const res = await axios.get(`/api/purchases/items/type/${type}`);
            setItemsByType(res.data);
        } catch (error) {
            console.error("Error fetching items by type:", error);
        }
    };

    const fetchItemsByBrand = async (brand) => {
        try {
            const res = await axios.get(`/api/purchases/items/brand/${brand}`);
            setItemsByBrand(res.data);
        } catch (error) {
            console.error("Error fetching items by brand:", error);
        }
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    return (
        <div className="flex">
            <div className="w-1/4 bg-gray-200 p-4">
                <button
                    onClick={() => handleFilterChange("userDetails")}
                    className="w-full py-2 bg-blue-500 text-white mb-2"
                >
                    User Details
                </button>
                <button
                    onClick={() => handleFilterChange("purchaseHistory")}
                    className="w-full py-2 bg-blue-500 text-white mb-2"
                >
                    Purchase History
                </button>
                <button
                    onClick={() => handleFilterChange("itemCategory")}
                    className="w-full py-2 bg-blue-500 text-white mb-2"
                >
                    Item Category
                </button>
                <button
                    onClick={() => handleFilterChange("itemType")}
                    className="w-full py-2 bg-blue-500 text-white mb-2"
                >
                    Item Type
                </button>
                <button
                    onClick={() => handleFilterChange("itemBrand")}
                    className="w-full py-2 bg-blue-500 text-white"
                >
                    Item Brand
                </button>
            </div>

            <div className="w-3/4 p-4">
                {selectedFilter === "userDetails" && userDetails && (
                    <div>
                        <h2>User Details</h2>
                        <pre>{JSON.stringify(userDetails, null, 2)}</pre>
                    </div>
                )}

                {selectedFilter === "purchaseHistory" && purchaseHistory && (
                    <div>
                        <h2>Purchase History</h2>
                        <pre>{JSON.stringify(purchaseHistory, null, 2)}</pre>
                    </div>
                )}

                {selectedFilter === "itemCategory" && itemsByCategory && (
                    <div>
                        <h2>Items by Category</h2>
                        <select onChange={(e) => fetchItemsByCategory(e.target.value)}>
                            <option value="cars">Cars</option>
                            <option value="bikes">Bikes</option>
                        </select>
                        <pre>{JSON.stringify(itemsByCategory, null, 2)}</pre>
                    </div>
                )}

                {selectedFilter === "itemType" && itemsByType && (
                    <div>
                        <h2>Items by Type</h2>
                        <select onChange={(e) => fetchItemsByType(e.target.value)}>
                            <option value="sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                        </select>
                        <pre>{JSON.stringify(itemsByType, null, 2)}</pre>
                    </div>
                )}

                {selectedFilter === "itemBrand" && itemsByBrand && (
                    <div>
                        <h2>Items by Brand</h2>
                        <select onChange={(e) => fetchItemsByBrand(e.target.value)}>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                        </select>
                        <pre>{JSON.stringify(itemsByBrand, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseListPage;
