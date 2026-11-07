import { Card } from './Card';
import { ChartLegend } from './LeftPanel';
import { QueryState } from './QueryState';
import { EChart, axisTooltip, axisValueTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { useServiceRecords, useWindowUsage, useStaffData, useAppointmentSlots } from '../hooks/useData';
import { useChartDataRefresh, useListCarousel } from '../hooks/useCarousel';
import { usePhoneLayout } from '../hooks/usePhoneLayout';
import { echarts } from '../lib/echarts';


export function RightPanel() {
  const recordsQuery = useServiceRecords();
  const windowQuery = useWindowUsage();
  const staffQuery = useStaffData();
  const slotQuery = useAppointmentSlots();
  const phone = usePhoneLayout();

  const animatedWindowData = useChartDataRefresh(windowQuery.data, 4500, 0.1);
  const animatedStaffData = useChartDataRefresh(staffQuery.data, 5000, 0.12);
  const { visibleItems: visibleRecords } = useListCarousel(recordsQuery.data, 4, 2500);
  const rotate = phone ? 40 : 0;

  return (
    <div className="side-panel flex flex-col space-y-4 w-[28%] h-full pl-2">

      <Card title="服务叫号记录" className="flex-[2] min-h-0">
        <QueryState query={recordsQuery}>
        <div className="h-full overflow-x-auto">
          <table className="data-table w-full text-sm text-center text-[var(--gov-text-secondary)]">
            <thead>
              <tr className="bg-[rgba(46,123,209,0.3)] border-b border-[color:var(--gov-border)]">
                <th className="py-2 font-normal">号码</th>
                <th className="py-2 font-normal">市民</th>
                <th className="py-2 font-normal">办理事项</th>
                <th className="py-2 font-normal">办理状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--gov-border)] bg-[rgba(14,38,68,0.32)]">
              {visibleRecords.map((row, i) => (
                <tr key={`${row.name}-${i}`} className="hover:bg-[rgba(46,123,209,0.18)] transition-all duration-500 animate-pulse-once">
                  <td className="py-2 text-[#e0f7fa]">{row.date}</td>
                  <td className="py-2">{row.name}</td>
                  <td className="py-2">{row.service}</td>
                  <td className={`py-2 ${row.status === '已完成' ? 'text-[var(--gov-success)]' : row.status === '待叫号' ? 'text-[var(--gov-gold-soft)]' : 'text-[var(--gov-danger)]'}`}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </QueryState>
      </Card>

      <Card title="各窗口服务量统计" className="flex-[1.5] min-h-0">
        <QueryState query={windowQuery}>
        <div className="chart-frame h-full relative">
          <ChartLegend items={[{ label: '本周', color: '#55a6e8' }, { label: '上周', color: 'rgba(124,196,240,0.45)' }]} />
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedWindowData.map(d => String(d.name)), rotate),
            yAxis: valueAxis(),
            series: [
              barSeries('本周', animatedWindowData.map(d => Number(d['本周'])), '#55a6e8', 10),
              barSeries('上周', animatedWindowData.map(d => Number(d['上周'])), 'rgba(124,196,240,0.45)', 10),
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="工作人员接待情况分析" className="flex-[1.5] min-h-0">
        <QueryState query={staffQuery}>
        <div className="chart-frame h-full relative">
          <ChartLegend items={[{ label: '接待数', color: '#55a6e8' }, { label: '目标', color: '#f0b95a' }]} />
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedStaffData.map(d => String(d.name)), rotate),
            yAxis: valueAxis(),
            series: [
              barSeries('接待数', animatedStaffData.map(d => Number(d['接待数'])), '#55a6e8', 8),
              {
                name: '目标',
                type: 'line',
                data: animatedStaffData.map(d => Number(d['目标'])),
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { type: 'dashed', width: 2, color: '#f0b95a' },
                itemStyle: { color: '#f0b95a' },
              },
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="预约时段分布" className="flex-[2.5] min-h-0">
        <QueryState query={slotQuery}>
        <div className="chart-frame h-full">
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisValueTooltip((hour, value) => `${hour} 预约量：${value} 人`),
            xAxis: categoryAxis(slotQuery.data.map(d => d.time), rotate),
            yAxis: valueAxis(),
            series: [{
              name: '预约量',
              type: 'bar',
              data: slotQuery.data.map(d => d.count),
              barWidth: 16,
              itemStyle: {
                borderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(85,166,232,0.88)' },
                  { offset: 1, color: 'rgba(46,123,209,0.45)' },
                ]),
              },
            }],
          }} />
        </div>
        </QueryState>
      </Card>

    </div>
  );
}
