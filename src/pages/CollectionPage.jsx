// CollectionPage.jsx
import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CarListPage from '../auth/CarListPage';

const cars = [
  {
    name: 'Tesla Model S',
    description: 'An electric luxury sedan with cutting-edge technology.',
    features: ['Electric', 'Autopilot', 'Luxury'],
    image: '/tesla-model-s.jpg',
    link: 'https://github.com/example/car-collection'
  },
  // Add more car data here
];

const CollectionPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <CarListPage/>
     
      <Container>
        <h2 className="text-3xl text-yellow-500 text-center font-bold mb-8">Car Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <Card key={index} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
              <Card.Img variant="top" src={car.image} className="object-cover h-48" />
              <Card.Body>
                <Card.Title className="text-yellow-400">{car.name}</Card.Title>
                <Card.Text>{car.description}</Card.Text>
                <div className="flex flex-wrap gap-2 mt-3">
                  {car.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-yellow-300 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline-light"
                  className="mt-4 w-full"
                  href={car.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Link
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/upload" className="btn btn-primary">
            Add New Car
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default CollectionPage;
