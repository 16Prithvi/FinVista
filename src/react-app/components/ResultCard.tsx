import clsx from 'clsx';

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: 'default' | 'success' | 'primary';
  className?: string;
}

export default function ResultCard({ title, value, subtitle, variant = 'default', className }: ResultCardProps) {
  return (
    <div className={clsx(
      'p-4 rounded-xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300',
      variant === 'success' && 'bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-50',
      variant === 'primary' && 'bg-blue-50/80 border-blue-200/60 hover:bg-blue-50',
      variant === 'default' && 'bg-slate-50/80 border-slate-200/60 hover:bg-slate-50',
      className
    )}>
      <p className={clsx(
        'text-sm font-semibold mb-1',
        variant === 'success' && 'text-emerald-600',
        variant === 'primary' && 'text-blue-600',
        variant === 'default' && 'text-slate-600'
      )}>
        {title}
      </p>
      <p className={clsx(
        'text-2xl font-bold',
        variant === 'success' && 'text-emerald-800',
        variant === 'primary' && 'text-blue-800',
        variant === 'default' && 'text-slate-800'
      )}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
