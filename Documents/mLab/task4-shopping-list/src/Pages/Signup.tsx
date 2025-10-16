import React from "react";
import icon from "../assets/images/list.jpg";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center mb-6">
          {/* Illustration: Replace with your SVG or image URL */}
          <img className="w-50" src={icon} />
        </div>
        <h2 className="text-center text-gray-600 mb-2">
          Fill in the fields below to create an account
        </h2>
        <form className="flex flex-col space-y-4">
          <label htmlFor="name">Name</label>
          <input
            type="Name"
            placeholder="Enter your name here..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <label htmlFor="name">Surname</label>
          <input
            type="Surname"
            placeholder="Enter your surname here..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <label htmlFor="name">Email address</label>
          <input
            type="Email"
            placeholder="Enter your email address here..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <label htmlFor="name">Phone number</label>
          <input
            type="Phone Number"
            placeholder="Enter your phone number here..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <label htmlFor="name">Password</label>
          <input
            type="Password"
            placeholder="Enter your password here..."
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors"
          >
            Sign in
          </button>
        </form>
        <div className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to={"/login"}>
            <span className="text-green-600 underline cursor-pointer">
              Click here to login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
