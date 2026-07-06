import { useState } from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, ComposedChart, Bar, Line } from 'recharts';
import { Card } from './Card';
import { Modal } from './Modal';
import { ChartLegend } from './LeftPanel';
import { useEfficiencyStats, useOverdueItems, useSatisfactionStats, useStaffPerformance } from '../hooks/useData';

function KpiTile({ label, value, unit, warn }: { label: string; value: string; unit?: string; warn?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm py-1.5">
      <div className="flex items-baseline space-x-0.5">
        <span className={`text-xl font-bold font-mono ${warn ? 'text-[var(--gov-danger)]' : 'text-white'}`}>{value}</span>
        {unit && <span className="text-[10px] text-[var(--gov-text-muted)]">{unit}</span>}
      </div>
      <span className="text-[10px] text-[var(--gov-text-secondary)] tracking-[0.12em]">{label}</span>
    </div>
  );
}

export function EfficiencyPanel() {
  const { data: efficiency } = useEfficiencyStats();
  const { data: overdue } = useOverdueItems();
  const { data: satisfaction } = useSatisfactionStats();
  const { data: staff } = useStaffPerformance();
  const [selectedOverdue, setSelectedOverdue] = useState<string | null>(null);
  const [urged, setUrged] = useState<Set<string>>(new Set());

  const totalReviews =
    satisfaction.counts.great + satisfaction.counts.good + satisfaction.counts.ok + satisfaction.counts.bad;

  return (
    <div className="flex flex-col space-y-4 w-[28%] h-full pl-2">

      {/* 办件时效 KPI */}
      <Card title="办件时效" className="flex-[1.6] min-h-0">
        <div className="grid grid-cols-4 gap-2 h-full items-center">
          <KpiTile label="按期办结率" value={`${efficiency.onTimeRate}`} unit="%" warn={efficiency.onTimeRate < 99} />
          <KpiTile label="即办件占比" value={`${efficiency.immediateRate}`} unit="%" />
          <KpiTile label="平均办理" value={`${efficiency.avgProcessMinutes}`} unit="min" />
          <KpiTile label="今日受理" value={efficiency.todayAccepted.toLocaleString()} unit="件" />
        </div>
      </Card>

      {/* 超期 / 临期红榜 */}
      <Card title={`超期 / 临期承诺件（${overdue.length}）`} className="flex-[2.4] min-h-0">
        <div className="h-full overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {overdue.map(o => (
            <div
              key={o.id}
              onClick={() => setSelectedOverdue(o.id)}
              title="点击查看办件详情"
              className={`border-l-2 px-2 py-1.5 rounded-sm bg-[rgba(22,52,98,0.6)] cursor-pointer transition-all hover:brightness-125 ${
                o.level === 'overdue' ? 'border-[color:var(--gov-danger)]' : 'border-[color:var(--gov-gold)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--gov-text-primary)] truncate">{o.item}</span>
                <span
                  className={`text-[10px] font-bold shrink-0 ml-2 ${
                    o.level === 'overdue' ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-gold-soft)]'
                  }`}
                >
                  {o.deadlineText}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5 text-[9px] text-[var(--gov-text-muted)]">
                <span>{o.id}</span>
                <span>{o.window}</span>
              </div>
            </div>
          ))}
          {overdue.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-[var(--gov-success)]">
              ✓ 无超期与临期承诺件
            </div>
          )}
        </div>
      </Card>

      {/* 好差评满意度 */}
      <Card title="好差评满意度" className="flex-[2.6] min-h-0">
        <div className="flex h-full space-x-3">
          <div className="flex flex-col items-center justify-center w-24 shrink-0">
            <div className="relative w-20 h-20">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(124,158,196,0.18)" strokeWidth="4" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="transparent" stroke="#43cf8c" strokeWidth="4"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * satisfaction.todayRate) / 100}
                  className="drop-shadow-[0_0_4px_rgba(67,207,140,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-white">{satisfaction.todayRate}%</span>
                <span className="text-[8px] text-[var(--gov-text-muted)]">今日满意率</span>
              </div>
            </div>
            <div className="text-[9px] text-[var(--gov-text-muted)] mt-1">本周 {satisfaction.weekRate}% · {totalReviews} 评</div>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="text-[10px] text-[var(--gov-text-secondary)] mb-1 tracking-[0.15em]">差评明细（限期整改）</div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5">
              {satisfaction.badReviews.map((r, i) => (
                <div key={i} className="bg-[rgba(242,101,92,0.16)] border-l-2 border-[color:var(--gov-danger)] px-2 py-1 rounded-sm">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[var(--gov-text-primary)]">{r.item}</span>
                    <span className="text-[var(--gov-text-muted)] font-mono">{r.time}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-[var(--gov-text-muted)] mt-0.5">
                    <span className="text-[var(--gov-danger)]">{r.reason}</span>
                    <span>{r.window}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 窗口人员绩效 */}
      <Card title="窗口人员绩效" className="flex-[2.4] min-h-0">
        <div className="h-full relative">
          <ChartLegend items={[{ label: '接待数', color: '#55a6e8' }, { label: '满意度%', color: '#f0b95a' }]} />
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={staff} margin={{ top: 12, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[95, 100]} hide />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(12,35,68,0.94)', borderColor: '#7fb3e8', color: '#f2f7fd' }} />
              <Bar yAxisId="left" dataKey="接待数" barSize={8} fill="#55a6e8" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="满意度" stroke="#f0b95a" strokeWidth={2} dot={{ r: 3, fill: '#f0b95a', strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 承诺件详情弹窗 */}
      {selectedOverdue && (() => {
        const o = overdue.find(x => x.id === selectedOverdue);
        if (!o) return null;
        const isOver = o.level === 'overdue';
        return (
          <Modal title="承诺件详情" subtitle={o.id} onClose={() => setSelectedOverdue(null)} width={500}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[var(--gov-text-primary)]">{o.item}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 ml-2 ${
                isOver ? 'bg-[rgba(242,101,92,0.2)] text-[var(--gov-danger)]' : 'bg-[rgba(240,185,90,0.16)] text-[var(--gov-gold-soft)]'
              }`}>
                {o.deadlineText}
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { label: '申请人', value: o.applicant },
                { label: '受理时间', value: o.acceptedAt },
                { label: '承诺期限', value: `${o.promiseDays} 个工作日` },
                { label: '受理窗口', value: o.window },
                { label: '当前环节', value: `${o.currentStep}（${o.stepOwner}）` },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[var(--gov-text-muted)] shrink-0">{r.label}</span>
                  <span className="text-[var(--gov-text-primary)] text-right ml-4">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between !mt-2.5">
                <span className="text-[var(--gov-text-muted)] shrink-0">滞留原因</span>
                <span className="text-[var(--gov-danger)] text-right ml-4">{o.delayReason}</span>
              </div>
            </div>
            <button
              onClick={() => setUrged(prev => new Set(prev).add(o.id))}
              disabled={urged.has(o.id)}
              className={`w-full mt-4 py-1.5 text-xs rounded-sm border transition-colors ${
                urged.has(o.id)
                  ? 'border-[color:var(--gov-success)] text-[var(--gov-success)] cursor-default'
                  : 'border-[color:var(--gov-danger)] text-[var(--gov-danger)] hover:bg-[rgba(242,101,92,0.14)]'
              }`}
            >
              {urged.has(o.id) ? '✓ 督办通知已发送至责任科室' : '发送督办通知'}
            </button>
          </Modal>
        );
      })()}
    </div>
  );
}
