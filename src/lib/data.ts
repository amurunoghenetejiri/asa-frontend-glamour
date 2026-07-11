export const CATEGORIES = [
  { slug: "electrical", name: "Electrical", icon: "⚡", count: 248 },
  { slug: "plumbing", name: "Plumbing", icon: "🔧", count: 189 },
  { slug: "cleaning", name: "Cleaning", icon: "🧹", count: 312 },
  { slug: "tailoring", name: "Tailoring", icon: "🧵", count: 156 },
  { slug: "painting", name: "Painting", icon: "🎨", count: 134 },
  { slug: "generator-repair", name: "Generator Repair", icon: "⚙️", count: 98 },
  { slug: "solar-installation", name: "Solar Installation", icon: "☀️", count: 76 },
  { slug: "carpentry", name: "Carpentry", icon: "🪚", count: 142 },
  { slug: "mechanics", name: "Mechanics", icon: "🚗", count: 201 },
  { slug: "pop-installation", name: "POP Installation", icon: "🏛️", count: 64 },
  { slug: "ac-repair", name: "AC Repair", icon: "❄️", count: 118 },
  { slug: "welding", name: "Welding", icon: "🔩", count: 87 },
];

export const STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Kaduna",
  "Enugu", "Edo", "Delta", "Ogun", "Anambra", "Cross River",
];

export const PROVIDERS = [
  {
    id: "1", name: "Chinedu Okafor", profession: "Master Electrician",
    location: "Lekki, Lagos", rating: 4.9, reviews: 142, jobs: 380, years: 8,
    verified: true, price: "₦8,000", available: true,
    avatar: "https://i.pravatar.cc/300?img=12",
    cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600",
    bio: "Certified master electrician with 8 years of hands-on residential and commercial experience. Specialized in inverter installation, wiring, and smart-home setups.",
    skills: ["Wiring", "Inverter", "Smart Home", "Solar", "Fault-finding"],
  },
  {
    id: "2", name: "Amaka Eze", profession: "Bridal Tailor",
    location: "Wuse, Abuja", rating: 5.0, reviews: 89, jobs: 210, years: 6,
    verified: true, price: "₦25,000", available: true,
    avatar: "https://i.pravatar.cc/300?img=47",
    cover: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600",
    bio: "Bespoke bridal and occasion wear. Delivering couture-grade finishing to brides across Nigeria.",
    skills: ["Bridal", "Aso-ebi", "Corsetry", "Beading"],
  },
  {
    id: "3", name: "Ibrahim Musa", profession: "AC & Refrigeration Tech",
    location: "GRA, Port Harcourt", rating: 4.8, reviews: 76, jobs: 190, years: 10,
    verified: true, price: "₦12,000", available: false,
    avatar: "https://i.pravatar.cc/300?img=33",
    cover: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600",
    bio: "Split, central and industrial AC installation & repair. Same-day service across PH.",
    skills: ["AC Install", "Gas refill", "Chiller", "Cold room"],
  },
  {
    id: "4", name: "Blessing Adeyemi", profession: "Deep-Clean Specialist",
    location: "Ikeja, Lagos", rating: 4.9, reviews: 203, jobs: 512, years: 5,
    verified: true, price: "₦15,000", available: true,
    avatar: "https://i.pravatar.cc/300?img=45",
    cover: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600",
    bio: "Post-construction, move-in and deep sanitation. Bonded, insured team.",
    skills: ["Deep clean", "Post-construction", "Upholstery", "Fumigation"],
  },
  {
    id: "5", name: "Tunde Bakare", profession: "Solar Installer",
    location: "Ibadan, Oyo", rating: 4.7, reviews: 54, jobs: 96, years: 4,
    verified: true, price: "From ₦450,000", available: true,
    avatar: "https://i.pravatar.cc/300?img=15",
    cover: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600",
    bio: "Off-grid & hybrid solar systems for homes and small businesses.",
    skills: ["Solar PV", "Batteries", "Inverters", "Design"],
  },
  {
    id: "6", name: "Grace Nnamdi", profession: "Interior Painter",
    location: "Enugu", rating: 4.8, reviews: 61, jobs: 140, years: 7,
    verified: true, price: "₦2,500/m²", available: true,
    avatar: "https://i.pravatar.cc/300?img=48",
    cover: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600",
    bio: "Textured, faux-finish and matte interior painting. Clean-site guarantee.",
    skills: ["Faux finish", "Texture", "Matte", "Enamel"],
  },
];

export const TESTIMONIALS = [
  { name: "Adaeze O.", role: "Homeowner, Lagos", text: "I found a verified electrician within 20 minutes. Fixed my inverter same-day. Asá is a game-changer.", avatar: "https://i.pravatar.cc/100?img=32" },
  { name: "Kunle A.", role: "Landlord, Abuja", text: "The quality of vetted providers is genuinely different. I use Asá for every property now.", avatar: "https://i.pravatar.cc/100?img=11" },
  { name: "Ngozi E.", role: "Bride", text: "My tailor was a dream. The reviews on Asá are honest — that made all the difference.", avatar: "https://i.pravatar.cc/100?img=44" },
];

export const HERO_SLIDES = [
  {
    title: "Nigeria's trusted marketplace for skilled hands",
    subtitle: "Verified professionals. Transparent prices. Nearby.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920",
  },
  {
    title: "From tailoring to solar — done properly.",
    subtitle: "Every provider on Asá is background-checked and rated.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920",
  },
  {
    title: "Book in minutes. Pay when satisfied.",
    subtitle: "Secure escrow, honest reviews, real accountability.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920",
  },
];
