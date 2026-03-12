import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  BadgeCheck, 
  MapPin, 
  Star, 
  Heart,
  MessageCircle,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { professionals } from "../data/mockData";

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const professional = professionals.find((p) => p.id === id);
  
  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Professional not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header Image */}
      <div className="relative h-80">
        <img
          src={professional.mainPhoto}
          alt={professional.name}
          className="w-full h-full object-cover"
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Verified Badge */}
        {professional.verified && (
          <div className="absolute top-6 right-6 bg-cyan-500/90 backdrop-blur-sm px-3 py-1.5 rounded-[12px] flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4" />
            <span className="text-sm font-semibold">Verified</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Basic Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{professional.name}</h1>
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{professional.location}</span>
          </div>
          <div className="flex items-center gap-2">
            {professional.roles.map((role, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 rounded-[12px] text-sm font-semibold"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 rounded-[12px] font-semibold flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Contact
          </button>
          <button className="w-12 h-12 bg-[#141414] border border-[#1f1f1f] rounded-[12px] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        {/* Personal Bio */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
            Personal Bio
          </h2>
          <p className="text-gray-300 leading-relaxed">{professional.bio}</p>
        </div>
        
        {/* Professional Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
            Professional Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {professional.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-[#141414] border border-[#1f1f1f] px-4 py-2 rounded-[12px] text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Portfolio */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
              Portfolio
            </h2>
            <button className="text-sm text-cyan-400 flex items-center gap-1">
              View All
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {professional.portfolio.map((image, index) => (
              <div key={index} className="aspect-square rounded-[12px] overflow-hidden">
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Service Menu */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
            Service Menu
          </h2>
          <div className="space-y-3">
            {professional.services.map((service) => (
              <div
                key={service.id}
                className="bg-[#141414] border border-[#1f1f1f] rounded-[12px] p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{service.name}</h3>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {service.price}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Client Testimonials */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full"></span>
            Client Testimonials
          </h2>
          <div className="space-y-3">
            {professional.testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#141414] border border-[#1f1f1f] rounded-[12px] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{testimonial.client}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">"{testimonial.text}"</p>
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Match Rate Card */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 rounded-[12px] p-6 text-center">
          <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text mb-2">
            {professional.matchRate}%
          </div>
          <p className="text-gray-400">Match Rate with Your Needs</p>
        </div>
      </div>
    </div>
  );
}
