import { ReactNode } from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{description}</p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-2 text-amber-700">
            <Construction className="w-5 h-5" />
            <span className="font-medium">Coming Soon</span>
          </div>
          <p className="text-amber-600 text-sm mt-2">
            This feature is currently under development and will be available in the next update.
          </p>
        </div>
      </div>
    </div>
  );
}
