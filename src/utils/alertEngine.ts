// 告警规则引擎：根据队列 / 设备 / 承诺件状态计算预警，阈值可配置（各地考核口径不同）

export interface QueueItem {
  type: string;
  waiting: number;
  avgMinutes: number;
  openWindows: number;
}

export interface WindowItem {
  id: string;
  business: string;
  status: 'busy' | 'idle' | 'paused' | 'away';
}

export interface DeviceItem {
  name: string;
  type: string;
  status: 'online' | 'offline' | 'fault';
  offlineMinutes?: number;
}

export interface OverdueItem {
  id: string;
  item: string;
  window: string;
  deadlineText: string;
  level: 'overdue' | 'near';
}

export type AlertLevel = 'red' | 'yellow';

export interface AlertItem {
  key: string;
  level: AlertLevel;
  source: '排队' | '设备' | '时效';
  message: string;
  suggestion?: string;
}

// 阈值配置（对应《产品重构方案》第 7 节指标字典）
export const QUEUE_THRESHOLDS = {
  yellowWaiting: 20,
  redWaiting: 35,
  yellowMinutes: 30,
  redMinutes: 45,
};

// 预计等待时长 = 队列长度 × 近期平均办理时长 ÷ 开放窗口数
export function estimateWaitMinutes(q: QueueItem): number {
  if (q.openWindows <= 0) return Number.POSITIVE_INFINITY;
  return Math.round((q.waiting * q.avgMinutes) / q.openWindows);
}

export function queueLevel(q: QueueItem): AlertLevel | null {
  const wait = estimateWaitMinutes(q);
  if (q.waiting > QUEUE_THRESHOLDS.redWaiting || wait > QUEUE_THRESHOLDS.redMinutes) return 'red';
  if (q.waiting > QUEUE_THRESHOLDS.yellowWaiting || wait > QUEUE_THRESHOLDS.yellowMinutes) return 'yellow';
  return null;
}

export function evaluateAlerts(
  queues: QueueItem[],
  windows: WindowItem[],
  devices: DeviceItem[],
  overdue: OverdueItem[],
): AlertItem[] {
  const alerts: AlertItem[] = [];

  const idleWindows = windows.filter(w => w.status === 'idle');

  for (const q of queues) {
    const level = queueLevel(q);
    if (!level) continue;
    const wait = estimateWaitMinutes(q);
    let suggestion: string | undefined;
    if (level === 'red') {
      const candidate = idleWindows.find(w => w.business !== q.type);
      suggestion = candidate
        ? `建议将空闲的 ${candidate.id} 号窗（${candidate.business}）切换为「${q.type}」业务`
        : `暂无空闲窗口，建议启用备用窗口或引导市民自助/网办`;
    }
    alerts.push({
      key: `queue-${q.type}`,
      level,
      source: '排队',
      message: `「${q.type}」积压 ${q.waiting} 人，预计等待 ${wait} 分钟`,
      suggestion,
    });
  }

  for (const d of devices) {
    if (d.status === 'online') continue;
    alerts.push({
      key: `device-${d.name}`,
      level: d.status === 'fault' || (d.offlineMinutes ?? 0) > 30 ? 'red' : 'yellow',
      source: '设备',
      message: `${d.name} ${d.status === 'fault' ? '故障' : '离线'}${d.offlineMinutes ? ` ${d.offlineMinutes} 分钟` : ''}`,
      suggestion: '已生成运维工单',
    });
  }

  for (const o of overdue) {
    if (o.level !== 'overdue') continue;
    alerts.push({
      key: `overdue-${o.id}`,
      level: 'red',
      source: '时效',
      message: `承诺件「${o.item}」已超期（${o.window}）`,
      suggestion: '请立即督办责任窗口',
    });
  }

  // 红色优先
  return alerts.sort((a, b) => (a.level === b.level ? 0 : a.level === 'red' ? -1 : 1));
}
