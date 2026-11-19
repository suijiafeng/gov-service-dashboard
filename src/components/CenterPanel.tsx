import { useEffect, useMemo, useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/esm/core';
import { echarts } from '../lib/echarts';
import HZJson from '../api/mock/hangzhou.json';
import { Card } from './Card';
import { Modal } from './Modal';
import { ChartLegend } from './LeftPanel';
import { EChart, areaSeries, axisTooltip, axisValueTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { QueryState } from './QueryState';
import {
  useDailyServiceStats,
  useSiteData,
  useResidenceDistribution,
  useDiversionStats,
  useDeviceStats,
  usePerformanceTrend,
  useSiteDetails,
} from '../hooks/useData';
import { useNarrowChart, usePhoneLayout } from '../hooks/usePhoneLayout';
import type { DashboardMode } from '../App';
import { theme } from '../theme';

const hangzhouMapData = HZJson as Parameters<typeof echarts.registerMap>[1];

const MAIN_HALL: [number, number] = [120.2115, 30.2465];

const SITE_STATUS_META = {
  normal: { label: '正常', color: '#43cf8c' },
  busy: { label: '繁忙', color: '#f0b95a' },
  alert: { label: '积压', color: '#f2655c' },
} as const;

function signed(value: number, digits: number) {
  const text = value.toFixed(digits);
  return value > 0 ? `+${text}` : text;
}

function deltaTone(favorable: boolean, flat: boolean) {
  if (flat) return 'var(--gov-text-muted)';
  return favorable ? 'var(--gov-success)' : 'var(--gov-danger)';
}

export function CenterPanel({ mode }: { mode: DashboardMode }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const chartRef = useRef<EChartsReactCore>(null);
  const phone = usePhoneLayout();
  const narrow = useNarrowChart();
  const siteDetailsQuery = useSiteDetails();
  const dailyQuery = useDailyServiceStats();
  const sitesQuery = useSiteData();
  const residenceQuery = useResidenceDistribution();
  const diversionQuery = useDiversionStats();
  const deviceQuery = useDeviceStats();
  const trendQuery = usePerformanceTrend();
  const siteDetails = siteDetailsQuery.data;
  const dailyStats = dailyQuery.data;
  const sites = sitesQuery.data;
  const residence = residenceQuery.data;
  const diversion = diversionQuery.data;
  const deviceStats = deviceQuery.data;
  const performanceTrend = trendQuery.data;

  useEffect(() => {
    try {
      echarts.registerMap('hangzhou', hangzhouMapData);
      setMapError(null);
      setMapLoaded(true);
    } catch (error) {
      setMapLoaded(false);
      setMapError(error instanceof Error ? error : new Error('地图数据加载失败'));
    }
  }, [mapAttempt]);

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

  const mapQuery = {
    loading: sitesQuery.loading || residenceQuery.loading || dailyQuery.loading || (!mapLoaded && !mapError),
    error: sitesQuery.error ?? residenceQuery.error ?? dailyQuery.error ?? mapError,
    empty: !sitesQuery.loading && !residenceQuery.loading && sitesQuery.empty && residenceQuery.empty,
    retry: () => {
      sitesQuery.retry();
      residenceQuery.retry();
      dailyQuery.retry();
      setMapAttempt((n) => n + 1);
    },
  };

  const mapTooltip = {
    trigger: 'item' as const,
    backgroundColor: theme.surface,
    borderColor: theme.borderStrong,
    borderWidth: 1,
    textStyle: { color: theme.text, fontSize: 12 },
  };

  const getMapOptions = () => ({
    backgroundColor: 'transparent',
    animation: false,
    tooltip: mapTooltip,
    visualMap: {
      min: 0,
      max: maxResidence,
      seriesIndex: 0,
      left: phone ? 8 : 24,
      bottom: phone ? 12 : 190,
      itemWidth: 8,
      itemHeight: phone ? 64 : 90,
      text: ['高', '低'],
      textStyle: { color: theme.textMuted, fontSize: 11 },
      calculable: false,
      inRange: {
        color: mode === 'report' ? [...theme.mapReport] : [...theme.mapDispatch],
      },
    },
    geo: {
      map: 'hangzhou',
      roam: false,
      zoom: phone ? 1.02 : 1.15,
      top: phone ? '8px' : '72px',
      left: 'center',
      zlevel: 1,
      label: { show: false },
      itemStyle: {
        areaColor: 'transparent',
        borderColor: 'rgba(170, 205, 242, 0.95)',
        borderWidth: 1,
      },
      emphasis: { disabled: true },
    },
    series: [
      {
        type: 'map',
        map: 'hangzhou',
        roam: false,
        zoom: phone ? 1.02 : 1.15,
        top: phone ? '8px' : '72px',
        left: 'center',
        zlevel: 1,
        label: { show: true, color: '#d5e4f5', fontSize: phone ? 11 : 12 },
        labelLayout: { hideOverlap: true },
        itemStyle: { borderColor: 'rgba(155, 195, 235, 0.7)', borderWidth: 0.8 },
        emphasis: {
          label: { show: true, color: '#ffffff', fontSize: 12, fontWeight: 600 },
          itemStyle: {
            areaColor: 'rgba(215, 185, 122, 0.85)',
            borderColor: '#ffe9b8',
            borderWidth: 1,
          },
        },
        select: { disabled: true },
        tooltip: {
          ...mapTooltip,
          formatter: (params: { name: string; value?: number }) =>
            params.value != null && !Number.isNaN(params.value)
              ? `${params.name}<br/>办事市民居住 ${Number(params.value).toLocaleString('zh-CN')} 人次/日`
              : params.name,
        },
        data: residence,
      },
      ...(mode === 'report'
        ? [
            {
              type: 'lines',
              zlevel: 2,
              effect: { show: false },
              lineStyle: { color: 'rgba(240, 185, 90, 0.65)', width: 1, opacity: 0.8, curveness: 0.18 },
              data: sites
                .filter(s => s.name !== '市民中心（主厅）')
                .map(s => ({ coords: [s.coord, MAIN_HALL] })),
            },
          ]
        : []),
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 3,
        rippleEffect: { show: false },
        label: {
          show: !phone,
          position: 'right',
          formatter: (p: { name: string }) => (p.name === '市民中心（主厅）' ? '主厅' : ''),
          color: '#f7fbff',
          fontSize: 12,
        },
        tooltip: {
          ...mapTooltip,
          formatter: (p: { name: string; data: { waiting: number; statusLabel: string } }) =>
            `${p.name}<br/>当前等待 ${p.data.waiting} 人<br/>状态 ${p.data.statusLabel}<br/>点击查看网点详情`,
        },
        symbolSize: (val: number[]) => (val[2] > 50 ? 10 : val[2] > 25 ? 8 : 6),
        data: sites.map(s => ({
          name: s.name,
          value: [...s.coord, s.waiting],
          waiting: s.waiting,
          statusLabel: SITE_STATUS_META[s.status].label,
          itemStyle: {
            color: mode === 'report' ? theme.reportScatter : SITE_STATUS_META[s.status].color,
            shadowBlur: 0,
            borderWidth: 0,
          },
        })),
      },
    ],
  });

  const onlineTrend = diversion.onlineRateTrend;
  const onlineTrendUp = onlineTrend > 0;

  const trendCards = trendFirst && trendLast
    ? [
        (() => {
          const delta = trendLast.平均等待 - trendFirst.平均等待;
          const pct = trendFirst.平均等待 === 0 ? 0 : (delta / trendFirst.平均等待) * 100;
          return {
            label: '高峰平均等待',
            value: `${trendLast.平均等待} 分钟`,
            sub: `较${trendFirst.month} ${signed(pct, 0)}%`,
            color: deltaTone(delta < 0, Math.abs(delta) < 0.05),
          };
        })(),
        (() => {
          const delta = trendLast.网办率 - trendFirst.网办率;
          return {
            label: '网办分流率',
            value: `${trendLast.网办率}%`,
            sub: `较${trendFirst.month} ${signed(delta, 1)} pp`,
            color: deltaTone(delta > 0, Math.abs(delta) < 0.05),
          };
        })(),
        (() => {
          const delta = trendLast.满意率 - trendFirst.满意率;
          return {
            label: '好差评满意率',
            value: `${trendLast.满意率}%`,
            sub: `较${trendFirst.month} ${signed(delta, 1)} pp`,
            color: deltaTone(delta > 0, Math.abs(delta) < 0.05),
          };
        })(),
      ]
    : [];

  return (
    <div className="center-panel flex h-full flex-1 flex-col px-2">
      <div className="map-stage relative min-h-0 flex-[8]">
        <QueryState query={mapQuery}>
        <div className="map-overlay absolute top-3 left-3 z-10 max-w-[calc(100%-1rem)] rounded-md border border-[color:var(--gov-border)] bg-[var(--gov-bg-panel-strong)] px-3 py-1.5">
          <span className="text-sm font-semibold tracking-normal text-[var(--gov-text-primary)]">
            {mode === 'dispatch' ? '市域网点运行' : '办事市民居住地'}
          </span>
        </div>

        {mode === 'dispatch' ? (
          <div className="map-overlay absolute top-3 right-3 z-20 max-w-full rounded-md border border-[color:var(--gov-border)] bg-[var(--gov-bg-panel-strong)] px-3 py-2">
            <div className="mb-1.5 text-[13px] font-semibold tracking-normal text-[var(--gov-text-primary)]">全市网点</div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {(Object.keys(SITE_STATUS_META) as (keyof typeof SITE_STATUS_META)[]).map(k => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SITE_STATUS_META[k].color }} />
                  <span className="text-xs text-[var(--gov-text-secondary)]">{SITE_STATUS_META[k].label}</span>
                  <span className="font-mono text-[13px] tabular-nums text-[var(--gov-text-primary)]">{statusCount[k]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="map-overlay absolute top-3 right-3 z-20 w-56 max-w-full rounded-md border border-[color:var(--gov-border)] bg-[var(--gov-bg-panel-strong)] px-3 py-2">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-semibold tracking-normal text-[var(--gov-text-primary)]">来访区县</span>
              <span className="text-xs text-[var(--gov-text-muted)]">人次/日</span>
            </div>
            <div className="space-y-1.5">
              {topDistricts.map((p, i) => (
                <div key={p.name} className="flex min-w-0 items-center gap-2">
                  <span className="w-4 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">{i + 1}</span>
                  <span className="w-14 shrink-0 truncate text-xs text-[var(--gov-text-secondary)]">{p.name}</span>
                  <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-sm bg-[rgba(120,175,235,0.16)]">
                    <div
                      className="h-full rounded-sm bg-[#55a6e8] transition-[width] duration-150 ease-out"
                      style={{ width: `${(p.value / maxResidence) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--gov-text-primary)]">{p.value.toLocaleString('zh-CN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="kpi-stack absolute right-3 bottom-6 z-20 w-44 overflow-hidden rounded-md border border-[color:var(--gov-border)] bg-[var(--gov-bg-panel-strong)]">
          {[
            { label: '今日预约', value: dailyStats.totalAppointments },
            { label: '已完成', value: dailyStats.completed },
            { label: '办理中', value: dailyStats.processing },
            { label: '待办件', value: dailyStats.pending },
          ].map(item => (
            <div key={item.label} className="flex items-baseline justify-between gap-2 border-b border-[color:var(--gov-border)] px-3 py-1.5 last:border-b-0">
              <span className="text-xs text-[var(--gov-text-secondary)]">{item.label}</span>
              <span className="font-mono text-sm tabular-nums text-[var(--gov-text-primary)]">{item.value.toLocaleString('zh-CN')}</span>
            </div>
          ))}
        </div>

        <div className="map-canvas-wrap flex h-full min-h-0 w-full items-center justify-center pt-14">
          {mapLoaded ? (
            <EChartsReactCore
              echarts={echarts}
              ref={chartRef}
              option={getMapOptions()}
              onEvents={{
                click: (params: { seriesType?: string; name?: string }) => {
                  if (!params.name) return;
                  if (params.seriesType === 'effectScatter') {
                    setSelectedSite(params.name);
                  } else if (params.seriesType === 'map') {
                    const site = sites.find(s => s.name.startsWith(params.name!));
                    if (site) setSelectedSite(site.name);
                  }
                },
              }}
              notMerge
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          ) : null}
        </div>
        </QueryState>
      </div>

      <div className="bottom-stage relative mt-3 flex min-h-0 flex-[2] flex-col">
        {mode === 'dispatch' ? (
          <Card title="分流与设备" className="h-full">
            <QueryState query={[diversionQuery, deviceQuery]}>
            <div className="split-row flex h-full items-stretch gap-3">
              <div className="grid flex-1 grid-cols-3 gap-px overflow-hidden rounded-md bg-[color:var(--gov-border)]">
                {[
                  {
                    label: '网办分流率',
                    value: `${diversion.onlineRate}%`,
                    sub: `环比 ${onlineTrend > 0 ? '+' : ''}${onlineTrend} pp`,
                    subColor: deltaTone(onlineTrendUp, onlineTrend === 0),
                  },
                  { label: '预约爽约率', value: `${diversion.noShowRate}%`, sub: '建议收紧放号', subColor: 'var(--gov-warning)' },
                  { label: '自助办理占比', value: `${diversion.selfServiceShare}%`, sub: '目标 30%', subColor: 'var(--gov-text-muted)' },
                ].map(t => (
                  <div key={t.label} className="flex flex-col items-center justify-center bg-[var(--gov-bg-panel)] px-2">
                    <span className="font-mono text-2xl font-semibold tabular-nums text-[var(--gov-text-primary)]">{t.value}</span>
                    <span className="mt-0.5 text-[13px] text-[var(--gov-text-secondary)]">{t.label}</span>
                    <span className="mt-0.5 text-xs tabular-nums" style={{ color: t.subColor }}>{t.sub}</span>
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-4 px-1">
                <div className="shrink-0">
                  <span className={`font-mono text-2xl font-semibold tabular-nums ${onlineRate < 95 ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-text-primary)]'}`}>{onlineRate}%</span>
                  <div className="text-[13px] text-[var(--gov-text-secondary)]">设备在线率</div>
                  <div className="text-xs tabular-nums text-[var(--gov-text-muted)]">{onlineDevices}/{deviceStats.devices.length} 台在线</div>
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  {abnormalDevices.map(d => (
                    <div key={d.name} className="flex min-w-0 items-center justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate text-[var(--gov-text-primary)]">
                        {d.name} · {d.status === 'fault' ? '故障' : '离线'}{d.offlineMinutes != null ? ` ${d.offlineMinutes} 分钟` : ''}
                      </span>
                      <span className="shrink-0 text-[var(--gov-warning)]">
                        {deviceStats.workOrders.find(w => w.device === d.name)?.status ?? '待派单'}
                      </span>
                    </div>
                  ))}
                  {abnormalDevices.length === 0 && (
                    <div className="text-[13px] text-[var(--gov-text-muted)]">全部设备在线</div>
                  )}
                </div>
              </div>
            </div>
            </QueryState>
          </Card>
        ) : (
          <Card title="近 6 个月运行成效" className="h-full">
            <QueryState query={trendQuery}>
            <div className="split-row flex h-full items-stretch gap-3">
              <dl className="w-56 shrink-0 divide-y divide-[color:var(--gov-border)]">
                {trendCards.map(t => (
                  <div key={t.label} className="flex items-baseline justify-between gap-3 py-1.5">
                    <dt className="text-xs text-[var(--gov-text-secondary)]">{t.label}</dt>
                    <dd className="text-right">
                      <div className="font-mono text-sm tabular-nums text-[var(--gov-text-primary)]">{t.value}</div>
                      <div className="text-xs tabular-nums" style={{ color: t.color }}>{t.sub}</div>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="chart-frame relative min-w-0 flex-1">
                <ChartLegend items={[{ label: '平均等待（分钟）', color: theme.blueLight }, { label: '网办率 %', color: theme.gold }]} />
                <EChart option={{
                  grid: chartGrid(0),
                  tooltip: axisTooltip,
                  xAxis: categoryAxis(performanceTrend.map(d => d.month)),
                  yAxis: [
                    valueAxis(),
                    valueAxis({
                      min: 50,
                      max: 70,
                      interval: 10,
                      position: 'right',
                      splitLine: { show: false },
                    }),
                  ],
                  series: [
                    barSeries('平均等待', performanceTrend.map(d => d['平均等待']), theme.blueLight, 10),
                    {
                      name: '网办率',
                      type: 'line',
                      yAxisIndex: 1,
                      data: performanceTrend.map(d => d['网办率']),
                      symbol: 'circle',
                      symbolSize: 4,
                      lineStyle: { width: 1.5, color: theme.gold },
                      itemStyle: { color: theme.gold },
                    },
                  ],
                }} />
              </div>
            </div>
            </QueryState>
          </Card>
        )}
      </div>

      {selectedSite && (() => {
        const site = sites.find(s => s.name === selectedSite);
        const detail = siteDetails[selectedSite];
        const meta = site ? SITE_STATUS_META[site.status] : null;
        const maxQ = detail ? Math.max(...detail.queues.map(q => q.waiting), 1) : 1;
        return (
          <Modal title={site?.name ?? selectedSite} onClose={() => setSelectedSite(null)} width={640}>
            <QueryState query={siteDetailsQuery}>
            {!site || !detail || !meta ? (
              <div className="py-6 text-center text-[13px] text-[var(--gov-text-muted)]">暂无该网点详情</div>
            ) : (
            <>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[13px]" style={{ color: meta.color }}>{meta.label}</span>
              <span className="font-mono text-xs tabular-nums text-[var(--gov-text-muted)]">值班 {detail.dutyPhone}</span>
            </div>

            <div className="stat-grid-4 mb-4 grid grid-cols-4 gap-px overflow-hidden rounded-md bg-[color:var(--gov-border)]">
              {[
                { label: '当前等待', value: `${site.waiting}`, unit: '人', warn: site.status === 'alert' },
                { label: '开放窗口', value: `${detail.openWindows}/${detail.totalWindows}`, unit: '' },
                { label: '今日受理', value: detail.todayAccepted.toLocaleString('zh-CN'), unit: '件' },
                { label: '今日满意率', value: `${detail.satisfaction}`, unit: '%' },
              ].map(t => (
                <div key={t.label} className="flex flex-col items-center justify-center bg-[var(--gov-bg-panel-strong)] px-2 py-2">
                  <span className={`font-mono text-base tabular-nums ${t.warn ? 'text-[var(--gov-danger)]' : 'text-[var(--gov-text-primary)]'}`}>
                    {t.value}{t.unit ? <span className="ml-1 font-sans text-xs text-[var(--gov-text-muted)]">{t.unit}</span> : null}
                  </span>
                  <span className="mt-0.5 text-xs text-[var(--gov-text-secondary)]">{t.label}</span>
                </div>
              ))}
            </div>

            <div className="modal-split flex gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 text-[13px] tracking-normal text-[var(--gov-text-secondary)]">分业务队列</div>
                <div className="space-y-1.5">
                  {detail.queues.map(q => (
                    <div key={q.type} className="flex min-w-0 items-center gap-2">
                      <span className="w-16 shrink-0 truncate text-xs text-[var(--gov-text-secondary)]">{q.type}</span>
                      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-[rgba(120,175,235,0.16)]">
                        <div
                          className="h-full rounded-sm bg-[#55a6e8]"
                          style={{ width: `${(q.waiting / maxQ) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--gov-text-primary)]">{q.waiting}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-frame min-w-0 flex-1">
                <div className="mb-1 text-[13px] tracking-normal text-[var(--gov-text-secondary)]">今日等待人数</div>
                <EChart
                  className="chart-plot chart-plot-fixed"
                  option={{
                    grid: { ...chartGrid(narrow ? 35 : 0), top: 8 },
                    tooltip: axisValueTooltip((hour, value) => `${hour} 等待 ${value} 人`),
                    xAxis: categoryAxis(detail.hourly.map(d => d.hour), narrow ? 35 : 0),
                    yAxis: valueAxis(),
                    series: [areaSeries('等待', detail.hourly.map(d => d.waiting), theme.blueLight)],
                  }}
                />
              </div>
            </div>

            {site.status !== 'normal' && (
              <p className="mt-3 text-[13px] leading-snug text-[var(--gov-warning)]">
                {site.status === 'alert'
                  ? '该网点队列积压。可联系值班长增开窗口，或引导市民到周边网点、网上办理。'
                  : '该网点当前繁忙，建议继续看队列变化。'}
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
