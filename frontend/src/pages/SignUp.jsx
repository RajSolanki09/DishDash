import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("user");
  return (
    <div
      className="min-h-screen w-full flex item-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] border-[${borderColor}]`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          Vingo
        </h1>
        <p className="text-gray-600 mb-6">
          Create your account to get started with delicious food delivery
        </p>
        {/* fullName */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-gray-700 font-medium mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="fullname"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none "
            placeholder="Enter your Full name"
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none "
            placeholder="Enter your Email"
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>
        {/* Mobile  */}
        <div>
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="text"
            id="mobile"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none "
            placeholder="Enter your Mobile"
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>
        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none "
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => {
              return (
                <button
                  key={r}
                  className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                  onClick={() => setRole(r)}
                  style={
                    role == r
                      ? { backgroundColor: primaryColor, color: "white" }
                      : {
                          border: `1px solid ${primaryColor}`,
                          color: primaryColor,
                        }
                  }
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      <button
        className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] text-white cursor-pointer`}
      >
        Sign Up
      </button>
      <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg">
<FcGoogle size={20} />
<span>Sign Up with Google</span>
      </button>
      </div>
    </div>
  );
};

export default SignUp;
