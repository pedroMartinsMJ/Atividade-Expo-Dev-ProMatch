import { Outlet, Link, useLocation } from "react-router";
import { Home, Search, MessageCircle, User } from "lucide-react";

export function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-md mx-auto pb-20">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#1f1f1f]">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-around">
          <Link 
            to="/" 
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/") && !location.pathname.includes("profile") 
                ? "text-cyan-400" 
                : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Discover</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/search") ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </Link>
          
          <Link 
            to="/matches" 
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              isActive("/matches") ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Matches</span>
            {/* Badge for new matches */}
            <span className="absolute top-0 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </Link>
          
          <Link 
            to="/profile/1" 
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname.includes("profile") ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
