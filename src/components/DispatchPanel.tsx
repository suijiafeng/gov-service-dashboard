import { useMemo, useState } from 'react';
import { Card } from './Card';
import { Modal } from './Modal';
import { useQueueData, useWindowMatrix, useDeviceStats, useOverdueItems, useWindowDetails } from '../hooks/useData';
import { estimateWaitMinutes, queueLevel, evaluateAlerts, AlertItem } from '../utils/alertEngine';

const STATUS_META = {
  busy: { label: '服务中', color: '#55a6e8', bg: 'rgba(46,123,209,0.55)' },
  idle: { label: '空闲', color: '#43cf8c', bg: 'rgba(67,207,140,0.25)' },
  paused: { label: '暂停', color: '#f0b95a', bg: 'rgba(240,185,90,0.26)' },
  away: { label: '离席', color: '#f2655c', bg: 'rgba(242,101,92,0.25)' },
} as const;

const LEVEL_COLOR = { red: 'var(--gov-danger)', yellow: 'var(--gov-gold)' } as const;

export function useAlerts(): AlertItem[] {
  const { data: queues } = useQueueData();
  const { data: windows } = useWindowMatrix();
  const { data: deviceStats } = useDeviceStats();
  const { data: overdue } = useOverdueItems();
  return useMemo(
    () => evaluateAlerts(queues, windows, deviceStats.devices, overdue),
    [queues, windows, deviceStats, overdue],
  );
}

export function DispatchPanel() {
  const { data: queues } = useQueueData();
  const { data: windows } = useWindowMatrix();
  const { data: windowDetails } = useWindowDetails();
  const alerts = useAlerts();
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [focusBusiness, setFocusBusiness] = useState<string | null>(null);

  const maxWaiting = Math.max(...queues.map(q => q.waiting), 1);
  const pendingAlerts = alerts.filter(a => !acknowledged.has(a.key));

  return (
    <div className="flex flex-col space-y-4 w-[28%] h-full pr-2">

      {/* 队列看板 */}
      <Card title="业务队列实时看板" className="flex-[3] min-h-0">
        <div className="flex flex-col justify-between h-full py-1">
          {queues.map(q => {
            const wait = estimateWaitMinutes(q);
            const level = queueLevel(q);
            const barColor = level === 'red' ? '#f2655c' : level === 'yellow' ? '#f0b95a' : '#55a6e8';
            return (
              <div
                key={q.type}
                onClick={() => setFocusBusiness(f => (f === q.type ? null : q.type))}
                title="点击联动下方窗口矩阵"
                className={`flex items-center space-x-2 cursor-pointer rounded-sm px-1 -mx-1 transition-colors ${
                  focusBusiness === q.type ? 'bg-[rgba(120,175,235,0.16)]' : 'hover:bg-[rgba(120,175,235,0.08)]'
                }`}
              >
                <span className="w-16 text-xs text-[var(--gov-text-secondary)] shrink-0">{q.type}</span>
                <div className="flex-1 h-3 bg-[rgba(120,175,235,0.16)] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-700"
                    style={{ width: `${(q.waiting / maxWaiting) * 100}%`, backgroundColor: barColor, boxShadow: level ? `0 0 8px ${barColor}` : undefined }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-base font-bold" style={{ color: level ? barColor : '#f2f7fd' }}>
                  {q.waiting}<span className="text-[9px] text-[var(--gov-text-muted)] font-normal"> 人</span>
                </span>
                <span className={`w-16 text-right text-[11px] ${level === 'red' ? 'text-[var(--gov-danger)] font-bold' : 'text-[var(--gov-text-muted)]'}`}>
                  约 {wait} 分钟
                </span>
              </div>
            );
          })}
          <div className="flex items-center justify-end space-x-3 pt-1 text-[9px] text-[var(--gov-text-muted)]">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#55a6e8] mr-1" />正常</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f0b95a] mr-1" />繁忙 &gt;20人/30min</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f2655c] mr-1" />积压 &gt;35人/45min</span>
          </div>
        </div>
      </Card>

      {/* 窗口状态矩阵 */}
      <Card title={focusBusiness ? `窗口状态矩阵 · ${focusBusiness}` : '窗口状态矩阵'} className="flex-[3.5] min-h-0">
        <div className="grid grid-cols-4 gap-1.5 h-full py-1">
          {windows.map(w => {
            const meta = STATUS_META[w.status];
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWindow(w.id)}
                title="点击查看窗口详情"
                className={`flex flex-col items-center justify-center rounded-sm border text-center px-1 cursor-pointer transition-all duration-300 hover:brightness-125 ${
                  focusBusiness && w.business !== focusBusiness ? 'opacity-25' : ''
                }`}
                style={{ backgroundColor: meta.bg, borderColor: meta.color }}
              >
                <span className="text-base font-bold font-mono text-white">{w.id}</span>
                <span className="text-[10px] leading-tight text-[var(--gov-text-secondary)]">{w.business}</span>
                <span className="text-[10px] font-semibold" style={{ color: meta.color }}>
                  {meta.label}{w.status === 'busy' && w.elapsed != null ? ` ${w.elapsed}'` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 积压预警与处置 */}
      <Card title={`预警处置（待处理 ${pendingAlerts.length}）`} className="flex-[3.5] min-h-0">
        <div className="h-full overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {pendingAlerts.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-[var(--gov-success)]">
              ✓ 当前无待处理预警，大厅运行平稳
            </div>
          )}
          {pendingAlerts.map(a => (
            <div
              key={a.key}
              className="border-l-2 bg-[rgba(22,52,98,0.6)] px-2 py-1.5 rounded-sm"
              style={{ borderColor: LEVEL_COLOR[a.level] }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span
                    className="text-[9px] px-1 rounded-sm shrink-0 font-bold"
                    style={{ backgroundColor: LEVEL_COLOR[a.level], color: '#0a1f39' }}
                  >
                    {a.source}
                  </span>
                  <span className="text-[11px] text-[var(--gov-text-primary)] truncate">{a.message}</span>
                </div>
                <button
                  onClick={() => setAcknowledged(prev => new Set(prev).add(a.key))}
                  className="shrink-0 ml-2 text-[9px] px-1.5 py-0.5 border border-[color:var(--gov-border)] rounded-sm text-[var(--gov-text-secondary)] hover:border-[color:var(--gov-gold)] hover:text-white transition-colors"
                >
                  确认处理
                </button>
              </div>
              {a.suggestion && (
                <div className="text-[10px] text-[var(--gov-gold-soft)] mt-1 pl-0.5">→ {a.suggestion}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 窗口详情弹窗 */}
      {selectedWindow && (() => {
        const w = windows.find(x => x.id === selectedWindow);
        const d = windowDetails.find(x => x.id === selectedWindow);
        if (!w || !d) return null;
        const meta = STATUS_META[w.status];
        return (
          <Modal title={`${w.id} 号窗口`} subtitle={`${w.business} · 坐席 ${d.staff}`} onClose={() => setSelectedWindow(null)} width={480}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: '今日接待', value: `${d.todayServed} 件` },
                { label: '平均办理', value: `${d.avgMinutes} 分钟` },
                { label: '窗口满意率', value: `${d.satisfaction}%` },
              ].map(t => (
                <div key={t.label} className="flex flex-col items-center justify-center bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm py-2">
                  <span className="text-base font-bold font-mono text-white">{t.value}</span>
                  <span className="text-[9px] text-[var(--gov-text-secondary)] mt-0.5">{t.label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--gov-text-muted)]">当前状态</span>
                <span className="font-semibold" style={{ color: meta.color }}>
                  {meta.label}{w.status === 'busy' && w.elapsed != null ? `（已用时 ${w.elapsed} 分钟）` : ''}
                </span>
              </div>
              {w.item && (
                <div className="flex justify-between">
                  <span className="text-[var(--gov-text-muted)]">正在办理</span>
                  <span className="text-[var(--gov-text-primary)]">{w.item}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--gov-text-muted)]">可受理业务</span>
                <span className="text-[var(--gov-text-primary)]">{d.authorizedBusinesses.join(' / ')}</span>
              </div>
              {w.status === 'busy' && (w.elapsed ?? 0) > 20 && (
                <div className="text-[10px] text-[var(--gov-gold-soft)] bg-[rgba(240,185,90,0.1)] border-l-2 border-[color:var(--gov-gold)] px-2 py-1 rounded-sm !mt-3">
                  该件办理已超 20 分钟，如属复杂件可引导后续市民至综合窗口分流
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
