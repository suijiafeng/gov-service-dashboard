import { useEffect } from 'react';
import autofit from 'autofit.js';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import bgImage from './assets/bg.jpg';

export function App() {
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
      {/* Dark overlay to ensure readability and tech vibe */}
      <div className="absolute inset-0 bg-[#020b18]/80 pointer-events-none z-0" />
      

      <div className="relative z-10 flex flex-col" style={{ width: '100%', height: '100%' }}>
        {/* Header */}
        <Header />

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
          <LeftPanel />

          {/* Center Map & Stats */}
          <div style={{ flex: 1, height: '100%', minWidth: 0 }}>
            <CenterPanel />
          </div>

          {/* Right Side */}
          <RightPanel />
        </main>
      </div>
    </div>
  );
}
