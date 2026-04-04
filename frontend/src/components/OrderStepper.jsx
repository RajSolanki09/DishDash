import React from 'react';
import { Check, Clock, Utensils, Bike, MapPin } from 'lucide-react';

const steps = [
  { id: 'pending', label: 'Confirmed', icon: Clock },
  { id: 'preparing', label: 'Preparing', icon: Utensils },
  { id: 'out of delivery', label: 'On the Way', icon: Bike },
  { id: 'delivered', label: 'Delivered', icon: MapPin },
];

const OrderStepper = ({ currentStatus }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full py-12 px-4">
      <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-bg-tertiary -translate-y-1/2" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand to-brand-glow -translate-y-1/2 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,77,45,0.4)]"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isLast = idx === steps.length - 1;
          const Icon = step.icon;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted 
                    ? 'bg-brand border-brand text-white shadow-[0_0_20px_rgba(255,77,45,0.4)]' 
                    : isActive 
                      ? 'bg-bg-tertiary border-text-primary text-text-primary scale-110 shadow-2xl' 
                      : 'bg-bg-tertiary border-border text-text-muted'
                }`}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                
                {/* Glow for active step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl animate-pulse" />
                )}
              </div>
              
              <div className="absolute top-16 text-center whitespace-nowrap">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                  isCompleted || isActive ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-[8px] font-bold text-brand uppercase tracking-widest mt-1 animate-bounce">
                    In Progress
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStepper;
