import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { Star, User } from 'lucide-react';
import gsap from 'gsap';

const ReviewList = ({ itemId, shopId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = itemId 
          ? `${serverUrl}/api/review/item/${itemId}` 
          : `${serverUrl}/api/review/shop/${shopId}`;
        const res = await axios.get(url);
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [itemId, shopId]);

  if (loading) return <div className="h-20 flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;
  if (reviews.length === 0) return <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center py-8">No reviews yet</p>;

  return (
    <div className="space-y-6 mt-8">
      {reviews.map((review, idx) => (
        <div key={idx} className="glass-panel p-6 rounded-[2rem] border border-border animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-bg-tertiary border border-border">
                {review.user?.image ? (
                  <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted"><User size={16} /></div>
                )}
              </div>
              <div>
                <p className="text-[13px] font-black text-text-primary">{review.user?.fullname || "Vingo User"}</p>
                <p className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
                    {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className={review.rating >= s ? "text-brand fill-brand" : "text-text-muted"} />
              ))}
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed italic">"{review.comment}"</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
