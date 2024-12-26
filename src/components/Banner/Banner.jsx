import React from "react";
import BannerImg from "../../assets/women/women2.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div
            className="flex justify-center"
            data-aos="zoom-in"
          >
            <img
              src={BannerImg}
              alt="Winter Sale"
              className="rounded-md shadow-lg object-cover w-full max-w-sm"
            />
          </div>

          {/* Text Details Section */}
          <div>
            <div className="text-center md:text-left">
              <h1
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Winter Sale up to 50% Off
              </h1>
              <p
                data-aos="fade-up"
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
                reiciendis inventore iste ratione ex alias quis magni at optio.
              </p>

              {/* Icons and Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="flex items-center"
                  data-aos="fade-up"
                >
                  <GrSecure className="text-4xl h-12 w-12 shadow-sm p-3 rounded-full bg-violet-100 dark:bg-violet-400 mr-3" />
                  <p className="m-0 text-gray-800 dark:text-gray-100">
                    Quality Products
                  </p>
                </div>
                <div
                  className="flex items-center"
                  data-aos="fade-up"
                >
                  <IoFastFood className="text-4xl h-12 w-12 shadow-sm p-3 rounded-full bg-orange-100 dark:bg-orange-400 mr-3" />
                  <p className="m-0 text-gray-800 dark:text-gray-100">
                    Fast Delivery
                  </p>
                </div>
                <div
                  className="flex items-center"
                  data-aos="fade-up"
                >
                  <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-3 rounded-full bg-green-100 dark:bg-green-400 mr-3" />
                  <p className="m-0 text-gray-800 dark:text-gray-100">
                    Easy Payment Method
                  </p>
                </div>
                <div
                  className="flex items-center"
                  data-aos="fade-up"
                >
                  <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-3 rounded-full bg-yellow-100 dark:bg-yellow-400 mr-3" />
                  <p className="m-0 text-gray-800 dark:text-gray-100">
                    Get Offers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
