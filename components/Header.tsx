import React from 'react';
import { APP_NAME, NAV_ITEMS } from '../constants';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  // setCurrentView: (view: AppView) => void; // Prop removed
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  // Filter NAV_ITEMS to only include those intended for the top bar
  const topNavItems = NAV_ITEMS.filter(item => 
    [AppView.DASHBOARD, AppView.TRANSACTIONS, AppView.EMERGENCY_FUND, AppView.NET_WORTH, AppView.SETTINGS].includes(item.id as AppView)
    // Add AppView.BUDGETS, AppView.REPORTS here if they become top-level nav items
  );


  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 px-10 py-4 shadow-sm bg-white">
      <div className="flex items-center gap-3 text-slate-900">
        <img
          alt="FinTrack Logo"
          className="size-8"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIVx7s7ItRFEG5KwSbiYDzFO67IUlptNO2PyzfX44GuUsGXaHQvsGpRUemV4darSpcbGrJ8NL7cBz6uGVN-0j8GZFCn7ar20yZjxD3ycjDxfnD-EC8i6sFtSb327iLKHdt0oVY8fDxmWaPbYUXP-2MmkLqCReVwPcvR15gtZS-yvnp-TnJRo8W3_mEDSDDehKZKxt9762QKh-mEJVyntS4L1kRgbDqv2XOHxLkVYLKOTEeS9c7Bc-XjjR6W1qIAIJTGu1akmHjcLY"
        />
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900">{APP_NAME}</h2>
      </div>
      <nav className="flex flex-1 justify-center">
        <div className="flex items-center gap-4 md:gap-8">
          {topNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                // e.preventDefault(); // Default is fine for hash links if not using React Router Links
                // setCurrentView(item.id as AppView); // Removed
                window.location.hash = item.id; // Apenas altera o hash
              }}
              className={`text-sm font-medium leading-normal transition-colors hover:text-slate-900 px-2 py-1 rounded-md
                ${currentView === item.id ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
          <span className="material-icons-sharp text-2xl">notifications</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 shadow-sm"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBlBZ04vtBrUPUSJRXNabBx0npM9X4eDcqzutSUV_Ozrm7ZGQH0G_Zuh11IS09KAEwb4RM8BgXg_x2C90EoA3eVeL4-aH5SUzLYsF4gN3FhsVq5spJl5S5iEHVrRFHXfePwSgieUh7rbWu4Uz-umyC0634qXh94Lar2oV_2zuaocN8_fj2pNuNsKWzxSbMffBu8NDHy8OYao1OboEI-mmiWeBeIx0j6c5VoC2tdECNYKqzu9S9gLcpkiLLTZIvRs3yko-DwgQJAauc")`,
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;