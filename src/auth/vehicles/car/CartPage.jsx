import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  console.log(cartItems);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Item removed from cart:', response.data);
      // Fetch the updated cart items
      const updatedCartResponse = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(updatedCartResponse.data);
    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data || error.message);
    }
  };

  const handlePurchase = (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to purchase items.');
      navigate('/login');
      return;
    }

    // Fetch user ID to pass to the purchase page
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      const userId = response.data._id;
      navigate(`/purchase/${itemId}`, { state: { itemId, userId } });
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });
  };

  if (loading) return <div>Loading your cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty!</h2>
        <p className="text-gray-600 mb-4">
          Looks like you haven't added any cars to your cart yet.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <Card key={item.itemId} className="shadow-lg rounded-lg p-4">
            <Card.Img
              variant="top"
              src={`http://localhost:5000/${item.itemImage}`}
              alt={`${item.brand} ${item.model}`}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Card.Body>
              <Card.Title className="text-xl font-semibold">
                {item.brand} {item.model}
              </Card.Title>
              <Card.Text className="text-gray-700">Year: {item.year}</Card.Text>
              <Card.Text className="text-gray-700">Price: ${item.price}</Card.Text>
              <Card.Text className="text-gray-700">User Email: {item.userEmail}</Card.Text>
              <Button
                variant="danger"
                onClick={() => handleRemoveFromCart(item.itemId)}
                className="mt-3 px-4 py-2"
              >
                Remove
              </Button>
              <Button
                variant="success"
                onClick={() => handlePurchase(item.itemId)}
                className="mt-3 ml-3 px-4 py-2"
              >
                Purchase
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
