export interface Professional {
  id: string;
  name: string;
  mainPhoto: string;
  verified: boolean;
  roles: string[];
  portfolio: string[];
  matchRate: number;
  bio: string;
  skills: string[];
  testimonials: Testimonial[];
  services: Service[];
  location: string;
  hourlyRate: number;
}

export interface Testimonial {
  id: string;
  client: string;
  text: string;
  rating: number;
  date: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Match {
  id: string;
  professional: Professional;
  status: "new" | "ongoing" | "completed";
  lastMessage: string;
  timestamp: string;
  safePayment: boolean;
  projectName?: string;
}

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Sarah Chen",
    mainPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    verified: true,
    roles: ["Graphic Designer", "Brand Strategist"],
    portfolio: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop"
    ],
    matchRate: 94,
    bio: "10+ years crafting visual stories that connect brands with their audiences. Passionate about minimal design with maximum impact.",
    skills: ["Brand Identity", "UI/UX Design", "Illustration", "Art Direction", "Typography"],
    testimonials: [
      {
        id: "t1",
        client: "Tech Startup Inc",
        text: "Sarah transformed our brand identity completely. Her attention to detail and creative vision exceeded all expectations.",
        rating: 5,
        date: "2026-02-15"
      },
      {
        id: "t2",
        client: "E-commerce Solutions",
        text: "Professional, timely, and incredibly talented. Would recommend to anyone looking for top-tier design work.",
        rating: 5,
        date: "2026-01-22"
      }
    ],
    services: [
      { id: "s1", name: "Logo Design", price: "$800-1,500", description: "Complete brand mark with variations" },
      { id: "s2", name: "Brand Identity Package", price: "$3,000-5,000", description: "Logo, color palette, typography, guidelines" },
      { id: "s3", name: "UI/UX Consultation", price: "$150/hour", description: "Expert advice on design systems" }
    ],
    location: "San Francisco, CA",
    hourlyRate: 150
  },
  {
    id: "2",
    name: "Marcus Johnson",
    mainPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    verified: true,
    roles: ["Photo Editor", "Retoucher"],
    portfolio: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&h=300&fit=crop"
    ],
    matchRate: 89,
    bio: "Fashion and commercial photographer with expertise in advanced retouching. Making every image tell its best story.",
    skills: ["Adobe Photoshop", "Lightroom", "Color Grading", "High-end Retouching", "Compositing"],
    testimonials: [
      {
        id: "t3",
        client: "Fashion Magazine",
        text: "Marcus' retouching work is flawless. He brings out the best in every photo while maintaining natural beauty.",
        rating: 5,
        date: "2026-02-28"
      }
    ],
    services: [
      { id: "s4", name: "Photo Retouching", price: "$50-100/image", description: "Professional portrait and product retouching" },
      { id: "s5", name: "Bulk Editing", price: "$500-1,000", description: "50-100 photos edited to your specs" },
      { id: "s6", name: "Color Grading", price: "$75/hour", description: "Cinematic color correction" }
    ],
    location: "New York, NY",
    hourlyRate: 75
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    mainPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    verified: true,
    roles: ["Content Writer", "Copywriter"],
    portfolio: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=300&h=300&fit=crop"
    ],
    matchRate: 92,
    bio: "Strategic content creator specializing in tech and SaaS. I write words that convert browsers into buyers.",
    skills: ["SEO Writing", "Blog Content", "Email Marketing", "Landing Pages", "Technical Writing"],
    testimonials: [
      {
        id: "t4",
        client: "SaaS Platform",
        text: "Elena's content strategy increased our organic traffic by 300%. Her writing is both engaging and conversion-focused.",
        rating: 5,
        date: "2026-03-01"
      }
    ],
    services: [
      { id: "s7", name: "Blog Post", price: "$200-400", description: "SEO-optimized 1000-1500 words" },
      { id: "s8", name: "Landing Page Copy", price: "$500-800", description: "Conversion-focused web copy" },
      { id: "s9", name: "Content Strategy", price: "$125/hour", description: "Planning and editorial calendar" }
    ],
    location: "Austin, TX",
    hourlyRate: 125
  },
  {
    id: "4",
    name: "David Kim",
    mainPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    verified: true,
    roles: ["Web Developer", "UI Engineer"],
    portfolio: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop"
    ],
    matchRate: 96,
    bio: "Full-stack developer with a design-first approach. Building beautiful, performant web experiences that users love.",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js"],
    testimonials: [
      {
        id: "t5",
        client: "Digital Agency",
        text: "David delivered a pixel-perfect implementation ahead of schedule. His code quality is exceptional.",
        rating: 5,
        date: "2026-02-20"
      }
    ],
    services: [
      { id: "s10", name: "Landing Page", price: "$1,500-2,500", description: "Responsive single-page website" },
      { id: "s11", name: "Web Application", price: "$5,000-10,000", description: "Full-stack app development" },
      { id: "s12", name: "Technical Consultation", price: "$175/hour", description: "Architecture and code review" }
    ],
    location: "Seattle, WA",
    hourlyRate: 175
  }
];

export const matches: Match[] = [
  {
    id: "m1",
    professional: professionals[0],
    status: "new",
    lastMessage: "Hi! I'd love to discuss your project.",
    timestamp: "2026-03-09T10:30:00",
    safePayment: true
  },
  {
    id: "m2",
    professional: professionals[1],
    status: "ongoing",
    lastMessage: "I've uploaded the first batch of edited photos.",
    timestamp: "2026-03-08T15:20:00",
    safePayment: true,
    projectName: "Product Photography Retouching"
  },
  {
    id: "m3",
    professional: professionals[3],
    status: "ongoing",
    lastMessage: "The landing page is ready for review.",
    timestamp: "2026-03-07T09:15:00",
    safePayment: true,
    projectName: "Company Website Redesign"
  },
  {
    id: "m4",
    professional: professionals[2],
    status: "completed",
    lastMessage: "Thank you for the great review!",
    timestamp: "2026-03-01T14:00:00",
    safePayment: false,
    projectName: "Blog Content Series"
  }
];
