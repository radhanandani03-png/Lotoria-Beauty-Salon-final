import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Button = ({ className = '', variant = 'primary', ...props }: any) => {
  const base = "px-6 py-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50";
  const variants = { primary: "bg-yellow-500 text-black", secondary: "bg-gray-800 text-white", outline: "border border-yellow-500 text-yellow-500" };
  return <button className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props} />;
};
export const Card = ({ children, className = '' }: any) => <div className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden ${className}`}>{children}</div>;
export const Input = ({ label, className = '', ...props }: any) => (<div className="w-full">{label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}<input className={`w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none ${className}`} {...props} /></div>);
export const SectionTitle = ({ title }: any) => <div className="text-center mb-10"><h2 className="text-3xl font-serif font-bold text-white">{title}</h2><div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mt-2"></div></div>;
export const Accordion = ({ title, children }: any) => { const [o, s] = useState(false); return <div className="border border-white/10 rounded-xl mb-2"><button onClick={()=>s(!o)} className="w-full p-4 flex justify-between text-white font-bold">{title} {o?<ChevronUp/>:<ChevronDown/>}</button>{o && <div className="p-4 text-gray-400 border-t border-white/10">{children}</div>}</div> };
