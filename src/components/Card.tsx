import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`relative flex flex-col bg-[var(--gov-bg-panel)] border border-[color:var(--gov-border)] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(5,15,29,0.18)] rounded-sm ${className}`}>
{/* Header */}
      <div className="flex items-center px-4 py-2 bg-gradient-to-r from-[rgba(47,95,155,0.22)] via-[rgba(47,95,155,0.08)] to-transparent relative border-l-2 border-[color:var(--gov-gold)]">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[var(--gov-border-strong)] via-[var(--gov-border)] to-transparent" />
        <h2 className="text-[var(--gov-text-primary)] font-semibold tracking-[0.28em] text-sm">{title}</h2>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-3 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
