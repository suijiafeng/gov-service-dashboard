import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Card } from './Card';
import { useServiceCategories, useAgeDistribution, useWeeklyFlow, useVisitStatistics, useEducationStats } from '../hooks/useData';
import { useCountUp, useChartDataRefresh, useHighlightCarousel } from '../hooks/useCarousel';

function FlipClock({ num }: { num: number }) {
  const animatedNum = useCountUp(num, 1500);
  const digits = animatedNum.toString().padStart(5, '0').split('');
  return (
    <div className="flex space-x-1 justify-center">
      {digits.map((d, i) => (
        <div key={i} className="font-mono text-xl font-bold tracking-widest text-[var(--gov-text-primary)] bg-[rgba(16,38,66,0.95)] w-6 h-8 flex items-center justify-center border border-[color:var(--gov-border)] rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300">
          {d}
        </div>
      ))}
    </div>
  );
}

export function LeftPanel() {
  const { data: serviceCategories } = useServiceCategories();
  const { data: ageData } = useAgeDistribution();
  const { data: flowData } = useWeeklyFlow();
  const { data: visitStats } = useVisitStatistics();
  const { data: educationStats } = useEducationStats();
  
  // 图表数据动态刷新
  const animatedAgeData = useChartDataRefresh(ageData, 4000, 0.12);
  const animatedFlowData = useChartDataRefresh(flowData, 5000, 0.1);
  
  // 关键词高亮轮播
  const activeKeywordIndex = useHighlightCarousel(serviceCategories.length, 2500);

  return (
    <div className="flex flex-col space-y-4 w-[28%] h-full pr-2">
      
      {/* 热门办理事项 */}
      <Card title="热门办理事项" className="flex-[1.5] min-h-0">
        <div className="grid grid-cols-3 gap-2 h-full text-sm text-[var(--gov-text-secondary)] font-medium p-1">
          {serviceCategories.map((item, i) => (
            <button 
              key={item} 
              className={`bg-gradient-to-br from-[rgba(12,33,59,0.95)] to-[rgba(21,48,83,0.95)] border transition-all duration-500 rounded-sm flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${
                i === activeKeywordIndex
                  ? 'border-[color:var(--gov-gold)] text-white bg-gradient-to-br from-[rgba(34,60,92,1)] to-[rgba(67,91,126,1)]'
                  : 'border-[color:var(--gov-border)] text-[var(--gov-text-secondary)] opacity-85 hover:border-[color:var(--gov-border-strong)] hover:text-white hover:opacity-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {/* 办事市民年龄分布 */}
      <Card title="办事市民年龄分布" className="flex-[2.5] min-h-0">
        <div className="h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={animatedAgeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(9, 27, 49, 0.94)', borderColor: '#6b93c2', color: '#edf3fb' }}
                itemStyle={{ color: '#edf3fb' }}
                cursor={{ fill: 'rgba(95, 139, 193, 0.08)' }}
              />
              <Bar dataKey="0-16岁" fill="#88a9cf" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="17-39岁" fill="#5f8bc1" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="40-59岁" fill="#2f5f9b" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="60岁以上" fill="#c7a45a" radius={[2, 2, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 每周人流量分布情况 */}
      <Card title="每周办事人流量分布" className="flex-[2.5] min-h-0">
        <div className="h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={animatedFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5f8bc1" stopOpacity={0.32}/>
                  <stop offset="95%" stopColor="#5f8bc1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFlow2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c7a45a" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#c7a45a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(9, 27, 49, 0.94)', borderColor: '#6b93c2', color: '#edf3fb' }}
                itemStyle={{ color: '#edf3fb' }}
              />
              <Area type="monotone" dataKey="类型一" stroke="#5f8bc1" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
              <Area type="monotone" dataKey="类型二" stroke="#c7a45a" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 业务办理人数统计 */}
      <Card title="业务办理人数统计" className="flex-[3] min-h-0">
        <div className="grid grid-cols-3 gap-2 h-full pt-2">

          <div className="flex flex-col justify-between space-y-2">
            <div className="border-l-2 border-[color:var(--gov-gold)] pl-2 text-[10px] text-[var(--gov-text-secondary)] tracking-[0.24em]">上月办理情况</div>
            <div className="flex flex-col justify-center flex-1 space-y-2">
              <div className="text-[10px] text-[var(--gov-text-secondary)]">● 网上办理数量 (件)</div>
              <FlipClock num={visitStats.lastMonth.infant} />
            </div>
            <div className="flex flex-col justify-center flex-1 space-y-2">
              <div className="text-[10px] text-[var(--gov-text-secondary)]">● 现场办理数量 (件)</div>
              <FlipClock num={visitStats.lastMonth.adult} />
            </div>
          </div>

          {/* 网上办件率圆环 */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(124, 158, 196, 0.18)" strokeWidth="3" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="transparent" stroke="#c7a45a" strokeWidth="3"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * educationStats.bachelor / 100)}
                  className="drop-shadow-[0_0_4px_rgba(199,164,90,0.35)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-white">{educationStats.bachelor}%</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--gov-text-secondary)] mt-1 tracking-[0.18em]">网上办件率</div>
          </div>

          <div className="flex flex-col justify-between space-y-2">
            <div className="border-l-2 border-[color:var(--gov-gold)] pl-2 text-[10px] text-[var(--gov-text-secondary)] tracking-[0.24em]">本月办理情况</div>
            <div className="flex flex-col justify-center flex-1 space-y-2">
              <div className="text-[10px] text-[var(--gov-text-secondary)]">● 即办件数量 (件)</div>
              <FlipClock num={visitStats.thisMonth.youth} />
            </div>
            <div className="flex flex-col justify-center flex-1 space-y-2">
              <div className="text-[10px] text-[var(--gov-text-secondary)]">● 承诺件数量 (件)</div>
              <FlipClock num={visitStats.thisMonth.elderly} />
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
