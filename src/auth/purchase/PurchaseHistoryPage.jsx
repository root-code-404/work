import { useEffect, useState } from 'react';
import axios from 'axios';

const PurchaseHistoryPage = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/purchase/all');
                setPurchaseHistory(response.data);
            } catch (error) {
                console.error('Error fetching purchase history:', error);
            }
        };

        fetchPurchaseHistory();
    }, []);
    

    return (
        <div>
            <h1>Purchase History</h1>
            {purchaseHistory.length === 0 ? (
                <p>No purchases found</p>
            ) : (
                <ul>
                    {purchaseHistory.map((purchase) => (
                        <li key={purchase._id}>
                            <p>User: {purchase.userId?.name || 'Unknown User'} ({purchase.userId?.email || 'No email'})</p>
                            <p>Item: {purchase.itemTypeId?.price || 'Unknown Item'} (Brand: {purchase.itemId?.model || 'N/A'}, Price: ${purchase.itemId?.price || 'N/A'})</p>
                            <p>Item Type: {purchase.itemTypeId?.itemName || 'Unknown Type'} (Category: {purchase.itemTypeId?.ItemCategory || 'N/A'})</p>
                            <p>Amount: {purchase.amount}</p>
                            <p>Bill Number: {purchase.billNumber}</p>
                            <p>Date: {new Date(purchase.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PurchaseHistoryPage;
