import EChartsReactCore from 'echarts-for-react/esm/core';
import type { EChartsCoreOption } from 'echarts/core';
import { echarts } from '../lib/echarts';

export const axisTooltip = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(12,35,68,0.94)',
  borderColor: '#7fb3e8',
  textStyle: { color: '#f2f7fd', fontSize: 12 },
};

export function chartGrid(rotate: number) {
  return {
    top: 28,
    right: 8,
    left: 4,
    bottom: rotate ? 4 : 0,
    containLabel: true,
  };
}

export function categoryAxis(labels: Array<string | number>, rotate = 0) {
  return {
    type: 'category' as const,
    data: labels,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#9ab6d6', fontSize: 10, rotate, interval: 0 },
  };
}

export function valueAxis(overrides: Record<string, unknown> = {}) {
  return {
    type: 'value' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#9ab6d6', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(140, 180, 225, 0.2)', type: 'dashed' } },
    ...overrides,
  };
}

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function areaSeries(name: string, data: number[], color: string) {
  return {
    name,
    type: 'line' as const,
    smooth: true,
    data,
    symbol: 'none',
    lineStyle: { width: 2, color },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: withAlpha(color, 0.32) },
        { offset: 1, color: withAlpha(color, 0) },
      ]),
    },
  };
}

export function barSeries(name: string, data: number[], color: string, barWidth = 8) {
  return {
    name,
    type: 'bar' as const,
    data,
    barWidth,
    itemStyle: { color, borderRadius: [2, 2, 0, 0] },
  };
}

export function EChart({
  option,
  className = 'chart-plot',
}: {
  option: EChartsCoreOption;
  className?: string;
}) {
  return (
    <EChartsReactCore
      echarts={echarts}
      option={option}
      className={className}
      style={{ width: '100%', height: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
