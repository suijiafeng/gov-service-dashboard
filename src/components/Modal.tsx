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
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(4,14,32,0.7)] backdrop-blur-[2px]" />
      <div
        className="relative bg-[var(--gov-bg-panel-strong)] border border-[color:var(--gov-border-strong)] rounded-sm shadow-[0_18px_60px_rgba(3,12,28,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] animate-modal-in"
        style={{ width, maxWidth: '86vw', maxHeight: '82vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 四角装饰 */}
        {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(pos => (
          <div key={pos} className={`absolute w-3 h-3 border-[color:var(--gov-gold)] ${pos}`} />
        ))}

        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[color:var(--gov-border)] bg-gradient-to-r from-[rgba(46,123,209,0.28)] to-transparent">
          <div className="flex items-baseline space-x-2 min-w-0">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-[var(--gov-text-primary)] truncate">{title}</h3>
            {subtitle && <span className="text-[10px] text-[var(--gov-text-muted)] shrink-0">{subtitle}</span>}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 ml-3 p-0.5 text-[var(--gov-text-muted)] hover:text-white border border-transparent hover:border-[color:var(--gov-border)] rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(82vh - 44px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
