import { useState } from "react";
import { 
  Search as SearchIcon, 
  Briefcase, 
  User, 
  Palette, 
  Camera, 
  Code, 
  PenTool, 
  Zap,
  Clock,
  DollarSign,
  MapPin
} from "lucide-react";
import { professionals } from "../data/mockData";
import { useNavigate } from "react-router";

const categories = [
  { id: "design", name: "Design", icon: Palette },
  { id: "photo", name: "Photography", icon: Camera },
  { id: "code", name: "Development", icon: Code },
  { id: "writing", name: "Writing", icon: PenTool },
];

const urgencyLevels = [
  { id: "anytime", label: "Anytime", color: "text-gray-400" },
  { id: "week", label: "This Week", color: "text-blue-400" },
  { id: "urgent", label: "Urgent", color: "text-red-400" },
];

export function Search() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"hire" | "work">("hire");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("anytime");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold mb-1">Smart Search</h1>
        <p className="text-gray-400">Find exactly what you need</p>
      </div>
      
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="bg-[#141414] rounded-[12px] p-1 flex">
          <button
            onClick={() => setMode("hire")}
            className={`flex-1 py-3 rounded-[12px] flex items-center justify-center gap-2 transition-all ${
              mode === "hire"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                : "text-gray-400"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-semibold">I want to Hire</span>
          </button>
          
          <button
            onClick={() => setMode("work")}
            className={`flex-1 py-3 rounded-[12px] flex items-center justify-center gap-2 transition-all ${
              mode === "work"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                : "text-gray-400"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-semibold">I want to Work</span>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={mode === "hire" ? "Search for professionals..." : "Search for jobs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-[12px] pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3">CATEGORIES</p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-[#141414] border rounded-[12px] p-4 flex flex-col items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-[#1f1f1f] hover:border-[#2f2f2f]"
                }`}
              >
                <Icon className={`w-6 h-6 ${
                  selectedCategory === category.id ? "text-cyan-400" : "text-gray-400"
                }`} />
                <span className={`text-sm font-medium ${
                  selectedCategory === category.id ? "text-cyan-400" : "text-gray-300"
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Urgency Filter */}
      {mode === "hire" && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            URGENCY LEVEL
          </p>
          <div className="flex gap-2">
            {urgencyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedUrgency(level.id)}
                className={`flex-1 py-2.5 rounded-[12px] text-sm font-medium transition-all ${
                  selectedUrgency === level.id
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                    : "bg-[#141414] text-gray-400 border border-[#1f1f1f]"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {professionals.length} {mode === "hire" ? "professionals" : "opportunities"} found
          </p>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-cyan-400"
            >
              Clear filters
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {professionals.map((pro) => (
            <button
              key={pro.id}
              onClick={() => navigate(`/profile/${pro.id}`)}
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-[12px] p-4 flex gap-4 hover:border-cyan-500/50 transition-colors"
            >
              <img
                src={pro.mainPhoto}
                alt={pro.name}
                className="w-16 h-16 rounded-[12px] object-cover"
              />
              
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-1">{pro.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{pro.roles.join(" • ")}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {pro.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${pro.hourlyRate}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Available
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <span className="text-xs font-semibold text-emerald-400">
                  {pro.matchRate}%
                </span>
                <span className="text-xs text-cyan-400">View →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
