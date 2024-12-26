import React, { useState } from "react";
import axios from "axios";

const UserPurchaseDetails = ({ userId }) => {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserPurchases = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/purchases/user/${userId}`, {
                params: { page: 1, limit: 5 },
            });
            setPurchases(response.data.purchases);
        } catch (err) {
            setError("Failed to fetch purchase details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-md">
            <button
                onClick={fetchUserPurchases}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                View Purchases
            </button>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {purchases.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Purchase Details:</h3>
                    <ul className="space-y-4">
                        {purchases.map((purchase) => (
                            <li
                                key={purchase._id}
                                className="p-4 border rounded shadow-sm bg-gray-100"
                            >
                                <p>
                                    <strong>Item Type:</strong> {purchase.itemType}
                                </p>
                                <p>
                                    <strong>Model:</strong> {purchase.itemId?.model || "N/A"}
                                </p>
                                <p>
                                    <strong>Brand:</strong> {purchase.itemTypeId?.itemBrand || "N/A"}
                                </p>
                                <p>
                                    <strong>Category:</strong> {purchase.itemTypeId?.itemCategory || "N/A"}
                                </p>
                                <p>
                                    <strong>Price:</strong> ${purchase.itemTypeId?.price || "N/A"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {purchases.length === 0 && !isLoading && !error && (
                <p>No purchases found for this user.</p>
            )}
        </div>
    );
};

export default UserPurchaseDetails;
