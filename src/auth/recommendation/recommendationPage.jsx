import React, { useEffect, useState } from 'react';
import axios from 'axios';

const recommendationPage = ({ itemCategory, itemType }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`/api/recommendations`, {
                    params: { itemCategory, itemType },
                });
                setRecommendations(response.data.recommendedItems);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [itemCategory, itemType]);

    if (loading) return <p>Loading recommendations...</p>;

    if (recommendations.length === 0) {
        return <p>No recommendations available for this category and type.</p>;
    }

    return (
        <div>
            <h2>Recommended Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                    <div key={item._id} className="p-4 border rounded shadow">
                        <img src={`/${item.image}`} alt={item.name} className="w-full h-48 object-cover" />
                        <h3 className="mt-2 text-lg font-bold">{item.name}</h3>
                        <p>{item.brand}</p>
                        <p>{item.price} {item.priceUnit}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default recommendationPage;
