import { ReactNode } from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function CalculatorCard({ title, description, children }: CalculatorCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200/40 shadow-2xl shadow-slate-200/50">
      <div className="p-6 border-b border-slate-200/40 bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-t-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">{title}</h2>
        <p className="text-slate-600 mt-2 leading-relaxed">{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
