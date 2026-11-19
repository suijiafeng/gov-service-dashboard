// Mock 数据定义

// 市民年龄分布数据
export const ageDistributionData = [
  { name: '一季度', '0-16岁': 62,  '17-39岁': 248, '40-59岁': 391, '60岁以上': 214 },
  { name: '二季度', '0-16岁': 97,  '17-39岁': 336, '40-59岁': 352, '60岁以上': 188 },
  { name: '三季度', '0-16岁': 141, '17-39岁': 302, '40-59岁': 287, '60岁以上': 163 },
  { name: '四季度', '0-16岁': 74,  '17-39岁': 271, '40-59岁': 418, '60岁以上': 246 },
];

// 每周人流量数据
export const weeklyFlowData = [
  { name: '周一', 现场办理: 612, 网上办理: 488 },
  { name: '周二', 现场办理: 574, 网上办理: 501 },
  { name: '周三', 现场办理: 493, 网上办理: 466 },
  { name: '周四', 现场办理: 538, 网上办理: 442 },
  { name: '周五', 现场办理: 589, 网上办理: 517 },
  { name: '周六', 现场办理: 246, 网上办理: 318 },
  { name: '周日', 现场办理: 168, 网上办理: 221 },
];

// 热门办理事项
export const serviceCategories = ['户籍办理', '社保查询', '营业执照', '不动产登记', '公积金', '税务申报'];

// 今日办理事项排行（按实际办件量，支撑动态开窗与物料准备）
export const serviceItemRanking = [
  { name: '社会保障卡补领', count: 186, trend: 4 },
  { name: '不动产转移登记', count: 142, trend: -11 },
  { name: '个体工商户设立', count: 128, trend: 7 },
  { name: '户口迁移', count: 97, trend: 0 },
  { name: '住房公积金提取', count: 84, trend: -3 },
  { name: '不动产抵押登记', count: 61, trend: 2 },
];

// 运行成效趋势（近 6 个月，汇报模式核心成绩单）
export const performanceTrend = [
  { month: '6月', 平均等待: 28, 网办率: 58.4, 满意率: 96.2 },
  { month: '7月', 平均等待: 26, 网办率: 61.1, 满意率: 96.8 },
  { month: '8月', 平均等待: 31, 网办率: 57.6, 满意率: 95.4 },
  { month: '9月', 平均等待: 24, 网办率: 63.2, 满意率: 97.1 },
  { month: '10月', 平均等待: 22, 网办率: 64.8, 满意率: 96.5 },
  { month: '11月', 平均等待: 25, 网办率: 62.8, 满意率: 95.9 },
];

// 业务办理统计
export const visitStatistics = {
  lastMonth: {
    infant: 38462,
    adult: 29107,
  },
  thisMonth: {
    youth: 21046,
    elderly: 8731,
  },
};

// 预约时段分布
export const appointmentSlots = [
  { time: '08:00', count: 36 },
  { time: '09:00', count: 142 },
  { time: '10:00', count: 168 },
  { time: '11:00', count: 121 },
  { time: '12:00', count: 44 },
  { time: '13:00', count: 79 },
  { time: '14:00', count: 133 },
  { time: '15:00', count: 97 },
  { time: '16:00', count: 112 },
  { time: '17:00', count: 41 },
];

// 公告内容
export const announcement = '请通过浙里办或本厅官网预约。3 至 5 号窗口暂停服务，预计 14:00 恢复，未预约请到综合窗口取号。本周五 15:30 消防演练，演练期间暂停取号约 20 分钟。';

// 服务叫号记录
export const serviceRecords = [
  { date: 'A0231', name: '张*', service: '新生儿入户', status: '已完成' },
  { date: 'B0089', name: '欧阳**', service: '养老保险关系转移', status: '办理中' },
  { date: 'A0232', name: '王*', service: '个体工商户设立', status: '已完成' },
  { date: 'C0045', name: '司马*', service: '二手房转移登记', status: '待叫号' },
  { date: 'B0090', name: '陈**', service: '住房公积金提取', status: '办理中' },
  { date: 'A0233', name: '李*', service: '发票代开', status: '已完成' },
  { date: 'D0031', name: '上官*', service: '社会保障卡补领', status: '过号' },
  { date: 'C0046', name: '周*', service: '食品经营许可变更', status: '已完成' },
  { date: 'B0091', name: '吴**', service: '医保费用报销', status: '办理中' },
  { date: 'A0234', name: '郑*', service: '不动产抵押登记', status: '待叫号' },
];

// 各窗口服务量
export const windowUsageData = [
  { name: '综合窗口', 本周: 186, 上周: 204 },
  { name: '户籍窗口', 本周: 241, 上周: 228 },
  { name: '社保窗口', 本周: 167, 上周: 193 },
  { name: '税务窗口', 本周: 132, 上周: 141 },
  { name: '不动产', 本周: 118, 上周: 96 },
];

// 工作人员接待数据
export const staffData = [
  { name: '张晓辉', 接待数: 31, 目标: 70 },
  { name: '李文静', 接待数: 44, 目标: 80 },
  { name: '王志强', 接待数: 52, 目标: 75 },
  { name: '赵敏', 接待数: 28, 目标: 70 },
  { name: '陈立', 接待数: 47, 目标: 80 },
];

// 今日政务服务情况
export const dailyServiceStats = {
  totalAppointments: 6842,
  pending: 1137,
  completed: 5219,
  processing: 486,
  praised: 4940,
};

// 自助服务终端统计
export const equipmentStats = [
  { name: '自助终端1', count: '620', percent: '-9%', trend: 'down' as const },
  { name: '自助终端2', count: '129', percent: '8%', trend: 'up' as const },
  { name: '自助终端3', count: '208', percent: '11%', trend: 'up' as const },
  { name: '自助终端4', count: '568', percent: '-26%', trend: 'down' as const },
  { name: '自助终端5', count: '312', percent: '6%', trend: 'up' as const },
  { name: '自助终端6', count: '760', percent: '52%', trend: 'up' as const },
  { name: '自助终端7', count: '114', percent: '10%', trend: 'none' as const },
];

// 地图流向数据
export const mapFlowData = {
  lines: [
    { coords: [[116.405285, 39.904989], [121.473701, 31.230416]] }, // 北京 to 上海
    { coords: [[114.05956, 22.54286], [116.405285, 39.904989]] },   // 深圳 to 北京
    { coords: [[104.065735, 30.659462], [113.264385, 23.12911]] },  // 成都 to 广州
    { coords: [[108.948024, 34.263161], [116.405285, 39.904989]] }, // 西安 to 北京
  ],
  cities: [
    { name: '北京', value: [116.405285, 39.904989] },
    { name: '上海', value: [121.473701, 31.230416] },
    { name: '广州', value: [113.264385, 23.12911] },
    { name: '深圳', value: [114.05956, 22.54286] },
    { name: '成都', value: [104.065735, 30.659462] },
    { name: '西安', value: [108.948024, 34.263161] },
  ],
};

// 网上办件率
export const educationStats = {
  bachelor: 64.2,
};

// ==================== v2 调度模式数据 ====================

// 业务队列实时状态（来源：排队叫号系统，P1 切换为 WebSocket 推送）
export const queueData = [
  { type: '综合受理', waiting: 12, avgMinutes: 9, openWindows: 4 },
  { type: '社保医保', waiting: 38, avgMinutes: 11, openWindows: 3 },
  { type: '户籍身份', waiting: 16, avgMinutes: 7, openWindows: 3 },
  { type: '不动产登记', waiting: 24, avgMinutes: 15, openWindows: 2 },
  { type: '税务办理', waiting: 8, avgMinutes: 10, openWindows: 2 },
  { type: '公积金', waiting: 3, avgMinutes: 6, openWindows: 1 },
];

// 窗口状态矩阵（来源：一窗受理平台坐席状态）
export type WindowStatus = 'busy' | 'idle' | 'paused' | 'away';
export const windowMatrix: { id: string; business: string; status: WindowStatus; item?: string; elapsed?: number }[] = [
  { id: '01', business: '综合受理', status: 'busy', item: '营业执照设立', elapsed: 12 },
  { id: '02', business: '综合受理', status: 'busy', item: '食品经营许可', elapsed: 6 },
  { id: '03', business: '综合受理', status: 'busy', item: '公司变更登记', elapsed: 18 },
  { id: '04', business: '综合受理', status: 'idle' },
  { id: '05', business: '社保医保', status: 'busy', item: '养老保险转移', elapsed: 9 },
  { id: '06', business: '社保医保', status: 'busy', item: '医保报销', elapsed: 21 },
  { id: '07', business: '社保医保', status: 'busy', item: '社保卡补办', elapsed: 4 },
  { id: '08', business: '不动产登记', status: 'busy', item: '二手房过户', elapsed: 26 },
  { id: '09', business: '不动产登记', status: 'busy', item: '抵押登记', elapsed: 11 },
  { id: '10', business: '户籍身份', status: 'busy', item: '新生儿落户', elapsed: 7 },
  { id: '11', business: '户籍身份', status: 'busy', item: '身份证换领', elapsed: 3 },
  { id: '12', business: '户籍身份', status: 'idle' },
  { id: '13', business: '税务办理', status: 'busy', item: '发票代开', elapsed: 8 },
  { id: '14', business: '税务办理', status: 'paused' },
  { id: '15', business: '公积金', status: 'busy', item: '公积金提取', elapsed: 5 },
  { id: '16', business: '综合受理', status: 'away' },
];

// 效能考核指标（来源：一窗受理平台）
export const efficiencyStats = {
  onTimeRate: 97.4,        // 承诺件按期办结率 %
  immediateRate: 71.6,     // 即办件占比 %
  avgProcessMinutes: 11.8, // 平均办理时长（分钟）
  todayAccepted: 1286,     // 今日受理量
};

// 超期 / 临期承诺件红榜（点击可查看办件详情并督办）
export const overdueItems = [
  {
    id: 'HZSC-20261104-0842', item: '建设工程规划许可', window: '不动产 08 窗',
    deadlineText: '已超期 6 小时', level: 'overdue' as const,
    applicant: '杭州市钱塘湾建设发展有限公司', acceptedAt: '2026-11-04 09:32:18', promiseDays: 7,
    currentStep: '规划科技术审查', stepOwner: '规划科 · 周启明', delayReason: '建设单位尚未补交日照分析报告',
  },
  {
    id: 'HZSC-20261113-1106', item: '城镇污水排入排水管网许可', window: '综合 03 窗',
    deadlineText: '剩余 5 小时', level: 'near' as const,
    applicant: '西湖区清波餐饮管理有限公司', acceptedAt: '2026-11-13 14:05:42', promiseDays: 4,
    currentStep: '现场核查结果录入', stepOwner: '市政科 · 李文静', delayReason: '现场核查已完成，结果尚未录入系统',
  },
  {
    id: 'HZSC-20261116-0733', item: '食品经营许可变更', window: '综合 05 窗',
    deadlineText: '剩余 19 小时', level: 'near' as const,
    applicant: '滨江区星澜便利店', acceptedAt: '2026-11-16 10:47:06', promiseDays: 3,
    currentStep: '材料复核', stepOwner: '市场科 · 赵敏', delayReason: '经营范围变更需核对前后置许可',
  },
];

// 好差评满意度（来源：好差评系统）
export const satisfactionStats = {
  todayRate: 94.7,
  weekRate: 95.8,
  counts: { great: 812, good: 246, ok: 41, bad: 18 },
  badReviews: [
    { time: '10:42:17', window: '社保 06 窗', item: '养老保险关系转移', reason: '等待超过 40 分钟' },
    { time: '09:15:03', window: '综合 02 窗', item: '公司注销登记', reason: '一次性告知不完整' },
  ],
};

// 窗口人员绩效（接待量 / 平均时长 / 满意度三维）
export const staffPerformance = [
  { name: '张晓辉', 接待数: 31, 平均时长: 8.4, 满意度: 97.2 },
  { name: '李文静', 接待数: 44, 平均时长: 7.1, 满意度: 96.4 },
  { name: '王志强', 接待数: 52, 平均时长: 6.6, 满意度: 98.1 },
  { name: '赵敏', 接待数: 28, 平均时长: 12.8, 满意度: 94.6 },
  { name: '陈立', 接待数: 47, 平均时长: 9.3, 满意度: 95.8 },
];

// 市域政务服务网点（示范城市：杭州）
export type SiteStatus = 'normal' | 'busy' | 'alert';
export const siteData: { name: string; coord: [number, number]; status: SiteStatus; waiting: number }[] = [
  { name: '市民中心（主厅）', coord: [120.2115, 30.2465], status: 'busy', waiting: 101 },
  { name: '上城区分中心', coord: [120.219068, 30.288987], status: 'normal', waiting: 23 },
  { name: '拱墅区分中心', coord: [120.160939, 30.328885], status: 'normal', waiting: 18 },
  { name: '西湖区分中心', coord: [120.08362, 30.200766], status: 'busy', waiting: 41 },
  { name: '滨江区分中心', coord: [120.185306, 30.18046], status: 'normal', waiting: 15 },
  { name: '萧山区分中心', coord: [120.27069, 30.162932], status: 'alert', waiting: 56 },
  { name: '余杭区分中心', coord: [119.914653, 30.36723], status: 'normal', waiting: 21 },
  { name: '富阳区分中心', coord: [119.839599, 29.995217], status: 'normal', waiting: 12 },
  { name: '临安区分中心', coord: [119.343995, 30.201854], status: 'normal', waiting: 9 },
  { name: '钱塘区分中心', coord: [120.525025, 30.315277], status: 'busy', waiting: 34 },
  { name: '临平区分中心', coord: [120.246279, 30.430149], status: 'normal', waiting: 16 },
  { name: '桐庐县便民中心', coord: [119.553936, 29.830649], status: 'normal', waiting: 7 },
  { name: '淳安县便民中心', coord: [118.889354, 29.608818], status: 'normal', waiting: 5 },
  { name: '建德市便民中心', coord: [119.372981, 29.48107], status: 'normal', waiting: 8 },
];

// 网点运行详情（点击地图网点查看；P1 对接各分中心叫号系统后实时生成）
const SITE_BUSINESSES = ['综合受理', '社保医保', '户籍身份', '不动产登记', '税务办理'];
const SITE_QUEUE_RATIO = [0.3, 0.26, 0.19, 0.15, 0.1];
export const siteDetails = Object.fromEntries(
  siteData.map((s, i) => {
    const base = s.waiting;
    return [
      s.name,
      {
        totalWindows: Math.max(6, Math.round(base / 2)),
        openWindows: Math.max(4, Math.round(base / 2.6)),
        todayAccepted: 150 + base * 14,
        satisfaction: Math.round((96.4 - (s.status === 'alert' ? 2.4 : s.status === 'busy' ? 0.8 : 0)) * 10) / 10,
        queues: SITE_BUSINESSES.map((b, j) => ({
          type: b,
          waiting: Math.max(0, Math.round(base * SITE_QUEUE_RATIO[j])),
        })),
        hourly: [0.46, 0.82, 1, 0.74, 0.36, 0.58, 0.88, 0.61, 0.44].map((ratio, hourIndex) => ({
          hour: `${hourIndex + 8}:00`,
          waiting: Math.max(1, Math.round(base * ratio)),
        })),
        dutyPhone: `0571-${String(86021036 + i * 173)}`,
      },
    ];
  }),
);

// 窗口坐席详情（点击窗口矩阵格子查看）
const STAFF_NAMES = ['张晓辉', '李文静', '王志强', '赵敏', '陈立', '刘洋', '孙倩', '周斌', '吴桂芳', '郑凯', '钱进', '冯雪', '蒋涛', '沈丽', '韩磊', '杨帆'];
export const windowDetails = windowMatrix.map((w, i) => ({
  id: w.id,
  staff: STAFF_NAMES[i % STAFF_NAMES.length],
  todayServed: 18 + ((i * 7) % 23),
  avgMinutes: Math.round((6 + ((i * 3) % 7) + (i % 2) * 0.5) * 10) / 10,
  satisfaction: Math.round((93.4 + ((i * 11) % 36) / 10) * 10) / 10,
  authorizedBusinesses: i % 3 === 0 ? ['综合受理', w.business] : [w.business],
}));

// 办事市民居住地分布（区县着色，支撑服务站选址决策）
export const residenceDistribution = [
  { name: '萧山区', value: 1642 },
  { name: '余杭区', value: 1418 },
  { name: '西湖区', value: 1386 },
  { name: '上城区', value: 1204 },
  { name: '拱墅区', value: 986 },
  { name: '钱塘区', value: 911 },
  { name: '滨江区', value: 874 },
  { name: '临平区', value: 642 },
  { name: '富阳区', value: 418 },
  { name: '临安区', value: 276 },
  { name: '桐庐县', value: 163 },
  { name: '建德市', value: 141 },
  { name: '淳安县', value: 88 },
];

// 预约与分流指标
export const diversionStats = {
  onlineRate: 62.8,        // 网办分流率 %
  onlineRateTrend: -1.4,   // 环比 pp
  noShowRate: 8.6,         // 预约爽约率 %
  selfServiceShare: 19.4,  // 自助办理占比 %
};

// 设备运行状态（来源：终端管理平台心跳）
export type DeviceStatus = 'online' | 'offline' | 'fault';
export const deviceStats = {
  devices: [
    { name: '自助终端01', type: '自助终端', status: 'online' as DeviceStatus },
    { name: '自助终端02', type: '自助终端', status: 'online' as DeviceStatus },
    { name: '自助终端03', type: '自助终端', status: 'offline' as DeviceStatus, offlineMinutes: 12 },
    { name: '自助终端04', type: '自助终端', status: 'online' as DeviceStatus },
    { name: '取号机01', type: '取号机', status: 'online' as DeviceStatus },
    { name: '取号机02', type: '取号机', status: 'online' as DeviceStatus },
    { name: '评价器05', type: '评价器', status: 'fault' as DeviceStatus, offlineMinutes: 47 },
    { name: '高拍仪03', type: '高拍仪', status: 'online' as DeviceStatus },
  ],
  workOrders: [
    { id: 'WO-20261119-0216', device: '自助终端03', status: '已派单', time: '10:21:08' },
    { id: 'WO-20261119-0144', device: '评价器05', status: '处理中', time: '09:36:41' },
  ],
};

// 各省市来访办事人数（用于地图着色与排行）
export const provinceVisitData = [
  { name: '广东省', value: 4820 },
  { name: '北京市', value: 4350 },
  { name: '上海市', value: 3980 },
  { name: '四川省', value: 3420 },
  { name: '浙江省', value: 3160 },
  { name: '江苏省', value: 2870 },
  { name: '山东省', value: 2540 },
  { name: '河南省', value: 2310 },
  { name: '湖北省', value: 2080 },
  { name: '陕西省', value: 1860 },
  { name: '湖南省', value: 1720 },
  { name: '福建省', value: 1580 },
  { name: '安徽省', value: 1430 },
  { name: '河北省', value: 1350 },
  { name: '重庆市', value: 1290 },
  { name: '辽宁省', value: 1120 },
  { name: '江西省', value: 980 },
  { name: '广西壮族自治区', value: 920 },
  { name: '云南省', value: 860 },
  { name: '山西省', value: 780 },
  { name: '贵州省', value: 720 },
  { name: '黑龙江省', value: 650 },
  { name: '吉林省', value: 590 },
  { name: '天津市', value: 560 },
  { name: '内蒙古自治区', value: 480 },
  { name: '甘肃省', value: 420 },
  { name: '新疆维吾尔自治区', value: 380 },
  { name: '海南省', value: 320 },
  { name: '宁夏回族自治区', value: 260 },
  { name: '青海省', value: 190 },
  { name: '西藏自治区', value: 120 },
];
