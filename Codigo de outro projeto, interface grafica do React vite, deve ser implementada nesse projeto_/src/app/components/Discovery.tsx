import { useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { X, Heart, BadgeCheck, ExternalLink } from "lucide-react";
import { professionals } from "../data/mockData";
import { useNavigate } from "react-router";

export function Discovery() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  
  const currentProfessional = professionals[currentIndex];
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x);
      if (info.offset.x > 0) {
        // Liked
        console.log("Liked:", currentProfessional.name);
      } else {
        // Passed
        console.log("Passed:", currentProfessional.name);
      }
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % professionals.length);
        setExitX(0);
      }, 200);
    }
  };
  
  const handleLike = () => {
    setExitX(200);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % professionals.length);
      setExitX(0);
    }, 200);
  };
  
  const handlePass = () => {
    setExitX(-200);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % professionals.length);
      setExitX(0);
    }, 200);
  };
  
  if (!currentProfessional) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400">No more professionals to show</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold">
          Pro<span className="text-cyan-400">Match</span>
        </h1>
        <p className="text-gray-400 mt-1">Find your perfect professional match</p>
      </div>
      
      {/* Card Stack Container */}
      <div className="relative h-[600px]">
        {/* Background cards */}
        {professionals.slice(currentIndex + 1, currentIndex + 3).map((pro, index) => (
          <div
            key={pro.id}
            className="absolute inset-0 bg-[#141414] rounded-[12px] border border-[#1f1f1f]"
            style={{
              transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * -10}px)`,
              zIndex: -index - 1,
              opacity: 0.5 - index * 0.2
            }}
          />
        ))}
        
        {/* Active Card */}
        <motion.div
          className="absolute inset-0 bg-[#141414] rounded-[12px] border border-[#1f1f1f] overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            x: exitX || x,
            rotate: exitX ? (exitX > 0 ? 30 : -30) : rotate,
            opacity: exitX ? 0 : opacity,
            zIndex: 10
          }}
          drag={!exitX ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={exitX ? { x: exitX, opacity: 0 } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* Main Photo */}
          <div className="relative h-80">
            <img
              src={currentProfessional.mainPhoto}
              alt={currentProfessional.name}
              className="w-full h-full object-cover"
            />
            
            {/* Verified Badge */}
            {currentProfessional.verified && (
              <div className="absolute top-4 right-4 bg-cyan-500/90 backdrop-blur-sm px-3 py-1.5 rounded-[12px] flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-sm font-semibold">Verified</span>
              </div>
            )}
            
            {/* Match Rate */}
            <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-[12px]">
              <span className="text-sm font-bold">{currentProfessional.matchRate}% Match</span>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-6">
            {/* Name and Location */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1">{currentProfessional.name}</h2>
              <p className="text-gray-400 text-sm">{currentProfessional.location}</p>
            </div>
            
            {/* Multi-Pro Carousel */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">MULTI-PRO</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentProfessional.roles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 rounded-[12px] whitespace-nowrap text-sm font-semibold"
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Portfolio */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">QUICK PORTFOLIO</p>
                <button 
                  onClick={() => navigate(`/profile/${currentProfessional.id}`)}
                  className="text-xs text-cyan-400 flex items-center gap-1"
                >
                  View Full Profile
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {currentProfessional.portfolio.map((image, index) => (
                  <div key={index} className="aspect-square rounded-[12px] overflow-hidden">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bio Preview */}
            <p className="text-sm text-gray-300 line-clamp-2">{currentProfessional.bio}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-[#141414] border-2 border-red-500/50 flex items-center justify-center hover:bg-red-500/10 transition-colors"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        
        <button
          onClick={handleLike}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
        >
          <Heart className="w-10 h-10 fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
