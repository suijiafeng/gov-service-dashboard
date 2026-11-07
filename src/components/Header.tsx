import { useState, useEffect } from 'react';
import { Clock, Volume2, AlertTriangle, MonitorCog, Presentation } from 'lucide-react';
import { useAnnouncement } from '../hooks/useData';
import { useAlerts } from './DispatchPanel';
import type { DashboardMode } from '../App';

interface HeaderProps {
  mode: DashboardMode;
  onToggleMode: () => void;
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

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
      tickerText = '告警数据加载中…';
    } else if (alertsState.error) {
      tickerText = '告警数据加载失败';
      tickerClass = 'text-[#e8a19a]';
      showRetry = true;
    } else if (alertsState.alerts.length > 0) {
      tickerText = alertsState.alerts.map(a => `【${a.source}】${a.message}`).join('　　');
      tickerClass = hasRedAlert ? 'text-[#e8a19a]' : 'text-[#81d4fa]';
    } else {
      tickerText = '当前无待处理预警，大厅运行平稳';
    }
  } else if (announcement.loading) {
    tickerText = '公告加载中…';
  } else if (announcement.error) {
    tickerText = '公告加载失败';
    tickerClass = 'text-[#e8a19a]';
    showRetry = true;
  } else if (announcement.empty) {
    tickerText = '暂无公告';
  }

  const modeButton = (
    <button
      onClick={onToggleMode}
      className="flex items-center space-x-1.5 shrink-0 px-2.5 py-1 border border-[#2563a8] bg-[rgba(12,35,68,0.85)] rounded-sm text-xs text-[#81d4fa] hover:border-[#4fc3f7] hover:text-white transition-colors"
      title="切换调度 / 汇报模式"
    >
      {mode === 'dispatch' ? <Presentation className="w-3.5 h-3.5" /> : <MonitorCog className="w-3.5 h-3.5" />}
      <span>{mode === 'dispatch' ? '汇报模式' : '调度模式'}</span>
    </button>
  );

  return (
    <header className="relative flex flex-col gap-2 px-3 pt-3 pb-2 min-[1101px]:flex-row min-[1101px]:items-start min-[1101px]:justify-between min-[1101px]:px-6 min-[1101px]:pt-4 min-[1101px]:h-24 min-[1101px]:gap-0">
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#041a38]" />

      {/* Decorative center piece background */}
      <div
        className="hidden min-[1101px]:block absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[80px] border-b-2 border-x-2 border-[#2563a8] bg-[#041a38] z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
          boxShadow: 'inset 0 -20px 20px -20px rgba(79, 195, 247, 0.5)'
        }}
      />

      {/* Left Time */}
      <div className="flex items-center gap-x-2 text-[#64b5f6] text-xs w-full min-[1101px]:text-sm min-[1101px]:w-1/4 relative z-10 min-[1101px]:pt-2 min-w-0">
        <Clock className="w-4 h-4 shrink-0" />
        <span className="font-mono whitespace-nowrap">{formatClock(time)}</span>
        <span className="whitespace-nowrap">{WEEKDAYS[time.getDay()]}</span>
      </div>

      {/* Center Title：双击切换全屏 */}
      <div
        className="group flex flex-col items-center justify-center relative w-full min-[1101px]:w-1/2 z-10 min-[1101px]:pt-1 cursor-pointer select-none min-w-0"
        onDoubleClick={toggleFullscreen}
        title={isFullscreen ? '双击退出全屏' : '双击进入全屏'}
      >
        <h1 className="text-xl min-[1101px]:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e0f7fa] to-[#4fc3f7] tracking-[0.06em] min-[1101px]:tracking-[0.2em] drop-shadow-[0_0_15px_rgba(79,195,247,0.8)] text-center leading-tight">
          {mode === 'dispatch' ? '政务服务大厅运营指挥平台' : '政务服务大厅综合监控平台'}
        </h1>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#81d4fa] bg-[rgba(12,35,68,0.92)] border border-[#2563a8] px-2.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          {isFullscreen ? '双击退出全屏' : '双击进入全屏'}
        </span>

        <div className="flex items-center justify-center gap-2 mt-1 w-full min-w-0 px-1">
          <div className="hidden min-[1101px]:block relative h-px w-24 overflow-hidden bg-[#1a4f8c]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-left" />
          </div>
          <div className="min-w-0 text-[#4fc3f7] text-[8px] min-[1101px]:text-[10px] tracking-[0.04em] min-[1101px]:tracking-[0.3em] font-medium opacity-80 text-center leading-snug">
            GOVERNMENT SERVICE HALL OPERATION CENTER
          </div>
          <div className="hidden min-[1101px]:block relative h-px w-24 overflow-hidden bg-[#1a4f8c]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-right" />
          </div>
        </div>

      </div>

      {/* Right: mode switch + ticker */}
      <div className="flex items-center w-full min-[1101px]:w-1/4 justify-end gap-2 relative z-10 min-[1101px]:pt-2 min-w-0">
        {modeButton}

        <div className={`flex items-center border-l-2 pl-2 min-w-0 flex-1 min-[1101px]:flex-none min-[1101px]:w-[240px] ${mode === 'dispatch' && hasRedAlert ? 'border-[color:var(--gov-danger)]' : 'border-[#4fc3f7]'}`}>
          {showAlertIcon ? (
            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mr-2 ${hasRedAlert ? 'text-[var(--gov-danger)] animate-pulse' : 'text-[var(--gov-gold)]'}`} />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0 mr-2" />
          )}
          <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0">
            {showRetry ? (
              <div className={`flex items-center gap-2 text-xs min-[1101px]:text-sm ${tickerClass}`}>
                <span className="truncate">{tickerText}</span>
                <button
                  type="button"
                  onClick={retry}
                  className="shrink-0 text-[10px] px-1.5 py-0.5 border border-current rounded-sm"
                >
                  重试
                </button>
              </div>
            ) : tickerText.length > 18 ? (
              <div className={`animate-marquee flex w-max text-xs min-[1101px]:text-sm ${tickerClass}`}>
                <span className="pr-12">{tickerText}</span>
                <span className="pr-12">{tickerText}</span>
              </div>
            ) : (
              <div className={`truncate text-xs min-[1101px]:text-sm ${tickerClass}`}>{tickerText}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
