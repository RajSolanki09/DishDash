import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import gsap from 'gsap';

const ReviewForm = ({ itemId, shopId, orderId, onComplete }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${serverUrl}/api/review/add`, {
        itemId,
        shopId,
        orderId,
        rating,
        comment
      }, { withCredentials: true });

      if (res.data.success) {
        onComplete();
        gsap.to(`.review-form-${itemId}`, { opacity: 0, height: 0, duration: 0.5 });
      }
    } catch (error) {
       console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`review-form-${itemId} bg-bg-card border border-border p-6 rounded-3xl mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-500`}>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Share your feedback</p>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHoveredRating(s)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(s)}
            className="transition-transform active:scale-90"
          >
            <Star 
              size={20} 
              className={`transition-colors ${(hoveredRating || rating) >= s ? "text-brand fill-brand" : "text-text-muted"}`} 
            />
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the taste?..."
          className="w-full bg-bg-tertiary border border-border rounded-2xl p-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand/50 transition-colors h-24 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0 || !comment.trim()}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
