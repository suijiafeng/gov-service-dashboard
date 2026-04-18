import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, Volume2 } from 'lucide-react';

export function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative flex items-start justify-between px-6 pt-4 pb-2 h-24">
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#02112a]" />
      
      {/* Decorative center piece background */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[80px] border-b-2 border-x-2 border-[#184a7e] bg-[#02112a] z-0"
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

      {/* Center Title */}
      <div className="flex flex-col items-center justify-center relative w-1/2 z-10 pt-1">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e0f7fa] to-[#4fc3f7] tracking-[0.2em] drop-shadow-[0_0_15px_rgba(79,195,247,0.8)]">
          政务服务大厅综合监控平台
        </h1>

        <div className="flex items-center space-x-2 mt-1">
          {/* 左侧流光线 */}
          <div className="relative h-px w-24 overflow-hidden bg-[#113a69]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-left" />
          </div>
          <div className="text-[#4fc3f7] text-[10px] tracking-[0.3em] font-medium opacity-80">
            GOVERNMENT SERVICE HALL MONITORING SYSTEM
          </div>
          {/* 右侧流光线 */}
          <div className="relative h-px w-24 overflow-hidden bg-[#113a69]">
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent animate-beam-right" />
          </div>
        </div>

      </div>

      {/* Right Marquee */}
      <div className="flex items-center w-1/4 justify-end relative z-10 pt-2">
        <div className="flex items-center border-l-2 border-[#4fc3f7] pl-2 w-[260px]">
          <Volume2 className="w-3.5 h-3.5 text-[#4fc3f7] shrink-0 mr-2" />
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee flex w-max text-[#81d4fa] text-xs">
              <span className="pr-12">本大厅实行全程网上预约，请市民提前通过政务APP或官网进行预约办理。窗口3-5号暂停服务，预计下午14:00恢复。本周五大厅将进行消防演练，请各部门做好配合。</span>
              <span className="pr-12">本大厅实行全程网上预约，请市民提前通过政务APP或官网进行预约办理。窗口3-5号暂停服务，预计下午14:00恢复。本周五大厅将进行消防演练，请各部门做好配合。</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
