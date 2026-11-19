import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`card-shell relative flex min-h-0 flex-col overflow-hidden rounded-lg border border-[color:var(--gov-border)] bg-[var(--gov-bg-panel)] ${className}`}>
      <div className="flex h-9 shrink-0 items-center border-b border-[color:var(--gov-border)] px-3">
        <h2 className="truncate text-sm font-semibold tracking-normal text-[var(--gov-text-primary)]">{title}</h2>
      </div>
      <div className="card-body min-h-0 min-w-0 flex-1 overflow-hidden p-3">
        {children}
      </div>
    </div>
  );
}
