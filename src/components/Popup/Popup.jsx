import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const Popup = ({ orderPopup, setOrderPopup }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Details:", formData);
    alert("Order placed successfully!");
    setFormData({ name: "", email: "", address: "" });
    setOrderPopup(false);
  };

  return (
    <>
      {orderPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-md p-6 w-[90%] max-w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Order Now</h1>
              <IoCloseOutline
                className="text-2xl cursor-pointer hover:text-gray-500"
                onClick={() => setOrderPopup(false)}
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary"
                required
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary resize-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-300 text-white py-2 rounded-lg"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
