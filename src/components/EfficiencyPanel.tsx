import { useState } from 'react';
import { Card } from './Card';
import { Modal } from './Modal';
import { ChartLegend } from './LeftPanel';
import { QueryState } from './QueryState';
import { EChart, axisTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { useEfficiencyStats, useOverdueItems, useSatisfactionStats, useStaffPerformance } from '../hooks/useData';
import { useNarrowChart } from '../hooks/usePhoneLayout';
import { theme } from '../theme';

function KpiTile({ label, value, unit, warn }: { label: string; value: string; unit?: string; warn?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--gov-bg-panel)] px-1 py-2">
      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-xl font-semibold tabular-nums ${warn ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-text-primary)]'}`}>{value}</span>
        {unit && <span className="text-xs text-[var(--gov-text-muted)]">{unit}</span>}
      </div>
      <span className="mt-0.5 text-xs tracking-normal text-[var(--gov-text-secondary)]">{label}</span>
    </div>
  );
}

export function EfficiencyPanel() {
  const efficiencyQuery = useEfficiencyStats();
  const overdueQuery = useOverdueItems();
  const satisfactionQuery = useSatisfactionStats();
  const staffQuery = useStaffPerformance();
  const narrow = useNarrowChart();
  const efficiency = efficiencyQuery.data;
  const overdue = overdueQuery.data;
  const satisfaction = satisfactionQuery.data;
  const staff = staffQuery.data;
  const [selectedOverdue, setSelectedOverdue] = useState<string | null>(null);
  const [urged, setUrged] = useState<Set<string>>(new Set());

  const totalReviews =
    satisfaction.counts.great + satisfaction.counts.good + satisfaction.counts.ok + satisfaction.counts.bad;
  const ring = 2 * Math.PI * 34;
  const todayRate = satisfaction.todayRate;

  return (
    <div className="side-panel flex h-full w-[28%] min-w-0 flex-col gap-3 pl-2">

      <Card title="办件时效" className="min-h-0 flex-[1.6]">
        <QueryState query={efficiencyQuery}>
        <div className="stat-grid-4 grid h-full grid-cols-4 gap-px overflow-hidden rounded-md bg-white/[0.08]">
          <KpiTile label="按期办结率" value={`${efficiency.onTimeRate}`} unit="%" warn={efficiency.onTimeRate < 99} />
          <KpiTile label="即办件占比" value={`${efficiency.immediateRate}`} unit="%" />
          <KpiTile label="平均办理" value={`${efficiency.avgProcessMinutes}`} unit="分钟" />
          <KpiTile label="今日受理" value={efficiency.todayAccepted.toLocaleString('zh-CN')} unit="件" />
        </div>
        </QueryState>
      </Card>

      <Card title={overdueQuery.loading || overdueQuery.error ? '超期 / 临期承诺件' : `超期 / 临期承诺件 · ${overdue.length}`} className="min-h-0 flex-[2.4]">
        <QueryState query={overdueQuery} ignoreEmpty>
        <div className="custom-scrollbar h-full space-y-1 overflow-y-auto pr-1">
          {overdue.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelectedOverdue(o.id)}
              title="查看办件详情"
              className="gov-btn flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-white/[0.04]"
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[13px] text-[var(--gov-text-primary)]">{o.item}</span>
                <span className={`shrink-0 text-xs tabular-nums ${o.level === 'overdue' ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-warning)]'}`}>
                  {o.deadlineText}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-[var(--gov-text-muted)]">
                <span className="truncate font-mono tabular-nums">{o.id}</span>
                <span className="shrink-0">{o.window}</span>
              </div>
            </button>
          ))}
          {overdue.length === 0 && (
            <div className="flex h-full items-center justify-center text-[13px] text-[var(--gov-text-muted)]">
              无超期与临期承诺件
            </div>
          )}
        </div>
        </QueryState>
      </Card>

      <Card title="好差评" className="min-h-0 flex-[2.6]">
        <QueryState query={satisfactionQuery}>
        <div className="split-row flex h-full gap-3">
          <div className="flex w-24 shrink-0 flex-col items-center justify-center">
            <div className="relative h-20 w-20">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="transparent" stroke={theme.accent} strokeWidth="4"
                  strokeDasharray={ring}
                  strokeDashoffset={ring - (ring * todayRate) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-sm font-semibold tabular-nums text-[var(--gov-text-primary)]">{todayRate}%</span>
                <span className="text-xs text-[var(--gov-text-muted)]">今日</span>
              </div>
            </div>
            <div className="mt-1 text-center text-xs tabular-nums text-[var(--gov-text-muted)]">
              本周 {satisfaction.weekRate}% · {totalReviews.toLocaleString('zh-CN')} 条
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 text-[13px] tracking-normal text-[var(--gov-text-secondary)]">差评，待整改</div>
            <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto">
              {satisfaction.badReviews.length === 0 && (
                <div className="text-[13px] text-[var(--gov-text-muted)]">今日暂无差评</div>
              )}
              {satisfaction.badReviews.map((r, i) => (
                <div key={`${r.time}-${i}`} className="min-w-0 border-b border-white/[0.06] pb-1.5">
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="min-w-0 truncate text-[var(--gov-text-primary)]">{r.item}</span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">{r.time}</span>
                  </div>
                  <div className="mt-0.5 flex justify-between gap-2 text-xs">
                    <span className="min-w-0 truncate text-[var(--gov-danger)]">{r.reason}</span>
                    <span className="shrink-0 text-[var(--gov-text-muted)]">{r.window}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </QueryState>
      </Card>

      <Card title="窗口人员" className="min-h-0 flex-[2.4]">
        <QueryState query={staffQuery}>
        <div className="chart-frame relative h-full">
          <ChartLegend items={[{ label: '接待数', color: theme.series[0] }, { label: '满意率 %', color: theme.accent }]} />
          <EChart option={{
            grid: { ...chartGrid(narrow ? 40 : 0), right: 8 },
            tooltip: axisTooltip,
            xAxis: categoryAxis(staff.map(d => d.name), narrow ? 40 : 0),
            yAxis: [
              valueAxis(),
              valueAxis({
                scale: true,
                min: 90,
                max: 100,
                position: 'right',
                splitLine: { show: false },
              }),
            ],
            series: [
              barSeries('接待数', staff.map(d => d['接待数']), theme.series[0], 8),
              {
                name: '满意率',
                type: 'line',
                yAxisIndex: 1,
                data: staff.map(d => d['满意度']),
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: { width: 1.5, color: theme.accent },
                itemStyle: { color: theme.accent },
              },
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      {selectedOverdue && (() => {
        const o = overdue.find(x => x.id === selectedOverdue);
        if (!o) return null;
        const isOver = o.level === 'overdue';
        const sent = urged.has(o.id);
        return (
          <Modal title={o.item} subtitle={o.id} onClose={() => setSelectedOverdue(null)} width={500}>
            <QueryState query={overdueQuery}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-[13px] text-[var(--gov-text-secondary)]">{o.window}</span>
              <span className={`shrink-0 text-xs tabular-nums ${isOver ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-warning)]'}`}>
                {o.deadlineText}
              </span>
            </div>
            <dl className="space-y-1.5 text-[13px]">
              {[
                { label: '申请人', value: o.applicant },
                { label: '受理时间', value: o.acceptedAt, mono: true },
                { label: '承诺期限', value: `${o.promiseDays} 个工作日` },
                { label: '受理窗口', value: o.window },
                { label: '当前环节', value: `${o.currentStep}（${o.stepOwner}）` },
              ].map(r => (
                <div key={r.label} className="flex justify-between gap-4">
                  <dt className="shrink-0 text-[var(--gov-text-muted)]">{r.label}</dt>
                  <dd className={`min-w-0 text-right text-[var(--gov-text-primary)] ${r.mono ? 'font-mono text-xs tabular-nums' : ''}`}>{r.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-1">
                <dt className="shrink-0 text-[var(--gov-text-muted)]">滞留原因</dt>
                <dd className="min-w-0 text-right text-[var(--gov-danger)]">{o.delayReason}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setUrged(prev => new Set(prev).add(o.id))}
              disabled={sent}
              className={`gov-btn mt-4 w-full rounded-md border py-1.5 text-[13px] ${
                sent
                  ? 'border-white/[0.12] text-[var(--gov-text-muted)]'
                  : 'border-[var(--gov-danger)] text-[var(--gov-danger)] hover:bg-[rgba(224,138,132,0.08)]'
              }`}
            >
              {sent ? '督办通知已发送至责任科室' : '发送督办通知'}
            </button>
            </QueryState>
          </Modal>
        );
      })()}
    </div>
  );
}
