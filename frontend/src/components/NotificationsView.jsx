import React from 'react';
import { Bell, Tag, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'price_drop', title: 'Price Drop Alert: Samsung S24 Ultra', desc: 'Wholesale price dropped by ₹4,500 at Nehru Place bazaar.', time: '10 mins ago', icon: TrendingDown, color: 'text-emerald-700 bg-emerald-50' },
  { id: 2, type: 'coupon', title: 'New Coupon Found: SAVE5000', desc: 'ICICI Bank instant cashback code valid on Amazon India.', time: '1 hour ago', icon: Tag, color: 'text-[#C9A76A] bg-[#C9A76A]/10' },
  { id: 3, type: 'success', title: 'Negotiation Victory: MacBook Air M3', desc: 'AI Negotiator secured 10.3% discount target.', time: '3 hours ago', icon: CheckCircle2, color: 'text-[#7A5C45] bg-[#7A5C45]/10' },
];

export default function NotificationsView() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
          <Bell className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Real-Time Alert Feed</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
          Notification Center
        </h2>
        <p className="text-xs text-[#6B5E54]">
          Live price alerts, coupon discoveries, and AI negotiation milestones.
        </p>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 flex items-start space-x-4 shadow-luxury-sm"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold font-serif text-[#3F3024]">{n.title}</h4>
                  <span className="text-[10px] text-[#7A5C45] font-semibold">{n.time}</span>
                </div>
                <p className="text-xs text-[#6B5E54]">{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
