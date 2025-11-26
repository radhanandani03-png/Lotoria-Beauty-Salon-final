import { SiteConfig, Service, Product, TeamMember, GalleryItem, Offer } from './types';

export const ADMIN_MOBILE = "9110111970";

export const INITIAL_CONFIG: SiteConfig = {
  salonName: "Lotoria Beauty Salon",
  tagline: "Home Beauty Service",
  logoUrl: "https://glamorous-turquoise-h1abn2tbzk-4s4mf01nhj.edgeone.dev/1000012257-removebg-preview_imresizer.png", 
  heroImageUrl: "https://picsum.photos/id/431/1920/1080",
  contactNumber: "8210667364",
  email: "buylotoria@gmail.com",
  address: "Kanpur, India",
  founderName: "Aryan Kumar",
  founderImageUrl: "https://img.sanishtech.com/u/5ad7847347e2925e939b1e6c81a43f5c.jpg",
  themeColor: 'GOLD',
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=buyfuturemart@okicici&pn=LotoriaSalon", 
  upiId: "buyfuturemart@okicici",
  missionStatement: "To provide luxury beauty services at your doorstep with premium products.",
  promoBannerText: "Grand Opening Offer: 20% OFF on all Facial Services!",
  socialLinks: {
    whatsapp: "https://whatsapp.com/channel/0029VbBFj097IUYSac2k7O0U",
    instagram: "https://www.instagram.com/_lotoria?igsh=ZnI2bTZocW0zNHow",
    facebook: "https://www.facebook.com/share/1acgbkUrSL/"
  }
};

export const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: 'Luxury Gold Facial', category: 'Facial', price: 1499, duration: '60 mins', image: 'https://picsum.photos/id/1011/400/300', description: 'Premium gold radiance facial for glowing skin.' },
  { id: 's2', name: 'Bridal Makeup', category: 'Makeup', price: 15000, duration: '180 mins', image: 'https://picsum.photos/id/338/400/300', description: 'Complete bridal makeover by expert artists.' }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Lotoria Glow Serum', price: 599, category: 'Skincare', image: 'https://picsum.photos/id/21/300/300', description: 'Vitamin C enriched serum.', stock: 50 }
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: 't1', name: 'Aryan Kumar', role: 'Founder', bio: 'Visionary leader.', image: 'https://img.sanishtech.com/u/5ad7847347e2925e939b1e6c81a43f5c.jpg' },
  { id: 't_jyoti', name: 'Jyoti', role: 'Co-Founder', bio: 'Dedicated to excellence.', image: 'https://img.sanishtech.com/u/8ba608b575404233c6945be3c5c96aff.jpg' }
];

export const INITIAL_GALLERY: GalleryItem[] = [];
export const INITIAL_OFFERS: Offer[] = [];
export const INITIAL_FAQS = [];
