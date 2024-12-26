import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState("");
    const [itemPurchase, setItemPurchase] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null); // Track the selected item's ID


    const fetchPurchaseHistory = async (page) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/history?page=${page}&limit=10`
            );
            const { purchases, totalPages, currentPage } = response.data;
            setPurchases(purchases);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
        } catch (error) {
            console.error("Error fetchIng purchase history:", error.message);
        }
    };

    const fetchItemPurchase = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/user/${userId}`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(response.data.email);
            console.log(userId)

        } catch (error) {
            console.error("Error fetchIng user purchases:", error.message);
        }
    };
    const fetchCategoryPurchases = async (itemCategory) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/category/${itemCategory}`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(`itemCategory: ${itemCategory}`); // Update modal title
        } catch (error) {
            console.error("Error fetching category purchases:", error.message);
        }
    };
    const fetchBrandPurchases = async (itemTypeId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/itemBrand/${itemTypeId}`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(`itemBrand: ${itemTypeId}`); 
            console.log(selectedUser)// Update modal title
            console.log(itemTypeId)// Update modal title

        } catch (error) {
            console.error("Error fetching category purchases:", error.message);
        }
    };
    const fetchNamePurchases = async (itemTypeId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/itemName/${itemTypeId}`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(`itemName: ${itemTypeId}`);
            console.log(selectedUser)// Update modal title
            console.log(itemTypeId)// Update modal title

        } catch (error) {
            console.error("Error fetching category purchases:", error.message);
        }
    };
    const fetchItemTypePurchases = async (itemType) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/itemType/${itemType}?page=1&limit=5`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(`itemType: ${itemType}`);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching category purchases:", error.message);
        }
    };


    const fetchModelPurchases = async (itemTypeId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/purchases/model/${itemTypeId}`
            );
            setItemPurchase(response.data.purchases);
            setSelectedUser(`model: ${itemTypeId}`);
            console.log(selectedUser)// Update modal title
            console.log(itemTypeId)// Update modal title

        } catch (error) {
            console.error("Error fetching category purchases:", error.message);
        }
    };


    
console.log(itemPurchase)
    const handleViewButtonClick = (purchase) => {
        if (filter === "userDetails") {
            fetchItemPurchase(purchase.userId._id); // Fetch user's purchases
        } else if (filter === "itemCategory") {
            fetchCategoryPurchases(purchase.itemTypeId.itemCategory); // Fetch category-specific purchases
        }
        else if (filter === "itemBrand") {
            fetchBrandPurchases(purchase.itemTypeId._id); // Fetch category-specific purchases
        }
        else if (filter === "itemName") {
            fetchNamePurchases(purchase.itemTypeId._id); // Fetch category-specific purchases
        }
        else if (filter === "itemType") {
            fetchItemTypePurchases(purchase.itemTypeId.itemType); // Fetch category-specific purchases
        }
        else if (filter === "model") {
            fetchModelPurchases(purchase.itemTypeId._id); // Fetch category-specific purchases
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setItemPurchase([]);
        setSelectedUser(null);
        setSelectedItemDetails(null);  // Reset item details on filter change
        setCurrentPage(1);
    };

    const removeDuplicates = (array, keyGetter) => {
        const seen = new Set();
        return array.filter((item) => {
            const key = keyGetter(item);
            if (seen.has(key)) {
                return false;
            } else {
                seen.add(key);
                return true;
            }
        });
    };

    const getKeyForFilter = (purchase, filter) => {
        switch (filter) {
            case "userDetails":
                return purchase.userId?._id;
            case "itemCategory":
                return purchase.itemTypeId?.itemCategory;
            case "itemType":
                return purchase.itemTypeId?.itemType;
            case "itemBrand":
                return purchase.itemTypeId?.itemBrand;
            case "itemName":
                return purchase.itemTypeId?.itemName;
            case "model":
                return purchase.itemTypeId?.model;
            default:
                return purchase._id;
        }
    };

    const getTableHeaders = () => {
        switch (filter) {
            case "userDetails":
                return ["#", "User Name", "Email", "Date", "Action"];
            case "itemCategory":
                return ["#", "Category", "Action"];
            case "itemType":
                return ["#", "Item Type", "Action"];
            case "itemBrand":
                return ["#", "Brand", "Action"];
            case "itemName":
                return ["#", "Item Name", "Action"];
            case "model":
                return ["#", "Model", "Action"];
            default:
                return [
                    "#",
                    "User Name",
                    "Email",
                    "Item Name",
                    "Brand",
                    "Category",
                    "Item Type",
                    "Model",
                    "Price",
                    "Date",
                ];
        }
    };

    const getTableData = (purchase) => {
        const getValueOrDefault = (value, defaultValue = "No data") =>
            value ? value : defaultValue;

        switch (filter) {
            case "userDetails":
                return [
                    getValueOrDefault(purchase.userId?.name),
                    getValueOrDefault(purchase.userId?.email),
                    new Date(purchase.createdAt).toLocaleDateString(),
                ];
            case "itemCategory":
                return [getValueOrDefault(purchase.itemTypeId?.itemCategory)];
            case "itemBrand":
                return [getValueOrDefault(purchase.itemTypeId?.itemBrand)];
            case "itemName":
                return [getValueOrDefault(purchase.itemTypeId?.itemName)];
            case "itemType":
                return [getValueOrDefault(purchase.itemTypeId?.itemType)];
            case "model":
                return [getValueOrDefault(purchase.itemTypeId?.model)];
            default:
                return [
                    getValueOrDefault(purchase.userId?.name),
                    getValueOrDefault(purchase.userId?.email),
                    getValueOrDefault(purchase.itemTypeId?.itemName),
                    getValueOrDefault(purchase.itemTypeId?.itemBrand),
                    getValueOrDefault(purchase.itemTypeId?.itemCategory),
                    getValueOrDefault(purchase.itemTypeId?.itemType),
                    getValueOrDefault(purchase.itemTypeId?.model),
                    `$${getValueOrDefault(purchase.itemTypeId?.price)}`,
                    getValueOrDefault(purchase.itemTypeId?.description),
                ];
        }
    };

    useEffect(() => {
        fetchPurchaseHistory(currentPage);
    }, [currentPage, filter]);

    const filteredPurchases = removeDuplicates(purchases, (purchase) =>
        getKeyForFilter(purchase, filter)
    );
    const handleItemClick = (purchaseId) => {
        setSelectedItemId(purchaseId); // Set the selected item's ID
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                {[{ label: "User Details", value: "userDetails" }, { label: "Category", value: "itemCategory" }, { label: "Item Type", value: "itemType" }, { label: "Brand", value: "itemBrand" }, { label: "Item Name", value: "itemName" }, { label: "Model", value: "model" }, { label: "All Purchases", value: "" }].map((btn) => (
                    <button
                        key={btn.value}
                        className={`py-2 px-4 ${filter === btn.value ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800"}`}
                        onClick={() => handleFilterChange(btn.value)}
                        disabled={filter === btn.value}
                    >
                        {btn.label}
                    </button>

                ))}
            </div>

            {/* Display User's Purchases if selected */}
            {itemPurchase && (
                <div className="mb-6">
                    
                    {itemPurchase.map((purchase) => (
                        <div key={purchase._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                            <div onClick={() => handleItemClick(purchase._id)} className="cursor-pointer">
                                <p>User: {purchase.userId.name}</p>
                                <p>Item: {purchase.itemTypeId?.itemName}</p>
                                <p>Quantity: {purchase.quantity}</p>
                                <p>Purchase Date: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                            </div>

                            {/* Render the item details below the clicked item */}
                            {selectedItemId === purchase._id && (
                                <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Item Details</h3>
                                    <p><strong>Category:</strong> {purchase.itemTypeId?.itemCategory}</p>
                                    <p><strong>Item Type:</strong> {purchase.itemTypeId?.itemType}</p>
                                    <p><strong>Item Brand:</strong> {purchase.itemTypeId?.itemBrand}</p>
                                    <p><strong>Item Name:</strong> {purchase.itemTypeId?.itemName}</p>
                                    <p><strong>Quantity:</strong> {purchase.quantity}</p>
                                    <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                    <p><strong>Price:</strong> ${purchase.itemTypeId?.price}</p>
                                    {/* Add more fields here as necessary */}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    
                </div>
            )}

            <table className="table-auto w-full border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        {getTableHeaders().map((header) => (
                            <th key={header} className="px-4 py-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredPurchases.length === 0 && (
                        <tr>
                            <td colSpan={getTableHeaders().length} className="text-center">
                                No purchases found.
                            </td>
                        </tr>
                    )}
                    {filteredPurchases.map((purchase, idx) => (
                        <tr key={purchase._id}>
                            <td className="px-4 py-2">{idx + 1}</td>
                            {getTableData(purchase).map((data, i) => (
                                <td key={i} className="px-4 py-2">{data}</td>
                            ))}
                            {filter  && (
                                <td className="px-4 py-2">
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={()=>handleViewButtonClick(purchase)}
                                    >
                                        View
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* User Purchase Details Modal */}
            {/* {itemPurchase.length > 0 && (
                <div className="modal fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-xl font-semibold mb-4">{selectedUser} Purchases</h2>
                        <ul>
                            {itemPurchase.map((purchase) => (
                                <li key={purchase._id} className="mb-4">
                                    <p className="font-semibold">
                                        Item: {purchase.itemTypeId?.itemName || "Unknown Item"}
                                    </p>
                                    <p>
                                        Amount: {purchase.itemTypeId?.price} | Bill Number: {purchase.userId.name}
                                    </p>
                                    <p>
                                        Date: {new Date(purchase.date).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => {
                                setSelectedUser(null); // Close the modal
                                setItemPurchase([]); // Reset user purchases
                            }}
                            className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )} */}


            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-200"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PurchaseHistory;
