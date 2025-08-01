import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  suffix?: string;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, value, onChange, type = 'number', placeholder, suffix, className }, ref) => {
    return (
      <div className={clsx('space-y-2', className)}>
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/30 focus:bg-white transition-all duration-300 text-slate-800 font-medium hover:border-slate-300 hover:shadow-sm"
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
