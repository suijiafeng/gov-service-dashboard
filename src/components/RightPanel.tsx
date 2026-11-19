import { Card } from './Card';
import { ChartLegend } from './LeftPanel';
import { QueryState } from './QueryState';
import { EChart, axisTooltip, axisValueTooltip, barSeries, categoryAxis, chartGrid, valueAxis } from './EChart';
import { useServiceRecords, useWindowUsage, useStaffData, useAppointmentSlots } from '../hooks/useData';
import { useChartDataRefresh, useListCarousel } from '../hooks/useCarousel';
import { useNarrowChart, usePhoneLayout } from '../hooks/usePhoneLayout';
import { theme } from '../theme';

function statusClass(status: string) {
  if (status === '已完成') return 'text-[var(--gov-success)]';
  if (status === '办理中') return 'text-[var(--gov-blue-light)]';
  if (status === '待叫号') return 'text-[var(--gov-gold-soft)]';
  return 'text-[var(--gov-danger)]';
}

export function RightPanel() {
  const recordsQuery = useServiceRecords();
  const windowQuery = useWindowUsage();
  const staffQuery = useStaffData();
  const slotQuery = useAppointmentSlots();
  const narrow = useNarrowChart();
  const phone = usePhoneLayout();

  const animatedWindowData = useChartDataRefresh(windowQuery.data, 4500, 0.1);
  const animatedStaffData = useChartDataRefresh(staffQuery.data, 5000, 0.12);
  const { visibleItems: visibleRecords } = useListCarousel(recordsQuery.data, 4, 2500);
  const rotate = narrow ? 40 : 0;

  return (
    <div className="side-panel flex h-full w-[28%] min-w-0 flex-col gap-3 pl-2">

      <Card title="叫号记录" className="min-h-0 flex-[2]">
        <QueryState query={recordsQuery}>
        {phone ? (
          <ul className="divide-y divide-[color:var(--gov-border)]">
            {visibleRecords.map((row, i) => (
              <li key={`${row.date}-${i}`} className="flex min-w-0 items-center gap-2 py-2">
                <span className="w-14 shrink-0 font-mono text-xs tabular-nums text-[var(--gov-text-primary)]">{row.date}</span>
                <span className="w-14 shrink-0 truncate text-[13px] text-[var(--gov-text-secondary)]">{row.name}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--gov-text-secondary)]">{row.service}</span>
                <span className={`shrink-0 text-xs ${statusClass(row.status)}`}>{row.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full overflow-hidden">
            <table className="data-table w-full table-fixed text-left text-[13px] text-[var(--gov-text-secondary)]">
              <thead>
                <tr className="border-b border-[color:var(--gov-border)] text-xs text-[var(--gov-text-muted)]">
                  <th className="w-[22%] py-1.5 font-normal">号码</th>
                  <th className="w-[18%] py-1.5 font-normal">市民</th>
                  <th className="py-1.5 font-normal">办理事项</th>
                  <th className="w-[22%] py-1.5 text-right font-normal">状态</th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((row, i) => (
                  <tr key={`${row.date}-${i}`} className="border-b border-[color:var(--gov-border)]">
                    <td className="truncate py-1.5 font-mono text-xs tabular-nums text-[var(--gov-text-primary)]">{row.date}</td>
                    <td className="truncate py-1.5">{row.name}</td>
                    <td className="truncate py-1.5">{row.service}</td>
                    <td className={`py-1.5 text-right ${statusClass(row.status)}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </QueryState>
      </Card>

      <Card title="各窗口服务量" className="min-h-0 flex-[1.5]">
        <QueryState query={windowQuery}>
        <div className="chart-frame relative h-full">
          <ChartLegend items={[{ label: '本周', color: theme.blueLight }, { label: '上周', color: theme.weekPrior }]} />
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedWindowData.map(d => String(d.name)), rotate),
            yAxis: valueAxis(),
            series: [
              barSeries('本周', animatedWindowData.map(d => Number(d['本周'])), theme.blueLight, 10),
              barSeries('上周', animatedWindowData.map(d => Number(d['上周'])), theme.weekPrior, 10),
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="人员接待与目标" className="min-h-0 flex-[1.5]">
        <QueryState query={staffQuery}>
        <div className="chart-frame relative h-full">
          <ChartLegend items={[{ label: '接待数', color: theme.blueLight }, { label: '目标', color: theme.gold }]} />
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisTooltip,
            xAxis: categoryAxis(animatedStaffData.map(d => String(d.name)), rotate),
            yAxis: valueAxis(),
            series: [
              barSeries('接待数', animatedStaffData.map(d => Number(d['接待数'])), theme.blueLight, 8),
              {
                name: '目标',
                type: 'line',
                data: animatedStaffData.map(d => Number(d['目标'])),
                symbol: 'none',
                lineStyle: { type: 'dashed', width: 1.5, color: theme.gold },
                itemStyle: { color: theme.gold },
              },
            ],
          }} />
        </div>
        </QueryState>
      </Card>

      <Card title="预约时段" className="min-h-0 flex-[2.5]">
        <QueryState query={slotQuery}>
        <div className="chart-frame h-full">
          <EChart option={{
            grid: chartGrid(rotate),
            tooltip: axisValueTooltip((hour, value) => `${hour} 预约 ${value} 人`),
            xAxis: categoryAxis(slotQuery.data.map(d => d.time), rotate),
            yAxis: valueAxis(),
            series: [barSeries('预约量', slotQuery.data.map(d => d.count), theme.blueLight, 14)],
          }} />
        </div>
        </QueryState>
      </Card>

    </div>
  );
}
