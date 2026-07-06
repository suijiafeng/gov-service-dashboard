import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, Volume2, AlertTriangle, MonitorCog, Presentation } from 'lucide-react';
import { useAnnouncement } from '../hooks/useData';
import { useAlerts } from './DispatchPanel';
import type { DashboardMode } from '../App';

interface HeaderProps {
  mode: DashboardMode;
  onToggleMode: () => void;
}

export function Header({ mode, onToggleMode }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: announcement } = useAnnouncement();
  const alerts = useAlerts();

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

  // 调度模式滚动条展示实时告警（红色优先），汇报模式展示公告
  const hasRedAlert = alerts.some(a => a.level === 'red');
  const tickerText =
    mode === 'dispatch' && alerts.length > 0
      ? alerts.map(a => `【${a.source}】${a.message}`).join('　　')
      : announcement;

  return (
    <header className="relative flex items-start justify-between px-6 pt-4 pb-2 h-24">
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#041a38]" />

      {/* Decorative center piece background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[80px] border-b-2 border-x-2 border-[#2563a8] bg-[#041a38] z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
          boxShadow: 'inset 0 -20px 20px -20px rgba(79, 195, 247, 0.5)'
        }}
      />

      {/* Left Time */}
      <div className="flex items-center space-x-2 text-[#64b5f6] text-sm w-1/4 relative z-10 pt-2">
        <Clock className="w-4 h-4" />
        <span className="font-mono">{format(time, 'yyyy-MM-dd HH:mm:ss')}</span>
        <span>{format(time, 'EEEE', { locale: zhCN })}</span>
      </div>

      {/* Center Title：双击切换全屏 */}
      <div
        className="group flex flex-col items-center justify-center relative w-1/2 z-10 pt-1 cursor-pointer select-none"
        onDoubleClick={toggleFullscreen}
        title={isFullscreen ? '双击退出全屏' : '双击进入全屏'}
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e0f7fa] to-[#4fc3f7] tracking-[0.2em] drop-shadow-[0_0_15px_rgba(79,195,247,0.8)]">
          {mode === 'dispatch' ? '政务服务大厅运营指挥平台' : '政务服务大厅综合监控平台'}
        </h1>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#81d4fa] bg-[rgba(12,35,68,0.92)] border border-[#2563a8] px-2.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          {isFullscreen ? '双击退出全屏' : '双击进入全屏'}
        </span>

        <div className="flex items-center space-x-2 mt-1">
          {/* 左侧流光线 */}
          <div className="relative h-px w-24 overflow-hidden bg-[#1a4f8c]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-left" />
          </div>
          <div className="text-[#4fc3f7] text-[10px] tracking-[0.3em] font-medium opacity-80">
            GOVERNMENT SERVICE HALL OPERATION CENTER
          </div>
          {/* 右侧流光线 */}
          <div className="relative h-px w-24 overflow-hidden bg-[#1a4f8c]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-right" />
          </div>
        </div>

      </div>

      {/* Right: mode switch + ticker */}
      <div className="flex items-center w-1/4 justify-end space-x-3 relative z-10 pt-2">
        <button
          onClick={onToggleMode}
          className="flex items-center space-x-1.5 shrink-0 px-2.5 py-1 border border-[#2563a8] bg-[rgba(12,35,68,0.85)] rounded-sm text-xs text-[#81d4fa] hover:border-[#4fc3f7] hover:text-white transition-colors"
          title="切换调度 / 汇报模式"
        >
          {mode === 'dispatch' ? <Presentation className="w-3.5 h-3.5" /> : <MonitorCog className="w-3.5 h-3.5" />}
          <span>{mode === 'dispatch' ? '汇报模式' : '调度模式'}</span>
        </button>

        <div className={`flex items-center border-l-2 pl-2 w-[240px] ${mode === 'dispatch' && hasRedAlert ? 'border-[color:var(--gov-danger)]' : 'border-[#4fc3f7]'}`}>
          {mode === 'dispatch' && alerts.length > 0 ? (
            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mr-2 ${hasRedAlert ? 'text-[var(--gov-danger)] animate-pulse' : 'text-[var(--gov-gold)]'}`} />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0 mr-2" />
          )}
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className={`animate-marquee flex w-max text-sm ${mode === 'dispatch' && hasRedAlert ? 'text-[#e8a19a]' : 'text-[#81d4fa]'}`}>
              <span className="pr-12">{tickerText}</span>
              <span className="pr-12">{tickerText}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
