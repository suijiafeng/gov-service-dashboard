import { useEffect, useState } from 'react';
import autofit from 'autofit.js';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { DispatchPanel } from './components/DispatchPanel';
import { EfficiencyPanel } from './components/EfficiencyPanel';
import { usePhoneLayout } from './hooks/usePhoneLayout';
import bgImage from './assets/bg.jpg';

// 调度模式：值班长日常运营指挥；汇报模式：领导视察 / 上级检查展示
export type DashboardMode = 'dispatch' | 'report';

export function App() {
  const [mode, setMode] = useState<DashboardMode>('dispatch');
  const phone = usePhoneLayout();

  // 大屏用 autofit 等比缩放；手机宽度关掉缩放，改走流式布局，否则 1920 稿会被缩成不可读的小字
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
      className="dashboard text-slate-200 overflow-hidden font-sans relative"
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay：提亮基调的深蓝底 + 顶部青色氛围光 */}
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
