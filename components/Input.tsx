import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: string; // Material icon name
}

const Input: React.FC<InputProps> = ({ label, id, error, className = '', containerClassName = '', leftIcon, ...props }) => {
  const baseInputClasses = `block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-slate-400`;
  const inputPadding = leftIcon ? 'pl-10 pr-3 py-2' : 'px-3 py-2';

  return (
    <div className={` ${containerClassName}`}> {/* Removed mb-4, handle spacing in parent */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons-sharp text-slate-400 text-lg">{leftIcon}</span>
            </div>
        )}
        <input
            id={id}
            className={`${baseInputClasses} ${inputPadding} ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
