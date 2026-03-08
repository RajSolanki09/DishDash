import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FaPen, FaRegTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!data) return null;

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      setDeleting(true);
      const result = await axios.delete(
        `${serverUrl}/api/item/delete/${data._id}`,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data.shop));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const Modal = () => {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => !deleting && setShowDeleteModal(false)}
        />

        {/* Modal */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative z-10 border text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Delete Item?
          </h3>

          <p className="text-gray-500 mb-8 text-sm">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-800">
              "{data?.name}"
            </span>
            ?
          </p>

          <div className="flex flex-col gap-3">
            <button
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase shadow hover:bg-red-700 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <ClipLoader size={16} color="white" /> : "Confirm Delete"}
            </button>

            <button
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs uppercase hover:bg-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("portal")
    );
  };

  return (
    <div className="group flex bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full max-w-2xl mb-4 p-4 gap-5 relative hover:-translate-y-1">

      {/* Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-2xl">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
            {data?.name}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-item/${data?._id}`)}
              className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <FaPen size={14} />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            >
              <FaRegTrashAlt size={14} />
            </button>
          </div>
        </div>

        <div className="text-2xl font-extrabold text-gray-900 mt-2">
          ₹{data?.price}
        </div>
      </div>

      {showDeleteModal && <Modal />}
    </div>
  );
};

export default OwnerItemCard;