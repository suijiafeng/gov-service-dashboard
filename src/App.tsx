import { useEffect, useState } from 'react';
import autofit from 'autofit.js';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { DispatchPanel } from './components/DispatchPanel';
import { EfficiencyPanel } from './components/EfficiencyPanel';
import { useUnscaledLayout } from './hooks/usePhoneLayout';
import { CityBackdrop } from './components/CityBackdrop';

// 调度模式：值班长日常运营指挥；汇报模式：领导视察 / 上级检查展示
export type DashboardMode = 'dispatch' | 'report';

export function App() {
  const [mode, setMode] = useState<DashboardMode>('dispatch');
  const unscaled = useUnscaledLayout();

  // 笔记本、平板和手机使用流式布局，保留文字与按钮的尺寸。
  useEffect(() => {
    if (unscaled) return;
    autofit.init({
      el: 'body',
      dw: 1920,
      dh: 1080,
      resize: true,
    });

    return () => {
      autofit.off();
    };
  }, [unscaled]);

  return (
    <div
      className="dashboard relative overflow-hidden bg-[#07182f] font-sans text-[#c9daee] antialiased"
      style={{ width: '100%', height: '100%' }}
    >
      <CityBackdrop />

      <div className="dash-shell relative z-10 flex flex-col" style={{ width: '100%', height: '100%' }}>
        <Header mode={mode} onToggleMode={() => setMode(m => (m === 'dispatch' ? 'report' : 'dispatch'))} />

        <main
          className="dash-main flex overflow-hidden"
          style={{
            flex: 1,
            padding: '12px 16px 16px 16px',
            gap: '12px',
          }}
        >
          {mode === 'dispatch' ? <DispatchPanel /> : <LeftPanel />}

          <div className="center-slot" style={{ flex: 1, height: '100%', minWidth: 0 }}>
            <CenterPanel mode={mode} />
          </div>

          {mode === 'dispatch' ? <EfficiencyPanel /> : <RightPanel />}
        </main>
      </div>
    </div>
  );
}
