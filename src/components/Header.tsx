import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, MonitorCog, Presentation } from 'lucide-react';
import { useAnnouncement } from '../hooks/useData';
import { useAlerts } from './DispatchPanel';
import type { DashboardMode } from '../App';

interface HeaderProps {
  mode: DashboardMode;
  onToggleMode: () => void;
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function TickerLine({ text, className }: { text: string; className: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const measure = measureRef.current;
    if (!outer || !measure) return;
    const update = () => setOverflows(measure.scrollWidth > outer.clientWidth + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div ref={outerRef} className="relative min-w-0 flex-1 overflow-hidden whitespace-nowrap">
      <span ref={measureRef} className={`invisible absolute text-[13px] ${className}`}>{text}</span>
      {overflows ? (
        <div className={`animate-marquee flex w-max text-[13px] ${className}`}>
          <span className="pr-16">{text}</span>
          <span className="pr-16">{text}</span>
        </div>
      ) : (
        <span className={`text-[13px] ${className}`}>{text}</span>
      )}
    </div>
  );
}

function formatClock(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function Header({ mode, onToggleMode }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const announcement = useAnnouncement();
  const alertsState = useAlerts();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 双击标题切换全屏（挂墙大屏部署时使用）
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const hasRedAlert = alertsState.alerts.some(a => a.level === 'red');
  let tickerText = announcement.data;
  let tickerClass = 'text-[#81d4fa]';
  let showAlertIcon = false;
  let showRetry = false;
  let retry = announcement.retry;

  if (mode === 'dispatch') {
    showAlertIcon = true;
    retry = alertsState.retry;
    if (alertsState.loading) {
      tickerText = '告警数据加载中';
    } else if (alertsState.error) {
      tickerText = '告警数据加载失败';
      tickerClass = 'text-[#e8a19a]';
      showRetry = true;
    } else if (alertsState.alerts.length > 0) {
      tickerText = alertsState.alerts.map(a => `【${a.source}】${a.message}`).join('    ');
      tickerClass = hasRedAlert ? 'text-[#e8a19a]' : 'text-[#81d4fa]';
    } else {
      tickerText = '当前无待处理预警，大厅运行平稳';
    }
  } else if (announcement.loading) {
    tickerText = '公告加载中';
  } else if (announcement.error) {
    tickerText = '公告加载失败';
    tickerClass = 'text-[#e8a19a]';
    showRetry = true;
  } else if (announcement.empty) {
    tickerText = '暂无公告';
  }

  return (
    <header className="flex flex-col gap-2 border-b border-[color:var(--gov-border)] px-3 py-2.5 min-[1101px]:px-5">
      <div className="flex flex-col gap-2 min-[1101px]:flex-row min-[1101px]:items-start min-[1101px]:justify-between min-[1101px]:gap-3">
        <div
          className="min-w-0 cursor-pointer select-none"
          onDoubleClick={toggleFullscreen}
          title={isFullscreen ? '双击退出全屏' : '双击进入全屏'}
        >
          <h1 className="text-lg font-semibold leading-snug tracking-normal text-[var(--gov-text-primary)] min-[1101px]:truncate min-[1101px]:text-[22px]">
            {mode === 'dispatch' ? '政务服务大厅运营指挥平台' : '政务服务大厅综合监控平台'}
          </h1>
          <p className="mt-0.5 text-[13px] leading-snug tracking-normal text-[var(--gov-text-muted)] min-[1101px]:truncate">
            杭州市政务服务中心 · 市民中心主厅
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 min-[1101px]:shrink-0">
          <button
            type="button"
            onClick={onToggleMode}
            className="gov-btn inline-flex items-center gap-1.5 rounded-md border border-[#2563a8] bg-[rgba(12,35,68,0.85)] px-2.5 py-1 text-[13px] text-[#81d4fa] hover:border-[#4fc3f7] hover:text-white"
            title="切换调度 / 汇报模式"
          >
            {mode === 'dispatch'
              ? <Presentation size={16} strokeWidth={1.75} />
              : <MonitorCog size={16} strokeWidth={1.75} />}
            <span>{mode === 'dispatch' ? '汇报模式' : '调度模式'}</span>
          </button>
          <div className="text-right leading-tight">
            <div className="font-mono text-[13px] tabular-nums text-[#64b5f6]">{formatClock(time)}</div>
            <div className="text-xs text-[var(--gov-text-muted)]">{WEEKDAYS[time.getDay()]}</div>
          </div>
        </div>
      </div>

      <div className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-1 ${mode === 'dispatch' && hasRedAlert ? 'bg-[rgba(242,101,92,0.16)]' : 'bg-[rgba(12,35,68,0.55)]'}`}>
        {showAlertIcon ? (
          <AlertTriangle size={16} strokeWidth={1.75} className={`shrink-0 ${hasRedAlert ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-gold)]'}`} />
        ) : (
          <span className="shrink-0 text-xs text-[var(--gov-text-muted)]">公告</span>
        )}
        {showRetry ? (
          <div className={`flex min-w-0 flex-1 items-center gap-2 text-[13px] ${tickerClass}`}>
            <span className="truncate">{tickerText}</span>
            <button
              type="button"
              onClick={retry}
              className="gov-btn shrink-0 rounded-md border border-current px-1.5 py-0.5 text-xs"
            >
              重试
            </button>
          </div>
        ) : (
          <TickerLine text={tickerText} className={tickerClass} />
        )}
      </div>
    </header>
  );
}
