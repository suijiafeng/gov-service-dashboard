// 只注册地图实际用到的图表，避免把完整 ECharts 打进单文件包。
import * as echarts from 'echarts/core';
import { BarChart, EffectScatterChart, LineChart, LinesChart, MapChart } from 'echarts/charts';
import { GeoComponent, GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  MapChart,
  LinesChart,
  EffectScatterChart,
  BarChart,
  LineChart,
  GeoComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export { echarts };
