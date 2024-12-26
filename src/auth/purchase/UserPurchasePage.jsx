import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPurchasePage = () => {
    const [user, setUser] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null); // Track the selected item's ID
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);

                // Fetch purchases based on the user ID
                const purchaseResponse = await axios.get(
                    `http://localhost:5000/api/purchases/user/${response.data._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log(purchaseResponse.data); // Log the full response

                // Set the purchases state with the correct data
                if (purchaseResponse.data && Array.isArray(purchaseResponse.data.purchases)) {
                    setPurchases(purchaseResponse.data.purchases);
                } else {
                    setPurchases([]); // If the data is not in the expected format, set an empty array
                }
            } catch (error) {
                console.error('Error fetching profile or purchases:', error);
            }
        };

        fetchUserData();
    }, [token]);

    const handleItemClick = (purchaseId) => {
        setSelectedItemId(purchaseId); // Set the selected item's ID
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchased Items</h2>
            {user ? <p>Welcome, {user.name}!</p> : <p>Loading user information...</p>}

            <p className="text-gray-600">
                Here you can view the details of your purchased items.
            </p>

            {/* Render the purchases if the array is not empty */}
            {purchases && purchases.length > 0 ? (
                <div>
                    {purchases.map((purchase) => (
                        <div key={purchase._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                            <div onClick={() => handleItemClick(purchase._id)} className="cursor-pointer">
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
            ) : (
                <p>No purchases found.</p>
            )}
        </div>
    );
};

export default UserPurchasePage;
