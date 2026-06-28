"use client";

import { memo } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Bell, 
  CheckSquare, 
  FileText, 
  CloudSun, 
  Settings, 
  PenTool, 
  ChevronDown 
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  criticalAlertsCount: number; 
}

const Sidebar = memo(function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'farms', label: 'Farms', icon: Sprout },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'design-spec', label: 'Design Specs', icon: PenTool },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="h-full w-64 xl:w-20 2xl:w-64 bg-[#121c17] flex flex-col transition-all duration-300 z-50 overflow-hidden shadow-2xl xl:shadow-none border-r border-[#1a2820]">
      <div className="pt-8 pb-6 flex items-center justify-center 2xl:justify-start 2xl:px-7 shrink-0">
        <Sprout className="h-6 w-6 text-[#5ebd73] shrink-0" strokeWidth={2.5} />
        <div className="ml-3 flex flex-col xl:hidden 2xl:flex">
          <span className="text-xl font-extrabold text-white tracking-tight leading-none">
            AgriVision
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-none">
            Regional<br/>Overview
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5 flex flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                "w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ebd73]",
                isActive 
                  ? "bg-[#1c2a23] text-white" 
                  : "text-gray-400 hover:bg-[#1c2a23]/50 hover:text-gray-200"
              )}
            >
              <div className="relative flex items-center justify-center xl:mx-auto 2xl:mx-0">
                <Icon className={clsx("h-5 w-5 transition-transform duration-200", isActive && "scale-105")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={clsx("ml-3.5 font-bold text-sm xl:hidden 2xl:block", isActive ? "text-white" : "text-gray-300")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-4 shrink-0">
        <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#233129] hover:bg-[#2a3a31] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ebd73]">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-[#6a84c9] flex items-center justify-center text-white font-extrabold text-sm shrink-0">
              D
            </div>
            <div className="ml-3 flex flex-col text-left xl:hidden 2xl:flex">
              <span className="text-sm font-bold text-white leading-tight">Director</span>
              <span className="text-[10px] text-gray-400 font-medium">Regional Director</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 xl:hidden 2xl:block" />
        </button>
      </div>

    </nav>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;