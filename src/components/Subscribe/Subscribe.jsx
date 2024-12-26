import React from "react";
import Banner from "../../assets/website/orange-pattern.jpg";

const Subscribe = () => {
  return (
    <div
      className="relative mb-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      <div className="backdrop-blur-md bg-black/50 py-10">
        <div className="container mx-auto text-center max-w-xl">
          <h1 className="text-3xl font-bold text-white">
            Get Notified About New Products
          </h1>
          <p className="text-gray-300 my-4">
            Subscribe to our newsletter and stay updated with the latest trends and offers.
          </p>
          <div className="mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
