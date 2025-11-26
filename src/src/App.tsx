import React, { useState, useEffect } from 'react';
import { User, SiteConfig, CartItem, Service, Product, Booking, Review, GalleryItem, Offer, TeamMember, Order, CustomPage } from './types';
import * as db from './services/storage';
import Layout from './components/Layout';
import { Button, Input, Card, SectionTitle } from './components/UI';
import { CheckCircle, Lock, Search, Check, AlertCircle, Smartphone } from 'lucide-react';
import { ADMIN_MOBILE } from './constants';

const Splash = ({ onFinish }: { onFinish: () => void }) => (
  <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center animate-fade-out">
    <div className="text-center animate-pulse">
      <h1 className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 mb-4">Lotoria</h1>
      <p className="text-xs text-yellow-500 mt-4 animate-bounce">Loading...</p>
    </div>
  </div>
);

const SuccessModal = ({ isOpen, onClose, message }: any) => {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"><div className="bg-gray-900 border border-yellow-500/50 p-8 rounded-2xl text-center max-w-sm w-full"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-serif text-white mb-2">Success!</h3><p className="text-gray-300 mb-6">{message}</p><Button onClick={onClose} className="w-full">Done</Button></div></div>);
};

const BookingModal = ({ isOpen, onClose, item, type, onConfirm, currentUser, config }: any) => {
  const [step, setStep] = useState('DETAILS');
  const [details, setDetails] = useState({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '', date: '', time: '' });
  useEffect(() => { if(isOpen) { setStep('DETAILS'); setDetails({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '', date: '', time: '' }); } }, [isOpen, currentUser]);
  if (!isOpen || !item) return null;
  const amount = type === 'SERVICE' ? item.price : item.finalPrice || 0;
  const upiLink = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}${amount > 0 ? `&am=${amount}` : ''}&cu=INR`;
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
       <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">X</button>
          <h3 className="text-2xl font-bold mb-4 text-yellow-500">{step === 'DETAILS' ? 'Booking Details' : 'Payment'}</h3>
          {step === 'DETAILS' ? (
             <div className="space-y-4"><Input label="Name" value={details.name} onChange={(e:any) => setDetails({...details, name: e.target.value})} /><Input label="Mobile" value={details.mobile} onChange={(e:any) => setDetails({...details, mobile: e.target.value})} /><Input label="Address" value={details.address} onChange={(e:any) => setDetails({...details, address: e.target.value})} /><div className="grid grid-cols-2 gap-4"><input type="date" className="bg-black border border-gray-700 p-3 rounded text-white" onChange={(e:any) => setDetails({...details, date: e.target.value})} /><input type="time" className="bg-black border border-gray-700 p-3 rounded text-white" onChange={(e:any) => setDetails({...details, time: e.target.value})} /></div><Button className="w-full mt-4" onClick={() => setStep('PAYMENT')}>Proceed to Pay</Button></div>
          ) : (
             <div className="text-center space-y-4"><div className="bg-white p-4 rounded inline-block"><img src={config.qrCodeUrl} className="w-40 h-40" /></div><p className="text-xl font-bold text-white">₹{amount}</p><a href={upiLink} className="block w-full bg-blue-600 text-white py-3 rounded font-bold">Pay via UPI App</a><Button className="w-full" onClick={() => onConfirm(details)}>Confirm Booking</Button></div>
          )}
       </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, totalAmount, currentUser, config, onConfirm }: any) => {
    const [step, setStep] = useState('DETAILS');
    const [details, setDetails] = useState({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '' });
    if (!isOpen) return null;
    const upiLink = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}&am=${totalAmount}&cu=INR`;
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400">X</button><h3 className="text-2xl font-bold mb-4 text-yellow-500">{step === 'DETAILS' ? 'Shipping' : 'Payment'}</h3>{step === 'DETAILS' ? (<div className="space-y-4"><Input label="Name" value={details.name} onChange={(e:any) => setDetails({...details, name: e.target.value})} /><Input label="Mobile" value={details.mobile} onChange={(e:any) => setDetails({...details, mobile: e.target.value})} /><Input label="Address" value={details.address} onChange={(e:any) => setDetails({...details, address: e.target.value})} /><Button className="w-full mt-4" onClick={() => setStep('PAYMENT')}>Proceed to Pay</Button></div>) : (<div className="text-center space-y-4"><div className="bg-white p-4 rounded inline-block"><img src={config.qrCodeUrl} className="w-40 h-40" /></div><p className="text-xl font-bold text-white">₹{totalAmount}</p><a href={upiLink} className="block w-full bg-blue-600 text-white py-3 rounded font-bold">Pay via UPI App</a><Button className="w-full" onClick={() => onConfirm(details)}>Confirm Order</Button></div>)}</div>
        </div>
      );
};

const StatusStepper = ({ status }: { status: string }) => {
    const steps = ['PENDING', 'CONFIRMED', 'COMPLETED'];
    let idx = status === 'PENDING' ? 0 : status === 'CONFIRMED' ? 1 : 2;
    if (status === 'CANCELLED') return <div className="text-red-500 font-bold">Cancelled</div>;
    return (<div className="flex justify-between mt-4 relative"><div className="absolute top-1/2 w-full h-1 bg-gray-800 -z-10"></div>{steps.map((s, i) => <div key={s} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= idx ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>{i + 1}</div>)}</div>);
};

const Auth = ({ onLogin }: any) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', otp: '' });
  const [step, setStep] = useState('DETAILS');
  const handleSubmit = (e: any) => { e.preventDefault(); if (step === 'DETAILS') { setStep('OTP'); alert('OTP sent: 1234'); } else { if (form.otp === '1234') { const user = { id: Date.now().toString(), ...form, role: form.mobile === ADMIN_MOBILE ? 'ADMIN' : 'CUSTOMER' }; if(isSignup) db.saveUser(user); else { const existing = db.loginUser(form.mobile); if(existing) onLogin(existing); else alert("User not found"); } if(isSignup) onLogin(user); } else alert('Invalid OTP'); } };
  return (<div className="min-h-screen flex items-center justify-center bg-black px-4"><div className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-white/10"><h2 className="text-3xl text-yellow-500 mb-6 text-center">{isSignup ? 'Register' : 'Login'}</h2><form onSubmit={handleSubmit} className="space-y-4">{step === 'DETAILS' ? (<>{isSignup && <><Input placeholder="Name" onChange={(e:any)=>setForm({...form, name: e.target.value})}/><Input placeholder="Email" onChange={(e:any)=>setForm({...form, email: e.target.value})}/><Input placeholder="Address" onChange={(e:any)=>setForm({...form, address: e.target.value})}/></>}<Input placeholder="Mobile" onChange={(e:any)=>setForm({...form, mobile: e.target.value})}/></>) : <Input placeholder="OTP (1234)" onChange={(e:any)=>setForm({...form, otp: e.target.value})}/>}<Button type="submit" className="w-full">{step === 'DETAILS' ? 'Send OTP' : 'Verify'}</Button></form><button onClick={() => { setIsSignup(!isSignup); setStep('DETAILS'); }} className="w-full mt-4 text-gray-400 text-sm">Switch to {isSignup ? 'Login' : 'Sign Up'}</button></div></div>);
};

const AdminPanel = ({ currentUser, config, services, products, bookings, orders, refreshData, setSuccessMsg, setAdminLocked }: any) => {
    const [tab, setTab] = useState('APPEARANCE');
    const [editConfig, setEditConfig] = useState(config);
    const [newItem, setNewItem] = useState<any>({});
    const [locked, setLocked] = useState(true);
    const [pass, setPass] = useState('');
    if(locked) return <div className="p-10 text-center"><Lock className="mx-auto mb-4 text-yellow-500"/><Input type="password" placeholder="Password (Jyoti05)" value={pass} onChange={(e:any)=>setPass(e.target.value)}/><Button className="mt-4" onClick={()=>{if(pass===currentUser.password||pass==='Jyoti05') setLocked(false); else alert('Wrong');}}>Unlock</Button></div>;
    return (
       <div className="max-w-6xl mx-auto px-4 py-10"><div className="flex justify-between mb-8"><h2 className="text-3xl font-serif text-white">Admin CMS</h2><Button onClick={() => setAdminLocked(true)}>Lock</Button></div><div className="flex gap-2 overflow-x-auto pb-4 mb-6">{['APPEARANCE', 'SERVICES', 'PRODUCTS', 'ORDERS'].map(t => <Button key={t} onClick={() => setTab(t)} variant={tab===t?'primary':'secondary'}>{t}</Button>)}</div>
         {tab === 'APPEARANCE' && <Card className="p-6"><h3 className="font-bold mb-4">Branding</h3><div className="grid md:grid-cols-2 gap-4"><Input label="Salon Name" value={editConfig.salonName} onChange={(e:any)=>setEditConfig({...editConfig, salonName: e.target.value})}/><Input label="Contact" value={editConfig.contactNumber} onChange={(e:any)=>setEditConfig({...editConfig, contactNumber: e.target.value})}/></div><Button onClick={()=>{db.updateSiteConfig(editConfig); refreshData(); setSuccessMsg("Saved");}} className="mt-4">Save</Button></Card>}
         {tab === 'SERVICES' && <div className="space-y-4"><Card className="p-6"><Input placeholder="Name" onChange={(e:any)=>setNewItem({...newItem, name: e.target.value})}/><Input placeholder="Price" type="number" onChange={(e:any)=>setNewItem({...newItem, price: Number(e.target.value)})}/><Button className="mt-4" onClick={()=>{db.saveServices([...services, {id: Date.now().toString(), image:'https://picsum.photos/300', ...newItem}]); refreshData();}}>Add</Button></Card>{services.map((s:any)=><Card key={s.id} className="p-4 flex justify-between"><p>{s.name}</p><button onClick={()=>{db.saveServices(services.filter((x:any)=>x.id!==s.id)); refreshData();}}><Trash2/></button></Card>)}</div>}
         {tab === 'ORDERS' && <div className="space-y-4">{bookings.map((b:any)=><Card key={b.id} className="p-4 flex justify-between"><div><p className="font-bold">{b.serviceName}</p><p className="text-sm text-gray-400">{b.userName}</p></div><div className="flex gap-2">{b.status==='PENDING'&&<Button onClick={()=>{db.updateBookingStatus(b.id,'CONFIRMED'); refreshData();}} className="text-xs bg-green-600">Accept</Button>}<span className="text-yellow-500 text-xs font-bold">{b.status}</span></div></Card>)}</div>}
       </div>
    );
};

const Shop = ({ products, cart, setCart, setIsCheckoutOpen, handleAddToCart }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    return (<div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Shop" /><div className="flex justify-end mb-4"><Button onClick={()=>setIsCheckoutOpen(true)}>Checkout (₹{cart.reduce((s:number,i:any)=>s+i.price*i.quantity,0)})</Button></div><div className="grid md:grid-cols-4 gap-6">{products.filter((p:any)=>p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p:any)=><Card key={p.id}><img src={p.image} className="h-48 w-full object-cover"/><div className="p-4"><h4 className="font-bold">{p.name}</h4><p className="text-yellow-500">₹{p.price}</p><Button onClick={()=>handleAddToCart(p)} className="w-full mt-2 text-xs">Add</Button></div></Card>)}</div></div>);
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [config, setConfig] = useState<SiteConfig>(db.getSiteConfig());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [adminLocked, setAdminLocked] = useState(true);
  const [data, setData] = useState<any>({ services:[], products:[], bookings:[], orders:[], reviews:[], gallery:[], offers:[], team:[], customPages:[] });
  const [successMsg, setSuccessMsg] = useState('');
  const [bookingModal, setBookingModal] = useState<any>({ isOpen: false, item: null, type: 'SERVICE' });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const refresh = () => {
      setConfig(db.getSiteConfig());
      setData({ services: db.getServices(), products: db.getProducts(), bookings: db.getBookings(), orders: db.getOrders(), reviews: db.getReviews(), gallery: db.getGallery(), offers: db.getOffers(), team: db.getTeam(), customPages: db.getCustomPages() });
  };

  useEffect(() => { const sub = db.subscribeToData(() => { refresh(); setLoading(false); }); return () => sub(); }, []);
  const addToCart = (p: Product) => { setCart(prev => { const ex = prev.find(x=>x.id===p.id); return ex ? prev.map(x=>x.id===p.id?{...x, quantity: x.quantity+1}:x) : [...prev, {...p, quantity:1}]; }); setSuccessMsg("Added!"); };

  if (loading) return <Splash onFinish={() => {}} />;
  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  const Home = () => (<div className="animate-fade-in"><div className="relative h-[60vh] w-full flex items-center justify-center"><img src={config.heroImageUrl} className="absolute inset-0 w-full h-full object-cover brightness-50" /><div className="relative z-10 text-center"><h1 className="text-6xl font-serif mb-4">{config.salonName}</h1><Button onClick={()=>setCurrentPage('services')}>Book Now</Button></div></div></div>);
  const activePage = data.customPages.find((p:any) => p.id === currentPage);

  return (
    <Layout user={currentUser} config={config} cartCount={cart.length} onNavigate={setCurrentPage} currentPage={currentPage} onLogout={()=>setCurrentUser(null)} customPages={data.customPages}>
      <BookingModal isOpen={bookingModal.isOpen} onClose={()=>setBookingModal({...bookingModal, isOpen:false})} item={bookingModal.item} type={bookingModal.type} currentUser={currentUser} config={config} onConfirm={(d:any)=>{ db.addBooking({id:Date.now().toString(), userId:currentUser.id, userName:d.name, userMobile:d.mobile, userAddress:d.address, serviceId:bookingModal.item.id, serviceName:bookingModal.item.name||bookingModal.item.title, date:d.date, time:d.time, status:'PENDING', timestamp:Date.now()}); setBookingModal({isOpen:false}); setSuccessMsg("Booked!"); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={()=>setIsCheckoutOpen(false)} totalAmount={cart.reduce((s,i)=>s+i.price*i.quantity,0)} currentUser={currentUser} config={config} onConfirm={(d:any)=>{ db.addOrder({id:Date.now().toString(), userId:currentUser.id, userName:d.name, userMobile:d.mobile, userAddress:d.address, items:cart, totalAmount:cart.reduce((s,i)=>s+i.price*i.quantity,0), status:'PENDING', date:new Date().toLocaleDateString(), timestamp:Date.now()}); setCart([]); setIsCheckoutOpen(false); setSuccessMsg("Ordered!"); }} />
      <SuccessModal isOpen={!!successMsg} onClose={()=>setSuccessMsg('')} message={successMsg} />
      {currentPage === 'home' && <Home />}
      {currentPage === 'services' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Services" /><div className="grid md:grid-cols-3 gap-6">{data.services.map((s:any)=><Card key={s.id}><img src={s.image} className="h-56 w-full object-cover"/><div className="p-4"><h3 className="font-bold">{s.name}</h3><p className="text-yellow-500">₹{s.price}</p><Button onClick={()=>setBookingModal({isOpen:true, item:s, type:'SERVICE'})} className="w-full mt-2">Book</Button></div></Card>)}</div></div>}
      {currentPage === 'shop' && <Shop products={data.products} cart={cart} setCart={setCart} setIsCheckoutOpen={setIsCheckoutOpen} handleAddToCart={addToCart} />}
      {currentPage === 'bookings' && <div className="max-w-4xl mx-auto px-4 py-10"><SectionTitle title="Activity" /><div className="space-y-4">{data.bookings.filter((b:any)=>b.userId===currentUser.id).map((b:any)=><Card key={b.id} className="p-4"><div className="flex justify-between"><h4>{b.serviceName}</h4><span className="text-yellow-500">{b.status}</span></div><StatusStepper status={b.status}/></Card>)}</div></div>}
      {currentPage === 'admin' && (currentUser.role === 'ADMIN' ? <AdminPanel currentUser={currentUser} config={config} {...data} refreshData={refresh} setSuccessMsg={setSuccessMsg} setAdminLocked={setAdminLocked} /> : <Home />)}
      {activePage && <div className="p-10"><SectionTitle title={activePage.title} /><p className="text-gray-300">{activePage.content}</p></div>}
    </Layout>
  );
}
