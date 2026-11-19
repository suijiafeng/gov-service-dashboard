import { useMemo, useState } from 'react';
import { Card } from './Card';
import { Modal } from './Modal';
import { QueryState } from './QueryState';
import { combineQueries, useQueueData, useWindowMatrix, useDeviceStats, useOverdueItems, useWindowDetails } from '../hooks/useData';
import { estimateWaitMinutes, queueLevel, evaluateAlerts, AlertItem } from '../utils/alertEngine';
import { theme } from '../theme';

const STATUS_META = {
  busy: { label: '服务中', color: '#55a6e8', bg: 'rgba(46,123,209,0.55)' },
  idle: { label: '空闲', color: '#43cf8c', bg: 'rgba(67,207,140,0.25)' },
  paused: { label: '暂停', color: '#f0b95a', bg: 'rgba(240,185,90,0.26)' },
  away: { label: '离席', color: '#f2655c', bg: 'rgba(242,101,92,0.25)' },
} as const;

const LEVEL_COLOR = { red: 'var(--gov-danger)', yellow: 'var(--gov-warning)' } as const;

export function useAlerts() {
  const queues = useQueueData();
  const windows = useWindowMatrix();
  const devices = useDeviceStats();
  const overdue = useOverdueItems();
  const alerts = useMemo(
    () => evaluateAlerts(queues.data, windows.data, devices.data.devices, overdue.data),
    [queues.data, windows.data, devices.data, overdue.data],
  );
  return { alerts, ...combineQueries([queues, windows, devices, overdue]) };
}

export function DispatchPanel() {
  const queueQuery = useQueueData();
  const windowQuery = useWindowMatrix();
  const windowDetailsQuery = useWindowDetails();
  const alertsState = useAlerts();
  const queues = queueQuery.data;
  const windows = windowQuery.data;
  const windowDetails = windowDetailsQuery.data;
  const alerts: AlertItem[] = alertsState.alerts;
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [focusBusiness, setFocusBusiness] = useState<string | null>(null);

  const maxWaiting = Math.max(...queues.map(q => q.waiting), 1);
  const pendingAlerts = alerts.filter(a => !acknowledged.has(a.key));

  return (
    <div className="side-panel flex h-full w-[28%] min-w-0 flex-col gap-3 pr-2">

      <Card title="业务队列" className="min-h-0 flex-[3]">
        <QueryState query={queueQuery}>
        <div className="flex h-full flex-col justify-between gap-1.5 py-0.5">
          {queues.map(q => {
            const wait = estimateWaitMinutes(q);
            const level = queueLevel(q);
            const barColor = level === 'red' ? '#f2655c' : level === 'yellow' ? '#f0b95a' : '#55a6e8';
            const waitLabel = Number.isFinite(wait) ? `约 ${wait} 分钟` : '暂无开放窗口';
            return (
              <button
                key={q.type}
                type="button"
                onClick={() => setFocusBusiness(f => (f === q.type ? null : q.type))}
                title="点击后只高亮该业务的窗口，再点一次恢复"
                className={`gov-btn flex items-center gap-2 rounded-md px-1.5 py-0.5 text-left ${
                  focusBusiness === q.type ? 'bg-[rgba(120,175,235,0.16)]' : 'hover:bg-[rgba(120,175,235,0.08)]'
                }`}
              >
                <span className={`w-[4.5rem] shrink-0 truncate text-[13px] ${focusBusiness === q.type ? 'text-[var(--gov-link)]' : 'text-[var(--gov-text-secondary)]'}`}>{q.type}</span>
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-[rgba(120,175,235,0.16)]">
                  <div
                    className="h-full rounded-sm transition-[width] duration-150 ease-out"
                    style={{ width: `${(q.waiting / maxWaiting) * 100}%`, backgroundColor: barColor }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-sm tabular-nums text-[var(--gov-text-primary)]">
                  {q.waiting}<span className="text-xs font-sans text-[var(--gov-text-muted)]"> 人</span>
                </span>
                <span className={`w-[5.5rem] shrink-0 text-right text-xs tabular-nums ${level === 'red' ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-text-muted)]'}`}>
                  {waitLabel}
                </span>
              </button>
            );
          })}
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 pt-1 text-xs text-[var(--gov-text-muted)]">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#55a6e8]" />正常</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.warning }} />超过 20 人或 30 分钟</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.danger }} />超过 35 人或 45 分钟</span>
          </div>
        </div>
        </QueryState>
      </Card>

      <Card title={focusBusiness ? `窗口状态 · ${focusBusiness}` : '窗口状态'} className="min-h-0 flex-[3.5]">
        <QueryState query={windowQuery}>
        <div className="window-grid grid h-full grid-cols-4 gap-1.5 py-0.5">
          {windows.map(w => {
            const meta = STATUS_META[w.status];
            const dimmed = Boolean(focusBusiness && w.business !== focusBusiness);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWindow(w.id)}
                title="查看窗口详情"
                className={`gov-btn flex min-w-0 flex-col items-center justify-center rounded-md border px-1 py-1 text-center ${
                  dimmed ? 'opacity-30' : ''
                }`}
                style={{ backgroundColor: meta.bg, borderColor: meta.color }}
              >
                <span className="font-mono text-[13px] tabular-nums text-[var(--gov-text-primary)]">{w.id}</span>
                <span className="max-w-full truncate text-xs text-[var(--gov-text-secondary)]">{w.business}</span>
                <span className="text-xs" style={{ color: meta.color }}>
                  {meta.label}{w.status === 'busy' && w.elapsed != null ? ` ${w.elapsed} 分钟` : ''}
                </span>
              </button>
            );
          })}
        </div>
        </QueryState>
      </Card>

      <Card title={alertsState.loading ? '预警处置' : alertsState.error ? '预警处置' : `预警处置 · 待处理 ${pendingAlerts.length}`} className="min-h-0 flex-[3.5]">
        <QueryState query={alertsState} ignoreEmpty>
        <div className="custom-scrollbar h-full space-y-2 overflow-y-auto pr-1">
          {pendingAlerts.length === 0 && (
            <div className="flex h-full items-center justify-center text-[13px] text-[var(--gov-text-muted)]">
              当前无待处理预警，大厅运行平稳
            </div>
          )}
          {pendingAlerts.map(a => (
            <div key={a.key} className="rounded-md bg-[rgba(12,35,68,0.55)] px-2 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-xs font-medium" style={{ color: LEVEL_COLOR[a.level] }}>
                    {a.source}
                  </span>
                  <span className="truncate text-[13px] text-[var(--gov-text-primary)]">{a.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAcknowledged(prev => new Set(prev).add(a.key))}
                  className="gov-btn ml-1 shrink-0 rounded-md border border-[color:var(--gov-border-strong)] px-1.5 py-0.5 text-xs text-[var(--gov-text-secondary)] hover:bg-[rgba(120,175,235,0.16)] hover:text-[var(--gov-text-primary)]"
                >
                  确认处理
                </button>
              </div>
              {a.suggestion && (
                <p className="mt-1 text-xs leading-snug text-[var(--gov-warning)]">{a.suggestion}</p>
              )}
            </div>
          ))}
        </div>
        </QueryState>
      </Card>

      {selectedWindow && (() => {
        const w = windows.find(x => x.id === selectedWindow);
        const d = windowDetails.find(x => x.id === selectedWindow);
        const meta = w ? STATUS_META[w.status] : null;
        return (
          <Modal
            title={w ? `${w.id} 号窗口` : `${selectedWindow} 号窗口`}
            subtitle={w && d ? `${w.business} · ${d.staff}` : undefined}
            onClose={() => setSelectedWindow(null)}
            width={480}
          >
            <QueryState query={windowDetailsQuery}>
            {!w || !d || !meta ? (
              <div className="py-6 text-center text-[13px] text-[var(--gov-text-muted)]">暂无该窗口详情</div>
            ) : (
            <>
            <div className="stat-grid-4 mb-3 grid grid-cols-3 gap-px overflow-hidden rounded-md bg-[color:var(--gov-border)]">
              {[
                { label: '今日接待', value: d.todayServed.toLocaleString('zh-CN'), unit: '件' },
                { label: '平均办理', value: String(d.avgMinutes), unit: '分钟' },
                { label: '窗口满意率', value: String(d.satisfaction), unit: '%' },
              ].map(t => (
                <div key={t.label} className="flex flex-col items-center justify-center bg-[var(--gov-bg-panel-strong)] px-2 py-2">
                  <span className="font-mono text-base tabular-nums text-[var(--gov-text-primary)]">
                    {t.value}<span className="ml-1 font-sans text-xs text-[var(--gov-text-muted)]">{t.unit}</span>
                  </span>
                  <span className="mt-0.5 text-xs text-[var(--gov-text-secondary)]">{t.label}</span>
                </div>
              ))}
            </div>
            <dl className="space-y-1.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--gov-text-muted)]">当前状态</dt>
                <dd className="text-right" style={{ color: meta.color }}>
                  {meta.label}{w.status === 'busy' && w.elapsed != null ? `，已用时 ${w.elapsed} 分钟` : ''}
                </dd>
              </div>
              {w.item && (
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-[var(--gov-text-muted)]">正在办理</dt>
                  <dd className="min-w-0 truncate text-right text-[var(--gov-text-primary)]">{w.item}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-[var(--gov-text-muted)]">可受理业务</dt>
                <dd className="min-w-0 text-right text-[var(--gov-text-primary)]">{d.authorizedBusinesses.join(' / ')}</dd>
              </div>
            </dl>
            {w.status === 'busy' && (w.elapsed ?? 0) > 20 && (
              <p className="mt-3 text-[13px] leading-snug text-[var(--gov-warning)]">
                该件办理已超过 20 分钟。如属复杂件，可引导后续市民到综合窗口分流。
              </p>
            )}
            </>
            )}
            </QueryState>
          </Modal>
        );
      })()}
    </div>
  );
}
