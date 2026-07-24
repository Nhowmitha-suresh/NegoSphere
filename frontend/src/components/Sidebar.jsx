import React from 'react';
import NegoSphereLogo3D from './NegoSphereLogo3D';

const CLEAN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'deal_finder', label: 'Search', icon: Search },
  { id: 'studio', label: 'Negotiations', icon: MessageSquareCode },
  { id: 'analytics', label: 'Insights', icon: LineChart },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <aside className="w-64 bg-[#F6F3EE]/90 backdrop-blur-2xl border-r border-[#5B4636]/10 flex flex-col justify-between p-5 min-h-screen select-none shrink-0 sticky top-0 h-screen overflow-y-auto">
      
      {/* Logo & Brand Header */}
      <div className="space-y-8">
        
        <div className="flex items-center space-x-2 px-1">
          <NegoSphereLogo3D size={42} animateAssembly={false} mode="idle" />
          <div>
            <h1 className="text-lg font-extrabold font-serif text-[#34271D] tracking-tight">
              Nego<span className="text-[#C6A164]">Sphere</span>
            </h1>
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#5B4636]">
              AI OS • v1.0
            </p>
          </div>
        </div>


        {/* Clean 7 Navigation Links */}
        <nav className="space-y-1">
          {CLEAN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => { playGlassTap(); setActiveTab(item.id); }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  active
                    ? 'bg-white text-[#34271D] shadow-luxury-sm border border-[#C6A164]/40 font-bold'
                    : 'text-[#5B4636]/80 hover:bg-white/60 hover:text-[#34271D]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition ${active ? 'text-[#C6A164]' : 'text-[#5B4636] group-hover:text-[#34271D]'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      {/* User Session Footer */}
      <div className="pt-6 border-t border-[#5B4636]/10 space-y-3">
        
        <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#5B4636]/10 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#34271D] text-[#C6A164] font-serif font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#34271D] truncate">{user?.name || 'Alexander Vance'}</div>
              <div className="text-[10px] text-[#5B4636] font-semibold truncate">Enterprise User</div>
            </div>
          </div>

          <button
            onClick={() => { playGlassTap(); onLogout(); }}
            title="Log Out"
            className="p-1.5 rounded-xl hover:bg-slate-200/50 text-[#5B4636] hover:text-[#34271D] transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
}
