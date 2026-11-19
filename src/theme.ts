/**
 * 原主题色，取自去掉模板光效之前的 main（862d18a）。
 * 数值与当时的 CSS 变量和图表色一致；渐变、发光和重阴影不在这里。
 */
export const theme = {
  bg: '#07182f',
  bgDeep: '#0a2140',
  surface: 'rgba(12,35,68,0.94)',
  text: '#f2f7fd',
  textSecondary: '#c9daee',
  textMuted: '#9ab6d6',
  border: 'rgba(110, 168, 228, 0.55)',
  borderStrong: '#7fb3e8',
  grid: 'rgba(140, 180, 225, 0.2)',
  /** 主色 */
  blue: '#2e7bd1',
  blueLight: '#55a6e8',
  blueSoft: '#7cc4f0',
  /** 第二品牌色，原先的金 */
  gold: '#f0b95a',
  goldSoft: '#ffd188',
  success: '#43cf8c',
  danger: '#f2655c',
  link: '#81d4fa',
  linkHover: '#4fc3f7',
  clock: '#64b5f6',
  tickerAlert: '#e8a19a',
  reportScatter: '#ffd166',
  weekPrior: 'rgba(124,196,240,0.45)',
  /** 年龄四档，顺序与旧图一致 */
  series: ['#7cc4f0', '#55a6e8', '#2e7bd1', '#f0b95a'] as const,
  accent: '#2e7bd1',
  warning: '#f0b95a',
  mapDispatch: ['rgba(22, 55, 100, 0.96)', 'rgba(42, 100, 172, 0.95)', 'rgba(90, 150, 215, 0.95)'] as const,
  mapReport: ['rgba(22, 55, 100, 0.96)', 'rgba(46, 123, 209, 0.95)', 'rgba(120, 180, 240, 0.95)', 'rgba(240, 185, 90, 0.9)'] as const,
};

export const axisFont = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
