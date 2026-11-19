import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export function Modal({ title, subtitle, onClose, children, width = 560 }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative max-h-[82vh] rounded-lg border border-white/[0.12] bg-[var(--gov-bg-panel-strong)] shadow-[0_4px_12px_rgba(0,0,0,0.28)]"
        style={{ width, maxWidth: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <h3 className="truncate text-sm font-semibold tracking-normal text-[var(--gov-text-primary)]">{title}</h3>
            {subtitle && <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">{subtitle}</span>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gov-btn shrink-0 rounded-md p-1 text-[var(--gov-text-muted)] hover:bg-white/[0.06] hover:text-[var(--gov-text-primary)]"
            aria-label="关闭"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="custom-scrollbar overflow-y-auto p-4" style={{ maxHeight: 'calc(82vh - 52px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
