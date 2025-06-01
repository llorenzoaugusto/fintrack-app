import React from 'react';
import { AppView } from '@/types';

interface NavItemProps {
  view: AppView;
  label: string;
  icon: string; // Material icon name
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onClick?: () => void; // For closing sidebar on mobile, not used in new layout
  isTopNav?: boolean; // Hint for styling if repurposed
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, currentView, setCurrentView, onClick, isTopNav = false }) => {
  const isActive = currentView === view;

  if (isTopNav) {
    return (
         <a
            href={`#${view}`}
            onClick={(e) => {
            e.preventDefault();
            setCurrentView(view);
            if (onClick) onClick();
            }}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                        ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
        >
            <span className="material-icons-sharp mr-2 text-lg">{icon}</span>
            {label}
        </a>
    )
  }


  // Original sidebar styling (deprecated for current layout)
  return (
    <li>
      <a
        href={`#${view}`}
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(view);
          if (onClick) onClick();
        }}
        className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors duration-150
                    ${isActive ? 'bg-sky-600 text-white shadow-md' : 'text-slate-700 hover:bg-sky-100 hover:text-sky-700'}`}
      >
        <i className={`${icon} w-6 h-6 text-xl ${isActive ? 'text-white' : 'text-sky-500'}`}></i> {/* Original was Font Awesome */}
        <span className="ml-3">{label}</span>
      </a>
    </li>
  );
};

export default NavItem;
