import React, { useState, useEffect } from 'react';
// Note: Ensure types.ts, storage.ts, components/Layout.tsx, components/UI.tsx exist
import { User, SiteConfig, CartItem, Service, Product, Booking, Review, GalleryItem, Offer, TeamMember, Order, CustomPage } from './types';
import * as db from './services/storage';
import Layout from './components/Layout';
import { Button, Input, Card, SectionTitle, Accordion } from './components/UI';
import { LogIn, UserPlus, Star, Trash2, Edit2, Plus, Camera, MapPin, Phone, Mail, CheckCircle, Clock, X, AlertCircle, Check, Gift, Shield, Lock, Image as ImageIcon, ShoppingBag, Package, Calendar, Truck, Bell, ArrowRight, Smartphone, Zap, Award, Droplets, Search, Tag, Ticket, Info, RotateCcw, FileText, MessageSquare, Users, LogOut } from 'lucide-react';
import { ADMIN_MOBILE } from './constants';

// --- Sub-Components ---

const Splash = ({ onFinish }: any) => {
  useEffect(() => { const t = setTimeout(onFinish, 2000); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center animate-fade-out">
      <h1 className="text-6xl font-serif text-yellow-500 animate-pulse mb-4">Lotoria</h1>
      <p className="text-xs text-gray-400 animate-bounce">Loading Luxury...</p>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, message }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-yellow-500 p-8 rounded-xl text-center w-full max-w-sm">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl text-white mb-2">Success!</h3>
                <p className="text-gray-400 mb-6">{message}</p>
                <Button onClick={onClose} className="w-full">Done</Button>
            </div>
        </div>
    );
};

const BookingModal = ({ isOpen, onClose, item, type, onConfirm, currentUser, config }: any) => {
  const [d, setD] = useState({ name: currentUser?.name||'', mobile: currentUser?.mobile||'', address: currentUser?.address||'', date: '', time: '' });
  useEffect(() => { if(isOpen) setD({ name: currentUser?.name||'', mobile: currentUser?.mobile||'', address: currentUser?.address||'', date: '', time: '' }) }, [isOpen]);
  
  if (!isOpen || !item) return null;
  const amt = type === 'SERVICE' ? item.price : item.finalPrice || 0;
  const upi = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}&am=${amt}&cu=INR`;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
       <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X/></button>
          <h3 className="text-xl font-bold text-yellow-500 mb-4">Booking Details</h3>
          <div className="space-y-4">
             <Input label="Name" value={d.name} onChange={(e:any)=>setD({...d,name:e.target.value})} />
             <Input label="Mobile" value={d.mobile} onChange={(e:any)=>setD({...d,mobile:e.target.value})} />
             <Input label="Address" value={d.address} onChange={(e:any)=>setD({...d,address:e.target.value})} />
             <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-black border border-gray-700 p-3 rounded text-white" onChange={(e:any)=>setD({...d,date:e.target.value})} />
                <input type="time" className="bg-black border border-gray-700 p-3 rounded text-white" onChange={(e:any)=>setD({...d,time:e.target.value})} />
             </div>
             <div className="bg-white p-2 rounded inline-block mt-4"><img src={config.qrCodeUrl} className="w-32 h-32" /></div>
             <p className="text-lg font-bold text-white">Total: ₹{amt}</p>
             <a href={upi} className="block w-full bg-blue-600 text-white py-2 rounded text-center mb-2">Pay via UPI App</a>
             <Button onClick={()=>onConfirm(d)} className="w-full">Confirm Booking</Button>
          </div>
       </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, totalAmount, currentUser, config, onConfirm }: any) => {
    const [d, setD] = useState({ name: currentUser?.name||'', mobile: currentUser?.mobile||'', address: currentUser?.address||'' });
    if (!isOpen) return null;
    const upi = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}&am=${totalAmount}&cu=INR`;
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
           <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X/></button>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Checkout</h3>
              <div className="space-y-4">
                 <Input label="Name" value={d.name} onChange={(e:any)=>setD({...d,name:e.target.value})} />
                 <Input label="Mobile" value={d.mobile} onChange={(e:any)=>setD({...d,mobile:e.target.value})} />
                 <Input label="Address" value={d.address} onChange={(e:any)=>setD({...d,address:e.target.value})} />
                 <div className="text-center mt-4">
                    <div className="bg-white p-2 rounded inline-block"><img src={config.qrCodeUrl} className="w-32 h-32" /></div>
                    <p className="text-lg font-bold text-white my-2">Total: ₹{totalAmount}</p>
                    <a href={upi} className="block w-full bg-blue-600 text-white py-2 rounded mb-2">Pay via UPI App</a>
                    <Button onClick={()=>onConfirm(d)} className="w-full">Confirm Order</Button>
                 </div>
              </div>
           </div>
        </div>
    );
};

const Auth = ({ onLogin }: any) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name:'', mobile:'', email:'', address:'', otp:'' });
  const [step, setStep] = useState('DETAILS');
  const submit = (e:any) => {
    e.preventDefault();
    if(step==='DETAILS'){ setStep('OTP'); alert('OTP: 1234'); }
    else {
      if(form.otp==='1234'){
         const user = { id: Date.now().toString(), ...form, role: form.mobile === ADMIN_MOBILE ? 'ADMIN' : 'CUSTOMER' };
         if(isSignup) db.saveUser(user);
         else { const ex = db.loginUser(form.mobile); if(ex) onLogin(ex); else alert("User not found"); }
         if(isSignup) onLogin(user);
      } else alert('Invalid OTP');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-white/10">
        <h2 className="text-3xl text-yellow-500 mb-6 text-center">{isSignup?'Register':'Login'}</h2>
        <form onSubmit={submit} className="space-y-4">
          {step==='DETAILS' ? (<>{isSignup&&<><Input placeholder="Name" onChange={(e:any)=>setForm({...form,name:e.target.value})}/><Input placeholder="Address" onChange={(e:any)=>setForm({...form,address:e.target.value})}/></>}<Input placeholder="Mobile" onChange={(e:any)=>setForm({...form,mobile:e.target.value})}/></>) : <Input placeholder="OTP (1234)" onChange={(e:any)=>setForm({...form,otp:e.target.value})}/>}
          <Button className="w-full">{step==='DETAILS'?'Send OTP':'Verify'}</Button>
        </form>
        <div className="mt-6 text-center"><button onClick={()=>{setIsSignup(!isSignup);setStep('DETAILS')}} className="text-gray-400 hover:text-white text-sm">{isSignup ? 'Login instead' : 'Create Account'}</button></div>
      </div>
    </div>
  );
};

const AdminPanel = ({ config, services, bookings, orders, refreshData, setSuccessMsg, setAdminLocked }: any) => {
    const [tab, setTab] = useState('ORDERS');
    const [newItem, setNewItem] = useState<any>({});
    return (
       <div className="max-w-6xl mx-auto px-4 py-10">
         <div className="flex justify-between mb-6"><h2 className="text-3xl text-white">Admin</h2><Button onClick={()=>setAdminLocked(true)}>Lock</Button></div>
         <div className="flex gap-4 mb-6 overflow-x-auto"><Button onClick={()=>setTab('ORDERS')}>Orders</Button><Button onClick={()=>setTab('SERVICES')}>Services</Button><Button onClick={()=>setTab('PRODUCTS')}>Products</Button></div>
         {tab==='ORDERS' && <div className="space-y-4">{bookings.map((b:any)=><Card key={b.id} className="p-4 flex justify-between"><div><h4>{b.serviceName}</h4><p className="text-sm text-gray-400">{b.userName}</p></div>{b.status==='PENDING'&&<Button onClick={()=>{db.updateBookingStatus(b.id,'CONFIRMED');refreshData()}} className="bg-green-600 text-xs">Accept</Button>}</Card>)}{orders.map((o:any)=><Card key={o.id} className="p-4 flex justify-between"><div><h4>Order #{o.id.slice(-4)}</h4><p className="text-sm text-gray-400">{o.userName}</p></div>{o.status==='PENDING'&&<Button onClick={()=>{db.updateOrderStatus(o.id,'CONFIRMED');refreshData()}} className="bg-green-600 text-xs">Accept</Button>}</Card>)}</div>}
         {tab==='SERVICES' && <div className="space-y-4"><Card className="p-6"><Input placeholder="Name" onChange={(e:any)=>setNewItem({...newItem,name:e.target.value})}/><Input placeholder="Price" type="number" onChange={(e:any)=>setNewItem({...newItem,price:Number(e.target.value)})}/><Button onClick={()=>{db.saveServices([...services,{id:Date.now().toString(),image:'https://picsum.photos/300',...newItem}]);refreshData()}} className="mt-2">Add</Button></Card>{services.map((s:any)=><Card key={s.id} className="p-4 flex justify-between"><p>{s.name}</p><Button onClick={()=>{db.saveServices(services.filter((x:any)=>x.id!==s.id));refreshData()}} className="bg-red-600 text-xs">Del</Button></Card>)}</div>}
       </div>
    );
};

const Shop = ({ products, cart, setCart, setIsCheckoutOpen }: any) => (
    <div className="max-w-7xl mx-auto px-4 py-10">
        <SectionTitle title="Shop" />
        <div className="flex justify-end mb-4"><Button onClick={()=>setIsCheckoutOpen(true)}>Cart (₹{cart.reduce((s:number,i:any)=>s+i.price*i.quantity,0)})</Button></div>
        <div className="grid md:grid-cols-4 gap-6">{products.map((p:any)=><Card key={p.id}><img src={p.image} className="h-48 w-full object-cover"/><div className="p-4"><h4 className="font-bold">{p.name}</h4><p className="text-yellow-500">₹{p.price}</p><Button onClick={()=>{setCart((old:any)=>[...old,{...p,quantity:1}])}} className="w-full mt-2 text-xs">Add</Button></div></Card>)}</div>
    </div>
);

const StatusStepper = ({ status }: { status: string }) => {
    const steps = ['PENDING', 'CONFIRMED', 'COMPLETED'];
    let idx = status === 'PENDING' ? 0 : status === 'CONFIRMED' ? 1 : 2;
    return (<div className="flex justify-between mt-4"><div className="absolute w-full h-1 bg-gray-800 top-4 -z-10"></div>{steps.map((s, i) => <div key={s} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i <= idx ? 'bg-yellow-500 text-black' : 'bg-gray-800'}`}>{i+1}</div>)}</div>);
};

const CustomPageView = ({ page }: { page: CustomPage }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in min-h-[60vh]"><SectionTitle title={page.title} /><Card className="p-8"><div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">{page.content}</div></Card></div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState('home');
  const [config, setConfig] = useState<any>(db.getSiteConfig());
  const [cart, setCart] = useState<any[]>([]);
  const [data, setData] = useState<any>({ services:[], products:[], bookings:[], orders:[], customPages:[], reviews:[], gallery:[], offers:[], team:[] });
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState<any>({ open: false, item: null, type: 'SERVICE' });
  const [checkout, setCheckout] = useState(false);
  const [adminLocked, setAdminLocked] = useState(true);

  const refresh = () => { setConfig(db.getSiteConfig()); setData({ services: db.getServices(), products: db.getProducts(), bookings: db.getBookings(), orders: db.getOrders(), customPages: db.getCustomPages(), reviews: db.getReviews(), gallery: db.getGallery(), offers: db.getOffers(), team: db.getTeam() }); };
  useEffect(() => { const sub = db.subscribeToData(() => { refresh(); setLoading(false); }); return () => sub(); }, []);

  if (loading) return <Splash onFinish={()=>{}} />;
  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  const activePageData = data.customPages.find((p:any) => p.id === page);

  return (
    <Layout user={currentUser} config={config} cartCount={cart.length} onNavigate={setPage} currentPage={page} onLogout={()=>setCurrentUser(null)} customPages={data.customPages}>
      <BookingModal isOpen={modal.open} onClose={()=>setModal({open:false})} item={modal.item} type={modal.type} currentUser={currentUser} config={config} onConfirm={(d:any)=>{ db.addBooking({id:Date.now().toString(), userId:currentUser.id, userName:d.name, userMobile:d.mobile, userAddress:d.address, serviceId:modal.item.id, serviceName:modal.item.name||modal.item.title, date:d.date, time:d.time, status:'PENDING', timestamp:Date.now()}); setModal({open:false}); setMsg("Booked!"); }} />
      <CheckoutModal isOpen={checkout} onClose={()=>setCheckout(false)} totalAmount={cart.reduce((s,i)=>s+i.price*i.quantity,0)} currentUser={currentUser} config={config} onConfirm={(d:any)=>{ db.addOrder({id:Date.now().toString(), userId:currentUser.id, userName:d.name, userMobile:d.mobile, userAddress:d.address, items:cart, totalAmount:cart.reduce((s,i)=>s+i.price*i.quantity,0), status:'PENDING', date:new Date().toLocaleDateString(), timestamp:Date.now()}); setCart([]); setCheckout(false); setMsg("Ordered!"); }} />
      <SuccessModal isOpen={!!msg} onClose={()=>setMsg('')} message={msg} />
      
      {page==='home' && <div className="text-center py-20 animate-fade-in"><h1 className="text-6xl text-yellow-500 font-serif mb-6">{config.salonName}</h1><Button onClick={()=>setPage('services')}>Book Now</Button></div>}
      {page==='services' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Services" /><div className="grid md:grid-cols-3 gap-6">{data.services.map((s:any)=><Card key={s.id}><img src={s.image} className="h-48 w-full object-cover"/><div className="p-4"><h3 className="font-bold">{s.name}</h3><p className="text-yellow-500">₹{s.price}</p><Button onClick={()=>setModal({open:true,item:s,type:'SERVICE'})} className="w-full mt-2">Book</Button></div></Card>)}</div></div>}
      {page==='shop' && <Shop products={data.products} cart={cart} setCart={setCart} setIsCheckoutOpen={setCheckout} />}
      {page==='bookings' && <div className="max-w-4xl mx-auto px-4 py-10"><SectionTitle title="Activity" /><div className="space-y-4">{data.bookings.filter((b:any)=>b.userId===currentUser.id).map((b:any)=><Card key={b.id} className="p-4"><div className="flex justify-between"><h4>{b.serviceName}</h4><span className="text-yellow-500">{b.status}</span></div><StatusStepper status={b.status}/></Card>)}</div></div>}
      {page==='admin' && (currentUser.role === 'ADMIN' ? <AdminPanel config={config} {...data} refreshData={refresh} setSuccessMsg={setMsg} setAdminLocked={setAdminLocked} /> : <div className="p-10 text-center">Access Denied</div>)}
      {activePageData && <CustomPageView page={activePageData} />}
      
      {/* Missing Pages Fallback */}
      {page==='offers' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Offers" /><div className="grid md:grid-cols-3 gap-6">{data.offers.map((o:any)=><Card key={o.id}><img src={o.image} className="h-48 w-full object-cover"/><div className="p-4"><h3 className="font-bold">{o.title}</h3><Button onClick={()=>setModal({open:true,item:o,type:'OFFER'})} className="w-full mt-2">Book Deal</Button></div></Card>)}</div></div>}
      {page==='gallery' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Gallery" /><div className="grid md:grid-cols-3 gap-6">{data.gallery.map((g:any)=><Card key={g.id}><img src={g.imageUrl} className="h-64 w-full object-cover"/><p className="p-2 text-center">{g.caption}</p></Card>)}</div></div>}
      {page==='reviews' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Reviews" /><div className="grid md:grid-cols-2 gap-6">{data.reviews.map((r:any)=><Card key={r.id} className="p-4"><p>"{r.comment}"</p><p className="text-right text-yellow-500">- {r.userName}</p></Card>)}</div></div>}
      {page==='about' && <div className="max-w-4xl mx-auto px-4 py-10 text-center"><SectionTitle title="About Us" /><p>{config.missionStatement}</p></div>}
    </Layout>
  );
}
