import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const SingleCarPage = () => {
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

    fetchUserData();
  }, [token, navigate]);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };
    fetchCarDetails();
  }, [id]);

  // Handle edit
  const handleEditClick = () => navigate(`/edit/${id}`);

  // Handle delete
  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/adminpage/list');
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!user) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { carId: car._id, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Car added to cart!');
      console.log('Cart response:', response.data);
    } catch (error) {
      console.error('Error adding car to cart:', error);
      alert('Failed to add the car to the cart.');
    }
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!user) {
      alert('You must be logged in to make a purchase.');
      return;
    }

    const purchaseData = { carId: car._id, userId: user._id };
    navigate(`/purchase/${purchaseData.carId}`);
  };

  // Render loading state
  if (!car) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6 shadow-lg rounded-lg max-w-lg mx-auto">
        <Card.Img
          variant="top"
          src={`http://localhost:5000/${car.carImage}`}
          alt={`${car.itemBrand} ${car.itemName}`}
          className="w-full h-auto object-contain rounded-lg mb-6"
        />
        <Card.Body>
          <Card.Title className="text-3xl font-bold text-gray-900">
            {car.brand} {car.model}
          </Card.Title>
          <Card.Text className="text-xl text-gray-700">Year: {car.year}</Card.Text>
          <Card.Text className="text-xl text-gray-700">
            Price: <span className="font-semibold">${car.price}</span>
          </Card.Text>
          <Card.Text className="text-lg text-gray-700 mb-4">Description: {car.description}</Card.Text>
          <Card.Text className="text-lg text-gray-700 mb-4">Features: {car.features}</Card.Text>

          <div className="flex justify-between mt-6">
            {user?.userType === 0 && (
              <>
                <Button variant="primary" onClick={handleEditClick}>
                  Edit Car
                </Button>
                <Button variant="danger" onClick={handleDeleteClick}>
                  Delete Car
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
              <Button variant="warning" onClick={() => alert('You can review or report this car!')}>
                Review/Report
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SingleCarPage;
