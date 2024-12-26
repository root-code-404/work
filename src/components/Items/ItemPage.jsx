import React from "react";

import { Button } from "react-bootstrap";

import TopProducts from "../TopProducts/TopProducts";
import Products from "../Products/Products";
import CarListPage from "../../auth/vehicles/car/CarListPage";

import BikeListPage from "../../auth/vehicles/bike/BikeListPage";
import MenListPage from "../../auth/clothes/men/MenListPage";
import WomenListPage from "../../auth/clothes/women/WomenListPage";

const ItemPage = () => {
 


  return (
    <div className="container mx-auto py-12">
      {/* Car Section with Heading */}
      <div className="mb-10">
    
        <CarListPage/>
        <BikeListPage />
        <MenListPage/>
        <WomenListPage/>

        {/* <ItemListPage/> */}

        {/* View All Button for Cars */}
        <div className="flex justify-center mt-6">
          <Button className="bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-primary-dark transition">
            View All Cars
          </Button>
        </div>
      </div>

      {/* Product Section with Heading */}
      <div className="mb-10">
        <Products/>
        {/* View All Button for Products */}
        <div className="flex justify-center mt-6">
          <Button className="bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-primary-dark transition">
              View All Products
          </Button>
        </div>
      </div>
      {/* Product Section with Heading */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-600 text-center mb-6">
        Products
        </h2>
        <TopProducts/>
        {/* View All Button for Products */}
        <div className="flex justify-center mt-6">
          <Button className="bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-primary-dark transition">
              View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
