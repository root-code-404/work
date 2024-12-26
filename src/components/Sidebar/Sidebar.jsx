import React, { useState } from "react";

const Sidebar = ({ categories, types, selectedCategory, onCategoryClick, onTypeClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-gray-800 text-white p-4 ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
      {/* Toggle Button for Mobile View */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md mb-4"
      >
        {isOpen ? "Close Menu" : "Open Menu"}
      </button>

      {/* Sidebar Content */}
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-lg font-bold mb-4">Menu</h2>

        {/* Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-2">
            <button
              className={`block w-full text-left py-2 px-4 rounded-lg ${selectedCategory === category
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
                }`}
              onClick={() => onCategoryClick(category)}
            >
              {category}
            </button>

            {/* Dropdown for Types */}
            {selectedCategory === category && (
              <div className="pl-4 mt-2">
                {types.length > 0 ? (
                  types.map((type) => (
                    <button
                      key={type}
                      className="block w-full text-left py-1 px-4 rounded-lg bg-green-600 hover:bg-green-500 mb-1"
                      onClick={() => onTypeClick(type)}
                    >
                      {type}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No types available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
