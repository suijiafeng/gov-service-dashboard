import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Card } from './Card';
import { useServiceItemRanking, useAgeDistribution, useWeeklyFlow, useVisitStatistics, useEducationStats } from '../hooks/useData';
import { useCountUp, useChartDataRefresh } from '../hooks/useCarousel';

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="absolute top-0 right-0 z-10 flex items-center space-x-3 pr-1">
      {items.map(item => (
        <div key={item.label} className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[9px] text-[var(--gov-text-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function FlipClock({ num }: { num: number }) {
  const animatedNum = useCountUp(num, 1500);
  const digits = animatedNum.toString().padStart(5, '0').split('');
  return (
    <div className="flex space-x-1 justify-center">
      {digits.map((d, i) => (
        <div key={i} className="font-mono text-xl font-bold tracking-widest text-[var(--gov-text-primary)] bg-[rgba(22,52,98,0.95)] w-6 h-8 flex items-center justify-center border border-[color:var(--gov-border)] rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300">
          {d}
        </div>
      ))}
    </div>
  );
}

export function LeftPanel() {
  const { data: itemRanking } = useServiceItemRanking();
  const maxItemCount = itemRanking[0]?.count ?? 1;
  const { data: ageData } = useAgeDistribution();
  const { data: flowData } = useWeeklyFlow();
  const { data: visitStats } = useVisitStatistics();
  const { data: educationStats } = useEducationStats();
  
  // 图表数据动态刷新
  const animatedAgeData = useChartDataRefresh(ageData, 4000, 0.12);
  const animatedFlowData = useChartDataRefresh(flowData, 5000, 0.1);

  return (
    <div className="flex flex-col space-y-4 w-[28%] h-full pr-2">
      
      {/* 今日办理事项 TOP（按实际办件量排序，支撑动态开窗与物料准备） */}
      <Card title="今日办理事项 TOP" className="flex-[2.4] min-h-0">
        <div className="flex flex-col justify-around h-full">
          {itemRanking.map((item, i) => (
            <div key={item.name} className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-sm shrink-0 ${
                i < 3 ? 'text-[#0a1f39] bg-[var(--gov-gold)]' : 'text-[var(--gov-text-muted)] bg-[rgba(120,175,235,0.24)]'
              }`}>
                {i + 1}
              </span>
              <span className="w-24 text-[11px] text-[var(--gov-text-secondary)] truncate shrink-0">{item.name}</span>
              <div className="flex-1 h-2 bg-[rgba(120,175,235,0.16)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2e7bd1] to-[#55a6e8] transition-all duration-700"
                  style={{ width: `${(item.count / maxItemCount) * 100}%` }}
                />
              </div>
              <span className="w-9 text-right text-xs font-mono font-bold text-white shrink-0">{item.count}</span>
              <span className={`w-11 text-right text-[10px] shrink-0 ${
                item.trend > 0 ? 'text-[var(--gov-gold-soft)]' : item.trend < 0 ? 'text-[var(--gov-blue-soft)]' : 'text-[var(--gov-text-muted)]'
              }`}>
                {item.trend > 0 ? '↗' : item.trend < 0 ? '↘' : '—'} {Math.abs(item.trend)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 办事市民年龄分布 */}
      <Card title="办事市民年龄分布" className="flex-[2.2] min-h-0">
        <div className="h-full relative">
          <ChartLegend items={[
            { label: '0-16岁', color: '#7cc4f0' },
            { label: '17-39岁', color: '#55a6e8' },
            { label: '40-59岁', color: '#2e7bd1' },
            { label: '60岁以上', color: '#f0b95a' },
          ]} />
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={animatedAgeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(12,35,68,0.94)', borderColor: '#7fb3e8', color: '#f2f7fd' }}
                itemStyle={{ color: '#f2f7fd' }}
                cursor={{ fill: 'rgba(120, 175, 235, 0.1)' }}
              />
              <Bar dataKey="0-16岁" fill="#7cc4f0" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="17-39岁" fill="#55a6e8" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="40-59岁" fill="#2e7bd1" radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="60岁以上" fill="#f0b95a" radius={[2, 2, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 每周人流量分布情况 */}
      <Card title="每周办事人流量分布" className="flex-[2.2] min-h-0">
        <div className="h-full relative">
          <ChartLegend items={[{ label: '现场办理', color: '#55a6e8' }, { label: '网上办理', color: '#f0b95a' }]} />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={animatedFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#55a6e8" stopOpacity={0.32}/>
                  <stop offset="95%" stopColor="#55a6e8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFlow2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0b95a" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#f0b95a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(12,35,68,0.94)', borderColor: '#7fb3e8', color: '#f2f7fd' }}
                itemStyle={{ color: '#f2f7fd' }}
              />
              <Area type="monotone" dataKey="现场办理" stroke="#55a6e8" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
              <Area type="monotone" dataKey="网上办理" stroke="#f0b95a" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 业务办理人数统计 */}
      <Card title="业务办理人数统计" className="flex-[2.7] min-h-0">
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
                  fill="transparent" stroke="#f0b95a" strokeWidth="3"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * educationStats.bachelor / 100)}
                  className="drop-shadow-[0_0_4px_rgba(240,185,90,0.4)]"
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
