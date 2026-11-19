/**
 * Precision dark. One accent. Warning and danger are semantic status
 * colors for the alert engine (queue / device / overdue), not a second brand.
 */
export const theme = {
  bg: '#09090B',
  surface: '#18181B',
  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  border: 'rgba(255,255,255,0.12)',
  grid: 'rgba(255,255,255,0.08)',
  accent: '#7DCCAA',
  warning: '#C4A574',
  danger: '#E08A84',
  /** Luminance steps for multi-series charts. Not a rainbow. */
  series: ['#D4D4D8', '#8A8A93', '#5E5E68', '#3F3F46'] as const,
};

export const axisFont = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
