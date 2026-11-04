import { Card } from './Card';
import { QueryState } from './QueryState';
import { EChart, areaSeries, axisTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { useServiceItemRanking, useAgeDistribution, useWeeklyFlow, useVisitStatistics, useEducationStats } from '../hooks/useData';
import { useCountUp, useChartDataRefresh } from '../hooks/useCarousel';
import { usePhoneLayout } from '../hooks/usePhoneLayout';

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="chart-legend absolute top-0 right-0 z-10 flex flex-wrap items-center justify-end gap-x-3 gap-y-0.5 pr-1 max-w-full">
      {items.map(item => (
        <div key={item.label} className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
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
        <div key={i} className="flip-digit font-mono text-xl font-bold tracking-widest text-[var(--gov-text-primary)] bg-[rgba(22,52,98,0.95)] w-6 h-8 flex items-center justify-center border border-[color:var(--gov-border)] rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300">
          {d}
        </div>
      ))}
    </div>
  );
}

export function LeftPanel() {
  const itemRankingQuery = useServiceItemRanking();
  const ageQuery = useAgeDistribution();
  const flowQuery = useWeeklyFlow();
  const visitQuery = useVisitStatistics();
  const educationQuery = useEducationStats();
  const phone = usePhoneLayout();
  const itemRanking = itemRankingQuery.data;
  const ageData = ageQuery.data;
  const flowData = flowQuery.data;
  const visitStats = visitQuery.data;
  const educationStats = educationQuery.data;
  const maxItemCount = itemRanking[0]?.count ?? 1;
  
  // 图表数据动态刷新
  const animatedAgeData = useChartDataRefresh(ageData, 4000, 0.12);
  const animatedFlowData = useChartDataRefresh(flowData, 5000, 0.1);

  return (
    <div className="side-panel flex flex-col space-y-4 w-[28%] h-full pr-2">
      
      {/* 今日办理事项 TOP（按实际办件量排序，支撑动态开窗与物料准备） */}
      <Card title="今日办理事项 TOP" className="flex-[2.4] min-h-0">
        <QueryState query={itemRankingQuery}>
        <div className="flex flex-col justify-around h-full gap-2">
          {itemRanking.map((item, i) => (
            <div key={item.name} className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-sm shrink-0 ${
                i < 3 ? 'text-[#0a1f39] bg-[var(--gov-gold)]' : 'text-[var(--gov-text-muted)] bg-[rgba(120,175,235,0.24)]'
              }`}>
                {i + 1}
              </span>
              <span className="w-24 max-[767px]:w-[4.8rem] text-[11px] text-[var(--gov-text-secondary)] truncate shrink-0">{item.name}</span>
              <div className="flex-1 min-w-0 h-2 bg-[rgba(120,175,235,0.16)] rounded-full overflow-hidden">
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
        </QueryState>
      </Card>

      {/* 办事市民年龄分布 */}
      <Card title="办事市民年龄分布" className="flex-[2.2] min-h-0">
        <QueryState query={ageQuery}>
        <div className="chart-frame h-full relative">
          <ChartLegend items={[
            { label: '0-16岁', color: '#7cc4f0' },
            { label: '17-39岁', color: '#55a6e8' },
            { label: '40-59岁', color: '#2e7bd1' },
            { label: '60岁以上', color: '#f0b95a' },
          ]} />
          <EChart option={{
            grid: chartGrid(0),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedAgeData.map(d => String(d.name))),
            yAxis: valueAxis(),
            series: [
              barSeries('0-16岁', animatedAgeData.map(d => Number(d['0-16岁'])), '#7cc4f0'),
              barSeries('17-39岁', animatedAgeData.map(d => Number(d['17-39岁'])), '#55a6e8'),
              barSeries('40-59岁', animatedAgeData.map(d => Number(d['40-59岁'])), '#2e7bd1'),
              barSeries('60岁以上', animatedAgeData.map(d => Number(d['60岁以上'])), '#f0b95a'),
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      {/* 每周人流量分布情况 */}
      <Card title="每周办事人流量分布" className="flex-[2.2] min-h-0">
        <QueryState query={flowQuery}>
        <div className="chart-frame h-full relative">
          <ChartLegend items={[{ label: '现场办理', color: '#55a6e8' }, { label: '网上办理', color: '#f0b95a' }]} />
          <EChart option={{
            grid: chartGrid(phone ? 40 : 0),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedFlowData.map(d => String(d.name)), phone ? 40 : 0),
            yAxis: valueAxis(),
            series: [
              areaSeries('现场办理', animatedFlowData.map(d => Number(d['现场办理'])), '#55a6e8'),
              areaSeries('网上办理', animatedFlowData.map(d => Number(d['网上办理'])), '#f0b95a'),
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      {/* 业务办理人数统计 */}
      <Card title="业务办理人数统计" className="flex-[2.7] min-h-0">
        <QueryState query={[visitQuery, educationQuery]}>
        <div className="visit-grid grid grid-cols-3 gap-2 h-full pt-2">

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
        </QueryState>
      </Card>
    </div>
  );
}
