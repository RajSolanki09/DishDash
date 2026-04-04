import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
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

  const toggleAvailability = async (e) => {
    e.stopPropagation();
    try {
      const result = await axios.post(
        `${serverUrl}/api/item/toggle-availability/${data._id}`,
        {},
        { withCredentials: true }
      );
      if (result.data.success) {
        dispatch(setMyShopData(result.data.shop));
      }
    } catch (error) {
       console.error("Toggle error:", error);
    }
  };

  const Modal = () => {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        <div
          className="absolute inset-0 bg-bg-overlay backdrop-blur-xl transition-opacity animate-in"
          onClick={() => !deleting && setShowDeleteModal(false)}
        />

        <div className="premium-card rounded-3xl shadow-xl max-w-sm w-full p-8 relative z-10 text-center animate-in">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="text-red-500" size={32} />
          </div>

          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Delete Item?
          </h3>

          <p className="text-text-secondary mb-8 text-[13px] leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-text-primary block mt-1 text-[15px]">
              "{data?.name}"
            </span>
            ?
          </p>

          <div className="flex flex-col gap-3">
            <button
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest active:scale-95 transition-all duration-300 disabled:opacity-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <ClipLoader size={16} color="white" /> : "Confirm Delete"}
            </button>

            <button
              className="w-full bg-bg-secondary hover:bg-bg-tertiary border border-border text-text-secondary py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all duration-300 active:scale-95"
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
    <div className="group premium-card p-5 gap-6 flex relative">

      {/* Image */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-bg-secondary aspect-square">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow min-w-0 py-1">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary capitalize leading-tight truncate">
            {data?.name}
          </h2>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate(`/edit-item/${data?._id}`)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-bg-secondary border border-border text-text-muted hover:text-brand hover:bg-brand/10 hover:border-brand transition-all duration-300 active:scale-90"
            >
              <Pencil size={15} />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-bg-secondary border border-border text-text-muted hover:text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 active:scale-90"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-caption text-text-muted block mb-1">
              Price
            </span>
            <div className="text-2xl font-black text-brand">
              ₹{data?.price}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={toggleAvailability}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-caption transition-all duration-300 border ${data.isAvailable ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
             >
                <div className={`w-1.5 h-1.5 rounded-full ${data.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {data.isAvailable ? 'In Stock' : 'Out of Stock'}
             </button>
             <div className="text-caption text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-lg">
                {data?.category || "Item"}
             </div>
          </div>
        </div>
      </div>

      {showDeleteModal && <Modal />}
    </div>
  );
};

export default OwnerItemCard;
