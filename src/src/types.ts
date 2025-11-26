export type UserRole = 'CUSTOMER' | 'ADMIN';
export interface User { id: string; name: string; mobile: string; email: string; address: string; role: UserRole; password?: string; }
export interface Service { id: string; name: string; category: string; price: number; duration: string; image: string; description: string; }
export interface Product { id: string; name: string; price: number; category: string; image: string; description: string; stock: number; }
export interface Booking { id: string; userId: string; userName: string; userMobile: string; userAddress: string; serviceId: string; serviceName: string; date: string; time: string; status: string; statusNote?: string; timestamp: number; }
export interface Order { id: string; userId: string; userName: string; userMobile: string; userAddress: string; items: CartItem[]; totalAmount: number; status: string; statusNote?: string; date: string; timestamp: number; }
export interface Review { id: string; userId: string; userName: string; userImage?: string; rating: number; comment: string; date: string; }
export interface GalleryItem { id: string; imageUrl: string; caption: string; category: string; image?: string; name?: string; serviceName?: string; date?: string; description?: string; }
export interface Offer { id: string; title: string; description: string; discountCode: string; discountValue: string; validUntil: string; image: string; originalPrice?: number; finalPrice?: number; }
export interface TeamMember { id: string; name: string; role: string; bio: string; image: string; }
export interface CustomPage { id: string; title: string; content: string; }
export interface SiteConfig { salonName: string; tagline: string; logoUrl: string; heroImageUrl: string; contactNumber: string; email: string; address: string; founderName: string; founderImageUrl: string; themeColor: string; qrCodeUrl: string; upiId: string; missionStatement: string; promoBannerText: string; socialLinks: { whatsapp: string; instagram: string; facebook: string; }; }
export interface CartItem extends Product { quantity: number; }
