// Mock 数据定义

// 市民年龄分布数据
export const ageDistributionData = [
  { name: '一季度', '0-16岁': 85,  '17-39岁': 310, '40-59岁': 420, '60岁以上': 185 },
  { name: '二季度', '0-16岁': 110, '17-39岁': 380, '40-59岁': 460, '60岁以上': 210 },
  { name: '三季度', '0-16岁': 95,  '17-39岁': 350, '40-59岁': 390, '60岁以上': 230 },
  { name: '四季度', '0-16岁': 70,  '17-39岁': 290, '40-59岁': 440, '60岁以上': 260 },
];

// 每周人流量数据
export const weeklyFlowData = [
  { name: '周一', 类型一: 200, 类型二: 150 },
  { name: '周二', 类型一: 180, 类型二: 120 },
  { name: '周三', 类型一: 300, 类型二: 250 },
  { name: '周四', 类型一: 250, 类型二: 180 },
  { name: '周五', 类型一: 350, 类型二: 300 },
  { name: '周六', 类型一: 200, 类型二: 160 },
  { name: '周日', 类型一: 150, 类型二: 100 },
];

// 热门办理事项
export const serviceCategories = ['户籍办理', '社保查询', '营业执照', '不动产登记', '公积金', '税务申报'];

// 业务办理统计
export const visitStatistics = {
  lastMonth: {
    infant: 45623,
    adult: 32108,
  },
  thisMonth: {
    youth: 52109,
    elderly: 28847,
  },
};

// 预约时段分布
export const appointmentSlots = [
  { time: '08:00', count: 42 },
  { time: '09:00', count: 128 },
  { time: '10:00', count: 186 },
  { time: '11:00', count: 153 },
  { time: '12:00', count: 67 },
  { time: '13:00', count: 94 },
  { time: '14:00', count: 172 },
  { time: '15:00', count: 145 },
  { time: '16:00', count: 98 },
  { time: '17:00', count: 53 },
];

// 公告内容
export const announcement = '本大厅实行全程网上预约，请市民提前通过政务APP或官网进行预约办理。窗口3-5号暂停服务，预计下午14:00恢复，如需办理请前往综合窗口。本周五大厅将进行消防演练，请各部门做好配合。';

// 服务叫号记录
export const serviceRecords = [
  { date: 'A-0231', name: '张**', service: '户籍办理', status: '已完成' },
  { date: 'B-0089', name: '李**', service: '社保查询', status: '办理中' },
  { date: 'A-0232', name: '王**', service: '营业执照', status: '已完成' },
  { date: 'C-0045', name: '赵**', service: '不动产登记', status: '待叫号' },
  { date: 'B-0090', name: '陈**', service: '公积金', status: '办理中' },
  { date: 'A-0233', name: '刘**', service: '税务申报', status: '已完成' },
  { date: 'D-0031', name: '孙**', service: '户籍办理', status: '待叫号' },
  { date: 'C-0046', name: '周**', service: '营业执照', status: '已完成' },
  { date: 'B-0091', name: '吴**', service: '社保查询', status: '办理中' },
  { date: 'A-0234', name: '郑**', service: '不动产登记', status: '已完成' },
];

// 各窗口服务量
export const windowUsageData = [
  { name: '综合窗口', 类型一: 200, 类型二: 150 },
  { name: '户籍窗口', 类型一: 280, 类型二: 220 },
  { name: '社保窗口', 类型一: 150, 类型二: 180 },
  { name: '税务窗口', 类型一: 300, 类型二: 260 },
  { name: '不动产', 类型一: 220, 类型二: 190 },
];

// 工作人员接待数据
export const staffData = [
  { name: '张某某', 接待数: 80, 目标: 90 },
  { name: '李某某', 接待数: 120, 目标: 100 },
  { name: '王某某', 接待数: 150, 目标: 130 },
  { name: '赵某某', 接待数: 90, 目标: 110 },
  { name: '陈某某', 接待数: 140, 目标: 120 },
];

// 今日政务服务情况
export const dailyServiceStats = {
  totalAppointments: 85420,
  pending: 1283,
  completed: 73918,
  processing: 2156,
  praised: 71862,
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
  bachelor: 73,
};
