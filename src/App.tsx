import { useEffect, useState } from 'react';
import autofit from 'autofit.js';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { DispatchPanel } from './components/DispatchPanel';
import { EfficiencyPanel } from './components/EfficiencyPanel';
import bgImage from './assets/bg.jpg';

// 调度模式：值班长日常运营指挥；汇报模式：领导视察 / 上级检查展示
export type DashboardMode = 'dispatch' | 'report';

export function App() {
  const [mode, setMode] = useState<DashboardMode>('dispatch');

  // 初始化 autofit 实现大屏自适应
  useEffect(() => {
    autofit.init({
      el: 'body',  // 渲染容器
      dw: 1920,          // 设计稿宽度
      dh: 1080,          // 设计稿高度
      resize: true       // 监听窗口变化
    });

    return () => {
      autofit.off();
    };
  }, []);

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


      <div className="relative z-10 flex flex-col" style={{ width: '100%', height: '100%' }}>
        {/* Header */}
        <Header mode={mode} onToggleMode={() => setMode(m => (m === 'dispatch' ? 'report' : 'dispatch'))} />

        {/* Main Content */}
        <main
          className="flex overflow-hidden"
          style={{
            flex: 1,
            padding: '8px 16px 16px 16px',
            gap: '16px'
          }}
        >
          {/* Left Side */}
          {mode === 'dispatch' ? <DispatchPanel /> : <LeftPanel />}

          {/* Center Map & Stats */}
          <div style={{ flex: 1, height: '100%', minWidth: 0 }}>
            <CenterPanel mode={mode} />
          </div>

          {/* Right Side */}
          {mode === 'dispatch' ? <EfficiencyPanel /> : <RightPanel />}
        </main>
      </div>
    </div>
  );
}
