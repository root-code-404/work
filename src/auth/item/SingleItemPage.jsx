import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const SingleItemPage = () => {
    const [user, setUser] = useState(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { itemTypeId } = useParams(); // Get itemTypeId from URL params
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Fetch item details
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/itemtype/${itemTypeId}`);
                setItem(response.data.item); // Ensure this correctly matches the returned data structure
            } catch (err) {
                setError('Failed to load item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemTypeId]);


    // Fetch user profile
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                console.error('No token found. Redirecting to login.');
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response?.status === 401) {
                    alert('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, navigate]);

    if (loading) return <div className="loader">Loading item...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!item) return <div>No item found!</div>;

    // Handle edit
    const handleEditClick = () => navigate(`/edit/${item._id}`);


    // Handle delete
    const handleDeleteClick = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${item._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/adminpage/list');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert('You must be logged in to add items to the cart.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/cart',
                { itemTypeId: item._id, userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Item added to cart!');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add the item to the cart.');
        }
    };

    // Handle purchase
    const handlePurchase = () => {
        if (!user) {
            alert('You must be logged in to make a purchase.');
            return;
        }

        navigate(`/purchase/${item._id}`);
    };

    return (
        <div className="container mx-auto p-8">
            <Card className="p-6 shadow-lg rounded-lg max-w-lg mx-auto">
                <Card.Img
                    variant="top"
                    src={`http://localhost:5000/${item.itemImage}`}
                    alt={`${item.itemBrand} ${item.itemName}`}
                    className="w-full h-auto object-contain rounded-lg mb-6"
                />
                <Card.Body>
                    <Card.Title className="text-3xl font-bold text-gray-900">
                        {item.itemBrand} {item.itemName}
                    </Card.Title>
                    <Card.Text className="text-xl text-gray-700">Year: {item.year}</Card.Text>
                    <Card.Text className="text-xl text-gray-700">
                        Price: <span className="font-semibold">${item.price}</span>
                    </Card.Text>
                    <Card.Text className="text-lg text-gray-700 mb-4">Description: {item.description}</Card.Text>
                    <Card.Text className="text-lg text-gray-700 mb-4">Features: {item.features}</Card.Text>

                    <div className="flex justify-between mt-6">
                        {user?.userType === 0 && (
                            <>
                                <Button variant="primary" onClick={handleEditClick}>
                                    Edit Item
                                </Button>
                                <Button variant="danger" onClick={handleDeleteClick}>
                                    Delete Item
                                </Button>
                            </>
                        )}
                        {user?.userType === 1 && (
                            <>
                                <Button variant="info" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                                <Button variant="info" onClick={handlePurchase}>
                                    Purchase
                                </Button>
                            </>
                        )}
                        {user?.userType === 2 && (
                            <Button variant="warning" onClick={() => alert('You can review or report this item!')}>
                                Review/Report
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SingleItemPage;
