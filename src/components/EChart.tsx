import EChartsReactCore from 'echarts-for-react/esm/core';
import type { EChartsCoreOption } from 'echarts/core';
import { echarts } from '../lib/echarts';
import { axisFont, theme } from '../theme';

export const axisTooltip = {
  trigger: 'axis' as const,
  backgroundColor: theme.surface,
  borderColor: theme.borderStrong,
  borderWidth: 1,
  textStyle: { color: theme.text, fontSize: 12 },
};

type AxisTipParam = {
  axisValue?: string | number;
  axisValueLabel?: string | number;
  value?: number | number[];
};

/** 自定义文案时仍带上类目（时刻、窗口等），避免只剩一个数字。 */
export function axisValueTooltip(format: (axisLabel: string, value: number) => string) {
  return {
    ...axisTooltip,
    formatter: (params: AxisTipParam | AxisTipParam[]) => {
      const item = Array.isArray(params) ? params[0] : params;
      const label = String(item?.axisValueLabel ?? item?.axisValue ?? '');
      const raw = item?.value;
      const value = Array.isArray(raw) ? Number(raw[raw.length - 1]) : Number(raw ?? 0);
      return format(label, Number.isFinite(value) ? value : 0);
    },
  };
}

export function chartGrid(rotate: number) {
  return {
    top: 32,
    right: 8,
    left: 4,
    bottom: rotate ? 20 : 4,
    containLabel: true,
  };
}

export function categoryAxis(labels: Array<string | number>, rotate = 0) {
  return {
    type: 'category' as const,
    data: labels,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: theme.textMuted,
      fontSize: 11,
      rotate,
      interval: 0,
    },
  };
}

export function valueAxis(overrides: Record<string, unknown> = {}) {
  return {
    type: 'value' as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: theme.textMuted, fontSize: 11, fontFamily: axisFont },
    splitLine: { show: true, lineStyle: { color: theme.grid, type: 'dashed' as const } },
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
    smooth: false,
    data,
    symbol: 'none',
    lineStyle: { width: 1.5, color },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: withAlpha(color, 0.12) },
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
      option={{ ...option, animation: false }}
      className={className}
      style={{ width: '100%', height: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
