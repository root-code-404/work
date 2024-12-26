import React, { useState, useEffect } from "react";

import Img1 from "../../../assets/women/women.png";
import Img2 from "../../../assets/women/women2.jpg";
import Img3 from "../../../assets/women/women3.jpg";
import Img4 from "../../../assets/women/women4.jpg";
const WomenListPage = () => {
    const cards = [
        { id: 1, country: "CA", img: Img1, price: "CA$150.00", flag: "🇨🇦", description: "Cozy sweater in purple." },
        { id: 2, country: "US", img: Img2, price: "$120.00", flag: "🇺🇸", description: "Casual shirt for summer." },
        { id: 3, country: "FR", img: Img3, price: "€110.00", flag: "🇫🇷", description: "Elegant French dress." },
        { id: 4, country: "BR", img: Img4, price: "R$200.00", flag: "🇧🇷", description: "Comfortable Brazilian top." },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Automatic rotation of cards
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        }, 3000); // Change card every 3 seconds
        return () => clearInterval(interval);
    }, [cards.length]);

    const currentCard = cards[currentIndex];

    return (
        <>
            <div className="text-center mb-10 max-w-lg mx-auto">
                <p data-aos="fade-up" className="text-sm text-primary">
                    Top Selling Bikes For You
                </p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">
                    Women
                </h1>
                <p data-aos="fade-up" className="text-sm text-gray-500">
                    Explore our collection of top-rated bikes loved by our customers.
                </p>
            </div>

        <div className="relative  text-white min-h-screen flex justify-center items-center">
            
            {/* Left Side Flags */}
            <div className="absolute left-48 top-1/2 transform -translate-y-1/2 space-y-4 ">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${index === currentIndex ? "bg-green-500" : "bg-gray-700"
                            }`}
                    >
                        {card.flag}
                    </div>
                ))}
            </div>

            {/* Card Carousel */}
            <div className="relative w-1/3 h-[200px] flex justify-center items-center">
                {cards.map((card, index) => {
                    // Calculate position
                    const position =
                        index === currentIndex
                            ? "z-10 scale-100 translate-x-0"
                            : index === (currentIndex - 1 + cards.length) % cards.length
                                ? "z-5 scale-90 -translate-x-20 opacity-50"
                                : "z-0 scale-90 translate-x-20 opacity-50";

                    return (
                        
                        <div
                            key={card.id}
                            className={`absolute w-[300px] h-[400px] bg-gray-800 rounded-lg shadow-lg transform transition-all duration-700 ease-in-out ${position}`}
                        >
                            <img
                                src={card.img}
                                alt={card.country}
                                className="w-full h-full rounded-lg"
                            />
                            {index === currentIndex && (
                                <div className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg">
                                    {card.country} - {card.price}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Details Box */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-[350px] bg-gray-800 text-white rounded-lg shadow-lg p-6 items-end">
                
                <h2 className="text-lg font-bold mb-2">Product Details</h2>
                <p className="text-sm mb-4">
                    <span className="font-semibold">Country:</span> {currentCard.country}
                </p>
                <p className="text-sm mb-4">
                    <span className="font-semibold">Description:</span> {currentCard.description}
                </p>
                <p className="text-sm mb-4">
                    <span className="font-semibold">Price:</span> {currentCard.price}
                </p>
                <div className="flex justify-between">
                    <button className="bg-green-500 px-4 py-2 rounded-md text-white shadow-md hover:bg-green-600">
                        Buy Now
                    </button>
                    
                </div>
            </div>
        </div>
        </>
    );
};

export default WomenListPage;
