import { useEffect, useState } from 'react';
import autofit from 'autofit.js';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { DispatchPanel } from './components/DispatchPanel';
import { EfficiencyPanel } from './components/EfficiencyPanel';
import { usePhoneLayout } from './hooks/usePhoneLayout';
import { CityBackdrop } from './components/CityBackdrop';

// 调度模式：值班长日常运营指挥；汇报模式：领导视察 / 上级检查展示
export type DashboardMode = 'dispatch' | 'report';

export function App() {
  const [mode, setMode] = useState<DashboardMode>('dispatch');
  const phone = usePhoneLayout();

  // 1366 / 1920 用 autofit 等比缩放。更窄的平板和手机关掉缩放，改走流式布局，
  // 否则 1920 稿在 800 宽上会缩成大约 5px 的字。
  useEffect(() => {
    if (phone) return;
    autofit.init({
      el: 'body',
      dw: 1920,
      dh: 1080,
      resize: true,
    });

    return () => {
      autofit.off();
    };
  }, [phone]);

  return (
    <div
      className="dashboard text-slate-200 overflow-hidden font-sans relative bg-[#07182f]"
      style={{ width: '100%', height: '100%' }}
    >
      <CityBackdrop />
      {/* 深蓝遮罩压住路网，避免和地图、文字抢对比 */}
      <div className="absolute inset-0 bg-[#06162f]/75 pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(79,195,247,0.14), transparent 70%)' }}
      />


      <div className="dash-shell relative z-10 flex flex-col" style={{ width: '100%', height: '100%' }}>
        {/* Header */}
        <Header mode={mode} onToggleMode={() => setMode(m => (m === 'dispatch' ? 'report' : 'dispatch'))} />

        {/* Main Content */}
        <main
          className="dash-main flex overflow-hidden"
          style={{
            flex: 1,
            padding: '8px 16px 16px 16px',
            gap: '16px'
          }}
        >
          {/* Left Side */}
          {mode === 'dispatch' ? <DispatchPanel /> : <LeftPanel />}

          {/* Center Map & Stats */}
          <div className="center-slot" style={{ flex: 1, height: '100%', minWidth: 0 }}>
            <CenterPanel mode={mode} />
          </div>

          {/* Right Side */}
          {mode === 'dispatch' ? <EfficiencyPanel /> : <RightPanel />}
        </main>
      </div>
    </div>
  );
}
