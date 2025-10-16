import React from "react";
import { Link } from "react-router-dom";
import basketImg from "../assets/images/basket.png";

function Landing() {
  return (
    <>
      <div className="p-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-0">
            <div className="w-[25px] h-[25px] ml-[50px] mt-[15px] bg-green-600 rounded-full"></div>
            <div className="w-[25px] h-[25px] ml-[-15px] mt-[15px] rounded-full border-2 border-black"></div>
            <p className="mt-[15px] pl-[5px] font-semibold">Listify</p>
          </div>
          <div className="flex items-center gap-8 pr-10">
            <p className="cursor-pointer hover:text-green-600">Home</p>
            <p className="cursor-pointer hover:text-green-600">About</p>
          </div>
        </nav>

        {/* Content */}
        <div className="flex flex-row items-center justify-center mt-35 px-4 gap-12">
          <img src={basketImg} alt="Basket" className="w-142 h-auto mr-[250px]" />

          <div className="text-center max-w-sm mr-[240px]">
            <h2 className="font-sans text-lg font-">the</h2>
            <h1 className="font-bold text-xl">Grocery</h1>
            <h2 className="italic text-lg mb-4">Wishlist</h2>

            <p className="text-gray-600 mb-8">
              Grocery shopping has never been this easy. You will never forget
              what to buy.
            </p>

            {/* Buttons stacked with spacing */}
            <div className="flex flex-col items-center gap-8">
              <Link
                to="/signin"
                className="bg-green-600 text-white px-12 py-3 rounded-full hover:bg-green-700 transition w-64 text-center"
              >
                Sign In
              </Link>

              <p className="text-sm text-gray-500">
                Do not have a profile with us? Sign up below
              </p>

              <Link
                to="/signup"
                className="border border-green-600 text-green-600 px-12 py-3 rounded-full hover:bg-green-100 transition w-64 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
