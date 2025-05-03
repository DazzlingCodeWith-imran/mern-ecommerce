import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PromotionalBanner = () => {
  const offerEndDate = new Date(Date.now() + 86400000); // 24 hours from now
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    prevSeconds: 0
  });
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = offerEndDate - new Date();
      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      setIsCritical(difference < 3600000); // Less than 1 hour

      setTimeLeft(prev => ({
        days,
        hours,
        minutes,
        seconds,
        prevSeconds: prev.seconds
      }));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const NumberTicker = ({ num, prevNum, isCritical }) => (
    <div className="relative w-8 h-10 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={num}
          initial={{ y: prevNum < num ? -40 : 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: prevNum < num ? 40 : -40, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute font-mono font-bold ${
            isCritical ? 'text-red-400' : 'text-white'
          }`}
        >
          {num.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
  );

  return (
    <section className={`relative py-16 ${
      isCritical 
        ? 'bg-gradient-to-r from-red-600 to-pink-700' 
        : 'bg-gradient-to-r from-purple-600 to-indigo-700'
    } text-white overflow-hidden`}>
      
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-4xl font-bold mb-6">Flash Sale Ending Soon!</h3>
        
        <div className="flex justify-center gap-2 mb-8">
          {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
            <div key={unit} className="flex flex-col items-center mx-2">
              <div className={`flex items-center justify-center text-3xl ${
                isCritical && unit === 'seconds' ? 'text-yellow-300' : 'text-white'
              }`}>
                <NumberTicker 
                  num={timeLeft[unit]} 
                  prevNum={unit === 'seconds' ? timeLeft.prevSeconds : 0}
                  isCritical={isCritical && unit === 'seconds'}
                />
                {unit !== 'seconds' && (
                  <span>{timeLeft[unit].toString().padStart(2, '0')}</span>
                )}
              </div>
              <span className="text-sm mt-2 uppercase">{unit}</span>
            </div>
          ))}
        </div>

        <Link
          to="/sale"
          className={`inline-block px-8 py-3 rounded-full font-bold ${
            isCritical 
              ? 'bg-yellow-400 text-red-800 animate-pulse' 
              : 'bg-white text-purple-700'
          } shadow-lg hover:shadow-xl transition-all`}
        >
          {isCritical ? 'LAST CHANCE - SHOP NOW' : 'SHOP THE SALE'}
        </Link>
      </div>
    </section>
  );
};

export default PromotionalBanner;