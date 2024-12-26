import React from "react";
import Img1 from "../../assets/women/women.png";
import Img2 from "../../assets/women/women2.jpg";
import Img3 from "../../assets/women/women3.jpg";
import Img4 from "../../assets/women/women4.jpg";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  { id: 1, img: Img1, title: "Women Ethnic", rating: 5.0, color: "White", aosDelay: "0" },
  { id: 2, img: Img2, title: "Women Western", rating: 4.5, color: "Red", aosDelay: "200" },
  { id: 3, img: Img3, title: "Goggles", rating: 4.7, color: "Brown", aosDelay: "400" },
  { id: 4, img: Img4, title: "Printed T-Shirt", rating: 4.4, color: "Yellow", aosDelay: "600" },
  { id: 5, img: Img2, title: "Fashion T-Shirt", rating: 4.5, color: "Pink", aosDelay: "800" },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        <div className="text-center mb-10 max-w-lg mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products For You
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-500">
            Explore our collection of top-rated products loved by our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center ease-in">
          {ProductsData.map((product) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={product.aosDelay}
              className="space-y-3 bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <img
                src={product.img}
                alt={product.title} // Added alt for accessibility
                className="h-[220px] w-[150px] object-cover rounded-md mx-auto"
              />
              <div className="text-center">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.color}</p>
                <div className="flex justify-center items-center gap-1 text-yellow-400">
                  <FaStar />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-primary-dark transition">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};


export default Products;
