import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Shield,
  Sparkles,
  Circle
} from "lucide-react";
import { matches } from "../data/mockData";
import type { Match } from "../data/mockData";

export function MatchHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"new" | "ongoing" | "completed">("new");
  
  const filteredMatches = matches.filter((match) => match.status === activeTab);
  
  const getStatusIcon = (status: Match["status"]) => {
    switch (status) {
      case "new":
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case "ongoing":
        return <Circle className="w-4 h-4 text-blue-400" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };
  
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold mb-1">Match Hub</h1>
        <p className="text-gray-400">Your connections & projects</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="bg-[#141414] rounded-[12px] p-1 flex">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition-all relative ${
              activeTab === "new"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                : "text-gray-400"
            }`}
          >
            New Matches
            {matches.filter((m) => m.status === "new").length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {matches.filter((m) => m.status === "new").length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition-all ${
              activeTab === "ongoing"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                : "text-gray-400"
            }`}
          >
            Ongoing
          </button>
          
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 rounded-[12px] text-sm font-semibold transition-all ${
              activeTab === "completed"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                : "text-gray-400"
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No {activeTab} matches yet</h3>
          <p className="text-gray-400 text-sm">
            {activeTab === "new" && "Start swiping to find your perfect match!"}
            {activeTab === "ongoing" && "Your active projects will appear here"}
            {activeTab === "completed" && "Completed projects will be shown here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => navigate(`/profile/${match.professional.id}`)}
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-[12px] p-4 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={match.professional.mainPhoto}
                    alt={match.professional.name}
                    className="w-16 h-16 rounded-[12px] object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                    {getStatusIcon(match.status)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold">{match.professional.name}</h3>
                      {match.projectName && (
                        <p className="text-xs text-gray-500">{match.projectName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {match.safePayment && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400">
                          <Shield className="w-3 h-3" />
                        </div>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(match.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                    {match.lastMessage}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {match.professional.roles.map((role, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#1f1f1f] px-2 py-1 rounded-[12px] text-gray-400"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              {match.status === "new" && (
                <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-sm text-cyan-400 font-medium">New Match!</span>
                  <span className="text-xs text-gray-500">Say hello 👋</span>
                </div>
              )}
              
              {match.status === "ongoing" && match.safePayment && (
                <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-400">Safe Payment Active</span>
                  </span>
                  <span className="text-xs text-emerald-400">Protected</span>
                </div>
              )}
              
              {match.status === "completed" && (
                <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-400">Project Completed</span>
                  </span>
                  <span className="text-xs text-cyan-400">Leave Review</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Safe Payment Info Card */}
      {activeTab === "ongoing" && filteredMatches.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-[12px] p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-400 mb-1">Safe Payment Protection</h4>
              <p className="text-sm text-gray-400">
                Your payments are held securely until project milestones are met. Both parties are protected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
