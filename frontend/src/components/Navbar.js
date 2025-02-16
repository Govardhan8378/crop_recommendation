import React from 'react';
import { Link } from 'react-scroll';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-10 w-full text-white bg-green-600 shadow-md">
      <div className="container flex justify-between p-4 mx-auto">
        <h1 className="text-2xl font-bold">AgriSmart</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="cropRecommendation" smooth={true} duration={500}>
              Crop Recommendation
            </Link>
          </li>
          <li>
            <Link to="marketPrice" smooth={true} duration={500}>
              Market Price Prediction
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
