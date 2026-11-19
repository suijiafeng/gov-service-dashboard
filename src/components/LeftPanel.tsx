import { Card } from './Card';
import { QueryState } from './QueryState';
import { EChart, areaSeries, axisTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { useServiceItemRanking, useAgeDistribution, useWeeklyFlow, useVisitStatistics, useEducationStats } from '../hooks/useData';
import { useChartDataRefresh } from '../hooks/useCarousel';
import { useNarrowChart } from '../hooks/usePhoneLayout';
import { theme } from '../theme';

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="chart-legend absolute top-0 right-0 z-10 flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-0.5 pr-1">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-[var(--gov-text-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-xs text-[var(--gov-text-muted)]">{label}</div>
      <div className="font-mono text-lg font-semibold tabular-nums text-[var(--gov-text-primary)]">
        {value.toLocaleString('zh-CN')}
      </div>
    </div>
  );
}

const AGE_SERIES = [
  { key: '0-16岁', color: theme.series[0] },
  { key: '17-39岁', color: theme.series[1] },
  { key: '40-59岁', color: theme.series[2] },
  { key: '60岁以上', color: theme.series[3] },
] as const;

export function LeftPanel() {
  const itemRankingQuery = useServiceItemRanking();
  const ageQuery = useAgeDistribution();
  const flowQuery = useWeeklyFlow();
  const visitQuery = useVisitStatistics();
  const educationQuery = useEducationStats();
  const narrow = useNarrowChart();
  const itemRanking = itemRankingQuery.data;
  const ageData = ageQuery.data;
  const flowData = flowQuery.data;
  const visitStats = visitQuery.data;
  const educationStats = educationQuery.data;
  const maxItemCount = itemRanking[0]?.count ?? 1;

  const animatedAgeData = useChartDataRefresh(ageData, 4000, 0.12);
  const animatedFlowData = useChartDataRefresh(flowData, 5000, 0.1);
  const ring = 2 * Math.PI * 34;

  return (
    <div className="side-panel flex h-full w-[28%] min-w-0 flex-col gap-3 pr-2">

      <Card title="今日办理事项" className="min-h-0 flex-[2.4]">
        <QueryState query={itemRankingQuery}>
        <div className="flex h-full flex-col justify-around gap-2">
          {itemRanking.map((item, i) => (
            <div key={item.name} className="flex min-w-0 items-center gap-2">
              <span className="w-4 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">{i + 1}</span>
              <span className="w-28 shrink-0 truncate text-[13px] text-[var(--gov-text-secondary)] max-[767px]:w-24">{item.name}</span>
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-white/[0.06]">
                <div
                  className="h-full rounded-sm bg-zinc-300 transition-[width] duration-150 ease-out"
                  style={{ width: `${(item.count / maxItemCount) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[13px] tabular-nums text-[var(--gov-text-primary)]">{item.count}</span>
              <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">
                {item.trend > 0 ? `+${item.trend}%` : item.trend < 0 ? `${item.trend}%` : '持平'}
              </span>
            </div>
          ))}
        </div>
        </QueryState>
      </Card>

      <Card title="办事市民年龄" className="min-h-0 flex-[2.2]">
        <QueryState query={ageQuery}>
        <div className="chart-frame relative h-full">
          <ChartLegend items={AGE_SERIES.map(s => ({ label: s.key, color: s.color }))} />
          <EChart option={{
            grid: chartGrid(0),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedAgeData.map(d => String(d.name))),
            yAxis: valueAxis(),
            series: AGE_SERIES.map(s => barSeries(s.key, animatedAgeData.map(d => Number(d[s.key])), s.color)),
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="本周人流" className="min-h-0 flex-[2.2]">
        <QueryState query={flowQuery}>
        <div className="chart-frame relative h-full">
          <ChartLegend items={[{ label: '现场办理', color: theme.series[0] }, { label: '网上办理', color: theme.series[2] }]} />
          <EChart option={{
            grid: chartGrid(narrow ? 40 : 0),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedFlowData.map(d => String(d.name)), narrow ? 40 : 0),
            yAxis: valueAxis(),
            series: [
              areaSeries('现场办理', animatedFlowData.map(d => Number(d['现场办理'])), theme.series[0]),
              areaSeries('网上办理', animatedFlowData.map(d => Number(d['网上办理'])), theme.series[2]),
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="办件量" className="min-h-0 flex-[2.7]">
        <QueryState query={[visitQuery, educationQuery]}>
        <div className="visit-grid grid h-full grid-cols-3 items-center gap-3 pt-1">
          <div className="min-w-0 space-y-3">
            <div className="text-[13px] text-[var(--gov-text-secondary)]">上月</div>
            <Figure label="网上办理（件）" value={visitStats.lastMonth.infant} />
            <Figure label="现场办理（件）" value={visitStats.lastMonth.adult} />
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative h-20 w-20">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="transparent" stroke={theme.accent} strokeWidth="3"
                  strokeDasharray={ring}
                  strokeDashoffset={ring - (ring * educationStats.bachelor) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm font-semibold tabular-nums text-[var(--gov-text-primary)]">{educationStats.bachelor}%</span>
              </div>
            </div>
            <div className="mt-1 text-[13px] tracking-normal text-[var(--gov-text-secondary)]">网上办件率</div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="text-[13px] text-[var(--gov-text-secondary)]">本月截至今日</div>
            <Figure label="即办件（件）" value={visitStats.thisMonth.youth} />
            <Figure label="承诺件（件）" value={visitStats.thisMonth.elderly} />
          </div>
        </div>
        </QueryState>
      </Card>
    </div>
  );
}
