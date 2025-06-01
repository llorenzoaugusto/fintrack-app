import React from 'react';
import { AppView } from '@/types';
import { NAV_ITEMS, APP_NAME } from '@/constants';

interface PageSpecificSidebarProps {
  currentView: AppView;
  navigateToView: (view: AppView) => void;
}

const PageSpecificSidebar: React.FC<PageSpecificSidebarProps> = ({ currentView, navigateToView }) => {
  const handleNavClick = (viewId: AppView) => {
    navigateToView(viewId);
  };

  // Filter NAV_ITEMS to include items typically shown in a main sidebar
  const sidebarNavItems = NAV_ITEMS.filter(item => 
    [AppView.DASHBOARD, AppView.TRANSACTIONS, AppView.EMERGENCY_FUND, AppView.NET_WORTH, AppView.SETTINGS].includes(item.id as AppView)
    // Add AppView.BUDGETS, AppView.REPORTS here if they become main nav items for sidebar too
  );


  return (
    <aside className="flex flex-col w-64 bg-white p-4 border-r border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        {/* Placeholder SVG Logo - replace with actual or FinTrack image if available */}
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
        <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {sidebarNavItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id as AppView);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${currentView === item.id
                ? 'bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-200'
                : 'text-gray-700 hover:bg-gray-100 font-medium'
              }`}
          >
            <span className={`material-icons-outlined ${currentView === item.id ? 'text-blue-600' : 'text-gray-600'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4 pt-6">
        <div className="flex items-center gap-3">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200" 
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCK0vPhJ16MIZmiS0fKY_slRoYbwDT6Vr2SpahiK7EZsb0gYygl_-kRAUgilKLJlqUQZhPoNI4fB6OG-U8gsY9f06L_jOp9cRirIG7bARgFg90ISsx-HVCjaWhaWo0bp_hQpp_ZdbSR2G8cfnUtN8Td5bg9ZlBqb7XbwCIKT87j5ZTe6PbjdCu6LXEc1IAPc_nA64g1oq8Q6QEb35mqaq29pa9MBUGAF1vIHPY1ZpF1-O3mIUMJaW9T5aLTCX2HzVPzsWO_PwnopZw")` }}
            title="User Avatar"
          ></div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-base font-semibold">Sophia</h1>
            <p className="text-gray-500 text-sm">My Account</p>
          </div>
        </div>
        <button 
          onClick={() => alert('Log Out Clicked!')}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-sm font-medium"
        >
          <span className="material-icons-outlined">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default PageSpecificSidebar;