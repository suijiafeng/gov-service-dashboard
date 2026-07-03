import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import HZJson from '../api/mock/hangzhou.json';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Bar, Line } from 'recharts';
import { Card } from './Card';
import { Modal } from './Modal';
import { ChartLegend } from './LeftPanel';
import {
  useDailyServiceStats,
  useSiteData,
  useResidenceDistribution,
  useDiversionStats,
  useDeviceStats,
  usePerformanceTrend,
  useSiteDetails,
} from '../hooks/useData';
import type { DashboardMode } from '../App';

const hangzhouMapData = HZJson as Parameters<typeof echarts.registerMap>[1];

const MAIN_HALL: [number, number] = [120.2115, 30.2465];

const SITE_STATUS_META = {
  normal: { label: '正常', color: '#43cf8c' },
  busy: { label: '繁忙', color: '#f0b95a' },
  alert: { label: '积压告警', color: '#f2655c' },
} as const;

export function CenterPanel({ mode }: { mode: DashboardMode }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const chartRef = useRef<ReactECharts>(null);
  const { data: siteDetails } = useSiteDetails();
  const { data: dailyStats } = useDailyServiceStats();
  const { data: sites } = useSiteData();
  const { data: residence } = useResidenceDistribution();
  const { data: diversion } = useDiversionStats();
  const { data: deviceStats } = useDeviceStats();
  const { data: performanceTrend } = usePerformanceTrend();

  useEffect(() => {
    try {
      echarts.registerMap('hangzhou', hangzhouMapData);
      setMapLoaded(true);
    } catch (error) {
      console.error('Error registering hangzhou geojson:', error);
    }
  }, []);

  const topDistricts = useMemo(
    () => [...residence].sort((a, b) => b.value - a.value).slice(0, 5),
    [residence],
  );
  const maxResidence = topDistricts[0]?.value ?? 1;

  const statusCount = useMemo(() => {
    const count = { normal: 0, busy: 0, alert: 0 };
    sites.forEach(s => { count[s.status] += 1; });
    return count;
  }, [sites]);

  const onlineDevices = deviceStats.devices.filter(d => d.status === 'online').length;
  const onlineRate = deviceStats.devices.length
    ? Math.round((onlineDevices / deviceStats.devices.length) * 1000) / 10
    : 100;
  const abnormalDevices = deviceStats.devices.filter(d => d.status !== 'online');

  const trendFirst = performanceTrend[0];
  const trendLast = performanceTrend[performanceTrend.length - 1];

  // 汇报模式：轮播高亮来访 TOP 区县
  useEffect(() => {
    if (!mapLoaded || mode !== 'report' || topDistricts.length === 0) return;
    let idx = 0;
    const timer = setInterval(() => {
      const chart = chartRef.current?.getEchartsInstance();
      if (!chart) return;
      const prev = (idx - 1 + topDistricts.length) % topDistricts.length;
      chart.dispatchAction({ type: 'downplay', seriesIndex: 0, name: topDistricts[prev].name });
      chart.dispatchAction({ type: 'highlight', seriesIndex: 0, name: topDistricts[idx].name });
      chart.dispatchAction({ type: 'showTip', seriesIndex: 0, name: topDistricts[idx].name });
      idx = (idx + 1) % topDistricts.length;
    }, 3000);
    return () => clearInterval(timer);
  }, [mapLoaded, mode, topDistricts]);

  const getMapOptions = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(12,35,68,0.94)',
      borderColor: '#7fb3e8',
      textStyle: { color: '#f2f7fd' },
    },
    visualMap: {
      min: 0,
      max: maxResidence,
      seriesIndex: 0,
      left: 24,
      bottom: 190,
      itemWidth: 10,
      itemHeight: 90,
      text: ['高', '低'],
      textStyle: { color: '#9ab6d6', fontSize: 10 },
      calculable: false,
      inRange: {
        color: mode === 'report'
          ? ['rgba(22, 55, 100, 0.96)', 'rgba(46, 123, 209, 0.95)', 'rgba(120, 180, 240, 0.95)', 'rgba(240, 185, 90, 0.9)']
          : ['rgba(22, 55, 100, 0.96)', 'rgba(42, 100, 172, 0.95)', 'rgba(90, 150, 215, 0.95)'],
      },
    },
    geo: [
      // 底层阴影地图：向下偏移形成悬浮立体感
      {
        map: 'hangzhou',
        roam: false,
        zoom: 1.15,
        top: '104px',
        left: 'center',
        silent: true,
        zlevel: 0,
        itemStyle: {
          areaColor: 'rgba(4, 14, 28, 0.85)',
          borderColor: 'rgba(70, 120, 180, 0.5)',
          borderWidth: 1,
          shadowColor: 'rgba(3, 10, 22, 0.9)',
          shadowBlur: 18,
          shadowOffsetY: 14,
        },
      },
      {
        map: 'hangzhou',
        roam: false,
        zoom: 1.15,
        top: '90px',
        left: 'center',
        zlevel: 1,
        label: { show: false },
        itemStyle: {
          areaColor: 'transparent',
          borderColor: 'rgba(170, 205, 242, 0.95)',
          borderWidth: 1.2,
          shadowColor: 'rgba(130, 182, 240, 0.55)',
          shadowBlur: 12,
        },
        emphasis: { disabled: true },
      },
    ],
    series: [
      // 居住地分布着色
      {
        type: 'map',
        map: 'hangzhou',
        roam: false,
        zoom: 1.15,
        top: '90px',
        left: 'center',
        zlevel: 1,
        label: { show: true, color: '#d5e4f5', fontSize: 11.5, opacity: 0.92 },
        itemStyle: { borderColor: 'rgba(155, 195, 235, 0.7)', borderWidth: 0.8 },
        emphasis: {
          label: { show: true, color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
          itemStyle: {
            areaColor: 'rgba(215, 185, 122, 0.85)',
            shadowColor: 'rgba(240, 185, 90, 0.65)',
            shadowBlur: 16,
            borderColor: '#ffe9b8',
            borderWidth: 1.4,
          },
        },
        select: { disabled: true },
        tooltip: {
          formatter: (params: { name: string; value?: number }) =>
            params.value != null && !Number.isNaN(params.value)
              ? `${params.name}<br/>办事市民居住占比：<span style="color:#ffd188;font-weight:bold">${Number(params.value).toLocaleString()}</span> 人次/日`
              : params.name,
        },
        data: residence,
      },
      // 汇报模式：区县 → 主厅飞线
      ...(mode === 'report'
        ? [
            {
              type: 'lines',
              zlevel: 2,
              effect: { show: true, period: 6, trailLength: 0.45, color: '#ffe9b8', symbolSize: 3 },
              lineStyle: { color: 'rgba(240, 185, 90, 0.25)', width: 1, opacity: 0.65, curveness: 0.25 },
              data: sites
                .filter(s => s.name !== '市民中心（主厅）')
                .map(s => ({ coords: [s.coord, MAIN_HALL] })),
            },
          ]
        : []),
      // 网点标注
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 1,
        zlevel: 3,
        rippleEffect: { brushType: 'stroke', scale: mode === 'report' ? 4 : 3 },
        label: {
          show: true,
          position: 'right',
          formatter: (p: { name: string }) => p.name.replace(/（主厅）|分中心|便民中心/g, ''),
          color: '#f7fbff',
          fontSize: 11,
          textShadowColor: 'rgba(5, 15, 29, 0.9)',
          textShadowBlur: 4,
        },
        tooltip: {
          formatter: (p: { name: string; data: { waiting: number; statusLabel: string } }) =>
            `${p.name}<br/>当前等待：<span style="color:#ffd188;font-weight:bold">${p.data.waiting}</span> 人<br/>状态：${p.data.statusLabel}<br/><span style="font-size:10px;color:#9ab6d6">点击查看网点详情</span>`,
        },
        symbolSize: (val: number[]) => (val[2] > 50 ? 13 : val[2] > 25 ? 10 : 7),
        data: sites.map(s => ({
          name: s.name,
          value: [...s.coord, s.waiting],
          waiting: s.waiting,
          statusLabel: SITE_STATUS_META[s.status].label,
          itemStyle: {
            color: mode === 'report' ? '#ffd166' : SITE_STATUS_META[s.status].color,
            borderColor: '#fff6dd',
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: mode === 'report' ? 'rgba(255, 209, 102, 0.75)' : SITE_STATUS_META[s.status].color,
          },
        })),
      },
    ],
  });

  return (
    <div className="flex-1 flex flex-col h-full px-2">
      {/* Map Section */}
      <div className="flex-[8] min-h-0 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-[rgba(12,35,68,0.82)] border border-[color:var(--gov-border)] px-4 py-2 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-[var(--gov-gold)] animate-pulse" />
          <span className="text-[var(--gov-text-primary)] font-semibold tracking-[0.18em]">
            {mode === 'dispatch' ? '市域政务服务网点运行图' : '办事市民居住地分布图'}
          </span>
        </div>

        {/* 右上角：调度=网点状态汇总 / 汇报=来访区县 TOP5 */}
        {mode === 'dispatch' ? (
          <div className="absolute top-4 right-4 z-20 bg-[rgba(12,35,68,0.82)] border border-[color:var(--gov-border)] rounded-sm backdrop-blur-sm px-3 py-2">
            <div className="text-xs font-semibold tracking-[0.2em] text-[var(--gov-text-primary)] mb-1.5">全市网点运行</div>
            <div className="flex items-center space-x-3">
              {(Object.keys(SITE_STATUS_META) as (keyof typeof SITE_STATUS_META)[]).map(k => (
                <div key={k} className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SITE_STATUS_META[k].color }} />
                  <span className="text-[10px] text-[var(--gov-text-secondary)]">{SITE_STATUS_META[k].label}</span>
                  <span className="text-xs font-bold font-mono text-white">{statusCount[k]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-20 w-48 bg-[rgba(12,35,68,0.82)] border border-[color:var(--gov-border)] rounded-sm backdrop-blur-sm px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-[var(--gov-text-primary)]">来访区县 TOP5</span>
              <span className="text-[9px] text-[var(--gov-text-muted)]">人次/日</span>
            </div>
            <div className="space-y-1.5">
              {topDistricts.map((p, i) => (
                <div key={p.name} className="flex items-center space-x-2">
                  <span className={`w-4 text-[10px] font-bold text-center rounded-sm ${i < 3 ? 'text-[#0a1f39] bg-[var(--gov-gold)]' : 'text-[var(--gov-text-muted)] bg-[rgba(120,175,235,0.24)]'}`}>
                    {i + 1}
                  </span>
                  <span className="w-12 text-[10px] text-[var(--gov-text-secondary)] truncate">{p.name}</span>
                  <div className="flex-1 h-1.5 bg-[rgba(120,175,235,0.2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2e7bd1] via-[#55a6e8] to-[#f0b95a] transition-all duration-1000"
                      style={{ width: `${(p.value / maxResidence) * 100}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-[10px] font-mono text-[var(--gov-gold-soft)]">{p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 右下角 KPI 指标（避开地图主体） */}
        <div className="absolute bottom-8 right-4 z-20 flex flex-col space-y-2">
          {[
            { label: '今日预约', value: dailyStats.totalAppointments },
            { label: '已完成', value: dailyStats.completed },
            { label: '办理中', value: dailyStats.processing },
            { label: '待办件', value: dailyStats.pending },
          ].map(item => (
            <div key={item.label} className="flex items-center space-x-2 bg-[rgba(12,35,68,0.76)] border-l-2 border-[color:var(--gov-gold)] pl-2 pr-3 py-1.5 backdrop-blur-sm">
              <span className="text-xs text-[var(--gov-text-secondary)] w-14">{item.label}</span>
              <span className="text-lg font-bold font-mono text-white">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-full pt-20 flex items-center justify-center">
          {mapLoaded ? (
            <ReactECharts
              ref={chartRef}
              option={getMapOptions()}
              onEvents={{
                click: (params: { seriesType?: string; name?: string }) => {
                  if (!params.name) return;
                  if (params.seriesType === 'effectScatter') {
                    setSelectedSite(params.name);
                  } else if (params.seriesType === 'map') {
                    // 点击区县面 → 打开该区县网点详情（大屏上比小标注更易点中）
                    const site = sites.find(s => s.name.startsWith(params.name!));
                    if (site) setSelectedSite(site.name);
                  }
                },
              }}
              notMerge
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--gov-text-secondary)]">
              加载地图数据中...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-[2] min-h-0 mt-4 flex flex-col relative">
        {mode === 'dispatch' ? (
          <Card title="分流与设备运行" className="h-full border-t-[color:var(--gov-border-strong)]">
            <div className="flex h-full items-stretch space-x-4">
              {/* 分流指标 */}
              <div className="grid grid-cols-3 gap-2 flex-1">
                {[
                  { label: '网办分流率', value: `${diversion.onlineRate}%`, sub: `环比 +${diversion.onlineRateTrend}pp`, subColor: 'var(--gov-success)' },
                  { label: '预约爽约率', value: `${diversion.noShowRate}%`, sub: '建议收紧放号', subColor: 'var(--gov-gold-soft)' },
                  { label: '自助办理占比', value: `${diversion.selfServiceShare}%`, sub: '目标 30%', subColor: 'var(--gov-text-muted)' },
                ].map(t => (
                  <div key={t.label} className="flex flex-col items-center justify-center bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm">
                    <span className="text-2xl font-bold font-mono text-white">{t.value}</span>
                    <span className="text-xs text-[var(--gov-text-secondary)] mt-0.5">{t.label}</span>
                    <span className="text-[10px] mt-0.5" style={{ color: t.subColor }}>{t.sub}</span>
                  </div>
                ))}
              </div>
              {/* 设备在线率与工单 */}
              <div className="flex-1 flex items-center space-x-3 bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm px-3">
                <div className="flex flex-col items-center shrink-0">
                  <span className={`text-2xl font-bold font-mono ${onlineRate < 95 ? 'text-[var(--gov-danger)]' : 'text-white'}`}>{onlineRate}%</span>
                  <span className="text-xs text-[var(--gov-text-secondary)]">设备在线率</span>
                  <span className="text-[10px] text-[var(--gov-text-muted)]">{onlineDevices}/{deviceStats.devices.length} 台在线</span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  {abnormalDevices.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-[10px] bg-[rgba(242,101,92,0.16)] border-l-2 border-[color:var(--gov-danger)] px-2 py-0.5 rounded-sm">
                      <span className="text-[var(--gov-text-primary)]">{d.name} · {d.status === 'fault' ? '故障' : '离线'} {d.offlineMinutes}min</span>
                      <span className="text-[var(--gov-gold-soft)]">
                        {deviceStats.workOrders.find(w => w.device === d.name)?.status ?? '待派单'}
                      </span>
                    </div>
                  ))}
                  {abnormalDevices.length === 0 && (
                    <div className="text-[10px] text-[var(--gov-success)]">✓ 全部设备运行正常</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="运行成效趋势（近 6 个月）" className="h-full border-t-[color:var(--gov-border-strong)]">
            <div className="flex h-full items-stretch space-x-3">
              {/* 关键成效 KPI */}
              <div className="grid grid-rows-3 gap-1.5 w-56 shrink-0">
                {(trendFirst && trendLast
                  ? [
                      { label: '高峰平均等待', value: `${trendLast.平均等待} 分钟`, sub: `较2月 ↓${Math.round((1 - trendLast.平均等待 / trendFirst.平均等待) * 100)}%` },
                      { label: '网办分流率', value: `${trendLast.网办率}%`, sub: `较2月 +${(trendLast.网办率 - trendFirst.网办率).toFixed(1)}pp` },
                      { label: '好差评满意率', value: `${trendLast.满意率}%`, sub: `较2月 +${(trendLast.满意率 - trendFirst.满意率).toFixed(1)}pp` },
                    ]
                  : []
                ).map(t => (
                  <div key={t.label} className="flex items-center justify-between bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm px-2.5">
                    <span className="text-[11px] text-[var(--gov-text-secondary)]">{t.label}</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-bold font-mono text-white">{t.value}</span>
                      <span className="text-[10px] text-[var(--gov-success)]">{t.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* 趋势图 */}
              <div className="flex-1 relative min-w-0">
                <ChartLegend items={[{ label: '平均等待(分钟)', color: '#55a6e8' }, { label: '网办率(%)', color: '#f0b95a' }]} />
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceTrend} margin={{ top: 14, right: 0, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
                    <XAxis dataKey="month" stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[50, 75]} hide />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(12,35,68,0.94)', borderColor: '#7fb3e8', color: '#f2f7fd' }} />
                    <Bar yAxisId="left" dataKey="平均等待" barSize={10} fill="#55a6e8" radius={[2, 2, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="网办率" stroke="#f0b95a" strokeWidth={2} dot={{ r: 3, fill: '#f0b95a', strokeWidth: 0 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 网点运行详情弹窗 */}
      {selectedSite && (() => {
        const site = sites.find(s => s.name === selectedSite);
        const detail = siteDetails[selectedSite];
        if (!site || !detail) return null;
        const meta = SITE_STATUS_META[site.status];
        const maxQ = Math.max(...detail.queues.map(q => q.waiting), 1);
        return (
          <Modal title={site.name} subtitle="网点运行详情 · 实时" onClose={() => setSelectedSite(null)} width={640}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: meta.color, color: '#0a1f39' }}>
                {meta.label}
              </span>
              <span className="text-[10px] text-[var(--gov-text-muted)]">值班电话 {detail.dutyPhone}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: '当前等待', value: `${site.waiting} 人`, warn: site.status === 'alert' },
                { label: '开放窗口', value: `${detail.openWindows}/${detail.totalWindows}` },
                { label: '今日受理', value: `${detail.todayAccepted.toLocaleString()} 件` },
                { label: '今日满意率', value: `${detail.satisfaction}%` },
              ].map(t => (
                <div key={t.label} className="flex flex-col items-center justify-center bg-[rgba(22,52,98,0.6)] border border-[color:var(--gov-border)] rounded-sm py-2">
                  <span className={`text-base font-bold font-mono ${t.warn ? 'text-[var(--gov-danger)]' : 'text-white'}`}>{t.value}</span>
                  <span className="text-[9px] text-[var(--gov-text-secondary)] mt-0.5">{t.label}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="text-[10px] text-[var(--gov-text-secondary)] tracking-[0.15em] mb-2">分业务队列</div>
                <div className="space-y-1.5">
                  {detail.queues.map(q => (
                    <div key={q.type} className="flex items-center space-x-2">
                      <span className="w-14 text-[10px] text-[var(--gov-text-secondary)] shrink-0">{q.type}</span>
                      <div className="flex-1 h-2 bg-[rgba(120,175,235,0.16)] rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm bg-gradient-to-r from-[#2e7bd1] to-[#55a6e8]"
                          style={{ width: `${(q.waiting / maxQ) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] font-mono text-white">{q.waiting}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 h-[130px]">
                <div className="text-[10px] text-[var(--gov-text-secondary)] tracking-[0.15em] mb-1">今日等待人数走势</div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={detail.hourly} margin={{ top: 4, right: 4, left: -28, bottom: 18 }}>
                    <defs>
                      <linearGradient id="siteHourly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#55a6e8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#55a6e8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
                    <XAxis dataKey="hour" stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(12,35,68,0.94)', borderColor: '#7fb3e8', color: '#f2f7fd' }}
                      formatter={(v: number | undefined) => [`${v ?? 0} 人`, '等待']}
                    />
                    <Area type="monotone" dataKey="waiting" stroke="#55a6e8" strokeWidth={2} fill="url(#siteHourly)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {site.status !== 'normal' && (
              <div className="mt-3 text-[10px] text-[var(--gov-gold-soft)] bg-[rgba(240,185,90,0.1)] border-l-2 border-[color:var(--gov-gold)] px-2 py-1.5 rounded-sm">
                {site.status === 'alert'
                  ? '该网点队列积压，建议联系值班长增开窗口，或引导市民至周边网点 / 线上办理'
                  : '该网点运行繁忙，建议关注队列变化趋势'}
              </div>
            )}
          </Modal>
        );
      })()}
    </div>
  );
}
