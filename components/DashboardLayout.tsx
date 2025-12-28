import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Settings, 
  Bell, 
  Search,
  TrendingUp,
  Menu,
  ClipboardList,
  Layers,
  LogOut,
  X
} from 'lucide-react';
import { DashboardStat } from '../types';

// Mock Data
const STATS: DashboardStat[] = [
  { label: 'Documents Processed (24h)', value: '1,420', change: '+12%', trend: 'up', icon: FileText },
  { label: 'Risk Flags Detected', value: '3', change: 'Requires Review', trend: 'down', icon: ShieldAlert },
  { label: 'Est. Leakage Prevented', value: '$45,200', change: 'YTD', trend: 'up', icon: TrendingUp },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode, activeView: string, onViewChange: (view: string) => void }> = ({ children, activeView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <div className="flex h-screen bg-corporate-900 overflow-hidden font-sans text-gray-100">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-corporate-950/90 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="fixed inset-y-0 left-0 w-64 bg-corporate-950 border-r border-corporate-800 shadow-2xl transform transition-transform duration-300 ease-in-out" onClick={e => e.stopPropagation()}>
             <div className="flex items-center justify-between h-16 px-6 border-b border-corporate-800">
               <span className="text-lg font-bold tracking-tight text-white">AXIOM<span className="text-corporate-accentLight">CHAIN</span></span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
             </div>
             <nav className="flex-1 px-4 py-6 space-y-1">
                <SidebarItem 
                  icon={LayoutDashboard} 
                  label="Control Center" 
                  active={activeView === 'control-center'} 
                  onClick={() => handleNavClick('control-center')}
                />
                <SidebarItem 
                  icon={Layers} 
                  label="Workbench" 
                  active={activeView === 'workbench'} 
                  onClick={() => handleNavClick('workbench')}
                />
                <SidebarItem 
                  icon={ClipboardList} 
                  label="Audit Log" 
                  active={activeView === 'audit-log'}
                  onClick={() => handleNavClick('audit-log')} 
                />
                <SidebarItem 
                  icon={Settings} 
                  label="Configuration" 
                  active={activeView === 'configuration'}
                  onClick={() => handleNavClick('configuration')} 
                />
             </nav>
             <div className="p-4 border-t border-corporate-800 absolute bottom-0 w-full bg-corporate-950">
               <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full">
                 <LogOut size={14} /> Sign Out
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-corporate-950 border-r border-corporate-800">
        <div className="flex items-center h-16 px-6 border-b border-corporate-800">
          <span className="text-lg font-bold tracking-tight text-white">AXIOM<span className="text-corporate-accentLight">CHAIN</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Control Center" 
            active={activeView === 'control-center'} 
            onClick={() => onViewChange('control-center')}
          />
          <SidebarItem 
            icon={Layers} 
            label="Workbench" 
            active={activeView === 'workbench'} 
            onClick={() => onViewChange('workbench')}
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Audit Log" 
            active={activeView === 'audit-log'}
            onClick={() => onViewChange('audit-log')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Configuration" 
            active={activeView === 'configuration'}
            onClick={() => onViewChange('configuration')} 
          />
        </nav>

        <div className="p-4 border-t border-corporate-800">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Operational
          </div>
          <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-corporate-900">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-corporate-900 border-b border-corporate-800 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-400 hover:text-white p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer">Operations</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-white">
                {activeView === 'control-center' ? 'Control Center' : 
                 activeView === 'audit-log' ? 'Audit Log' : 
                 activeView === 'configuration' ? 'Configuration' : 'Workbench'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search Document ID..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-corporate-800 border border-corporate-700 text-gray-200 rounded-md focus:outline-none focus:border-corporate-accent w-32 md:w-48 transition-all placeholder-gray-600"
              />
            </div>
            <button className="text-gray-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-corporate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-corporate-800 flex items-center justify-center text-corporate-accentLight font-semibold text-xs border border-corporate-700">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 h-full flex flex-col">
            
            {/* Header Text & Stats */}
            {activeView === 'control-center' && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Operational Status</h1>
                    <p className="text-sm text-gray-400 mt-1">Real-time monitoring of the intelligence layer.</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-500">Last updated: Just now</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-corporate-800 p-5 rounded-lg border border-corporate-700 shadow-sm flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                        <p className={`mt-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className="p-2 bg-corporate-900 rounded-md border border-corporate-700">
                        <stat.icon className="w-5 h-5 text-corporate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Content Area */}
            <div className={`bg-corporate-800 rounded-lg border border-corporate-700 shadow-xl overflow-hidden ${activeView === 'configuration' ? 'flex-1' : 'min-h-[500px] md:min-h-[600px]'}`}>
               {children}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all mb-1 ${
    active 
      ? 'bg-corporate-800 text-white border-l-2 border-corporate-accentLight' 
      : 'text-gray-400 hover:text-white hover:bg-corporate-800/50'
  }`}>
    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${active ? 'text-corporate-accentLight' : 'text-gray-500 group-hover:text-gray-300'}`} />
    {label}
  </button>
);