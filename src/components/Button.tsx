import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'fintrack-primary' | 'fintrack-secondary';
  size?: 'sm' | 'md' | 'lg' | 'fintrack'; // Added fintrack size
  leftIcon?: React.ReactNode; // Can be string for Material Icon name or ReactNode
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'fintrack-primary', // Default to new FinTrack style
  size = 'fintrack',         // Default to new FinTrack size
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  // Updated variants for FinTrack
  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 focus-visible:outline-sky-600', // Keep old primary for now
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 focus-visible:outline-slate-600', // Keep old secondary
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus-visible:outline-red-600',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400 border border-slate-300 focus-visible:outline-slate-600',
    'fintrack-primary': 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-blue-600',
    'fintrack-secondary': 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus-visible:outline-blue-600', // Blue focus for accessibility
  };

  // Updated sizes for FinTrack
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs', // Adjusted for smaller text like in FinTrack
    md: 'px-4 py-2 text-sm',   // Adjusted
    lg: 'px-6 py-3 text-base',  // Adjusted
    fintrack: 'px-4 py-2.5 text-sm min-w-[160px]', // Matches FinTrack quick action buttons
  };
  
  const iconBaseClass = "material-icons-sharp"; // Assuming Material Icons Sharp

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && (
        <span className={`${typeof leftIcon === 'string' ? iconBaseClass : ''} ${children ? 'mr-2' : ''} text-lg`}>{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className={`${typeof rightIcon === 'string' ? iconBaseClass : ''} ${children ? 'ml-2' : ''} text-lg`}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
