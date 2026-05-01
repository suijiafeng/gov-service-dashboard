import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ComposedChart, Bar, Line, BarChart } from 'recharts';
import { Card } from './Card';
import { useServiceRecords, useWindowUsage, useStaffData, useAppointmentSlots } from '../hooks/useData';
import { useChartDataRefresh, useListCarousel } from '../hooks/useCarousel';


export function RightPanel() {
  const { data: serviceRecords } = useServiceRecords();
  const { data: windowData } = useWindowUsage();
  const { data: staffData } = useStaffData();
  const { data: slotData } = useAppointmentSlots();

  // 图表数据动态刷新
  const animatedWindowData = useChartDataRefresh(windowData, 4500, 0.1);
  const animatedStaffData = useChartDataRefresh(staffData, 5000, 0.12);

  // 叫号记录轮播
  const { visibleItems: visibleRecords } = useListCarousel(serviceRecords, 4, 2500);


  return (
    <div className="flex flex-col space-y-4 w-[28%] h-full pl-2">
      

      {/* 服务叫号记录 */}
      <Card title="服务叫号记录" className="flex-[2] min-h-0">
        <div className="h-full overflow-hidden">
          <table className="w-full text-xs text-center text-[var(--gov-text-secondary)]">
            <thead>
              <tr className="bg-[rgba(47,95,155,0.26)] border-b border-[color:var(--gov-border)]">
                <th className="py-2 font-normal">号码</th>
                <th className="py-2 font-normal">市民</th>
                <th className="py-2 font-normal">办理事项</th>
                <th className="py-2 font-normal">办理状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--gov-border)] bg-[rgba(14,38,68,0.32)]">
              {visibleRecords.map((row, i) => (
                <tr key={`${row.name}-${i}`} className="hover:bg-[rgba(47,95,155,0.16)] transition-all duration-500 animate-pulse-once">
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
      </Card>

      {/* 各窗口服务量统计 */}
      <Card title="各窗口服务量统计" className="flex-[1.5] min-h-0">
        <div className="h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={animatedWindowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBed1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5f8bc1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5f8bc1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBed2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#88a9cf" stopOpacity={0.22}/>
                  <stop offset="95%" stopColor="#88a9cf" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(9, 27, 49, 0.94)', borderColor: '#6b93c2', color: '#edf3fb' }}
              />
              <Area type="monotone" dataKey="类型一" stroke="#2f5f9b" strokeWidth={2} fillOpacity={1} fill="url(#colorBed1)" />
              <Area type="monotone" dataKey="类型二" stroke="#88a9cf" strokeWidth={2} fillOpacity={1} fill="url(#colorBed2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 工作人员接待情况分析 */}
      <Card title="工作人员接待情况分析" className="flex-[1.5] min-h-0">
        <div className="h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={animatedStaffData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="name" stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(9, 27, 49, 0.94)', borderColor: '#6b93c2', color: '#edf3fb' }}
              />
              <Bar dataKey="接待数" barSize={4} fill="#5f8bc1" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="目标" stroke="#c7a45a" strokeWidth={2} dot={{ r: 3, fill: '#c7a45a', strokeWidth: 0 }} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 预约时段分布 */}
      <Card title="预约时段分布" className="flex-[2.5] min-h-0">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slotData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="slotGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5f8bc1" stopOpacity={0.88} />
                  <stop offset="100%" stopColor="#2f5f9b" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gov-grid)" />
              <XAxis dataKey="time" stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--gov-text-muted)" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(9,27,49,0.94)', borderColor: '#6b93c2', color: '#edf3fb' }}
                formatter={(v: number | undefined) => [`${v ?? 0} 人`, '预约量']}
              />
              <Bar dataKey="count" fill="url(#slotGradient)" radius={[2, 2, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}
