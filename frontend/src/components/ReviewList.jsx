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
  
  if (reviews.length === 0) return (
    <div className="py-16 text-center bg-bg-card rounded-[2.5rem] border border-dashed border-border mt-8">
      <p className="text-[11px] font-black text-text-muted uppercase tracking-widest">No reviews yet</p>
      <p className="text-text-secondary text-sm font-medium mt-2">Be the first to share your experience!</p>
    </div>
  );

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));

  return (
    <div className="space-y-10 mt-8">
      {/* Rating Summary Card */}
      <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Average Score */}
          <div className="text-center md:border-r border-border md:pr-10">
            <div className="text-7xl font-black text-text-primary tracking-tighter">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 mt-3 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} className={Math.round(averageRating) >= s ? "text-brand fill-brand" : "text-text-muted"} />
              ))}
            </div>
            <p className="text-[11px] font-black text-text-muted uppercase tracking-widest">{reviews.length} Ratings</p>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 w-full space-y-3">
            {ratingCounts.map(({ star, percentage, count }) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 w-10">
                  <span className="text-[12px] font-black text-text-primary">{star}</span>
                  <Star size={10} className="text-text-muted fill-text-muted" />
                </div>
                <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-8 text-right">
                  <span className="text-[11px] font-bold text-text-muted">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="grid gap-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-bg-card p-8 rounded-[2.5rem] border border-border hover:border-brand/30 transition-all group relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg-secondary border border-border shadow-inner">
                  {review.user?.image ? (
                    <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted font-black text-lg">
                      {review.user?.fullname?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-black text-text-primary tracking-tight">{review.user?.fullname || "DishDash Guest"}</p>
                  <p className="text-[10px] font-black text-text-muted tracking-widest uppercase mt-1">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 bg-bg-secondary px-3 py-1.5 rounded-xl border border-border">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} className={review.rating >= s ? "text-brand fill-brand" : "text-text-muted"} />
                ))}
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed italic font-medium relative z-10 group-hover:text-text-primary transition-colors">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
