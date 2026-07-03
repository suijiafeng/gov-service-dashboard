// API 服务层 - 模拟异步请求
import * as mockData from './mock/data';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 API 响应
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 包装响应
const wrapResponse = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  data,
  message: 'success',
});

// ============ 左侧面板 API ============

// 获取热门办理事项
export async function getServiceCategories() {
  await delay(100);
  return wrapResponse(mockData.serviceCategories);
}

// 获取今日办理事项排行
export async function getServiceItemRanking() {
  await delay(110);
  return wrapResponse(mockData.serviceItemRanking);
}

// 获取运行成效趋势
export async function getPerformanceTrend() {
  await delay(120);
  return wrapResponse(mockData.performanceTrend);
}

// 获取市民年龄分布
export async function getAgeDistribution() {
  await delay(150);
  return wrapResponse(mockData.ageDistributionData);
}

// 获取每周人流量
export async function getWeeklyFlow() {
  await delay(120);
  return wrapResponse(mockData.weeklyFlowData);
}

// 获取业务办理统计
export async function getVisitStatistics() {
  await delay(100);
  return wrapResponse(mockData.visitStatistics);
}

// ============ 右侧面板 API ============

// 获取公告内容
export async function getAnnouncement() {
  await delay(80);
  return wrapResponse(mockData.announcement);
}

// 获取服务叫号记录
export async function getServiceRecords() {
  await delay(130);
  return wrapResponse(mockData.serviceRecords);
}

// 获取窗口服务量统计
export async function getWindowUsage() {
  await delay(140);
  return wrapResponse(mockData.windowUsageData);
}

// 获取工作人员接待数据
export async function getStaffData() {
  await delay(110);
  return wrapResponse(mockData.staffData);
}

// 获取今日政务服务统计
export async function getDailyServiceStats() {
  await delay(90);
  return wrapResponse(mockData.dailyServiceStats);
}

// 获取预约时段分布
export async function getAppointmentSlots() {
  await delay(100);
  return wrapResponse(mockData.appointmentSlots);
}

// ============ 中间面板 API ============

// 获取自助终端使用统计
export async function getEquipmentStats() {
  await delay(120);
  return wrapResponse(mockData.equipmentStats);
}

// 获取地图流向数据
export async function getMapFlowData() {
  await delay(100);
  return wrapResponse(mockData.mapFlowData);
}

// 获取各省市来访人数
export async function getProvinceVisits() {
  await delay(100);
  return wrapResponse(mockData.provinceVisitData);
}

// 获取网上办件率
export async function getEducationStats() {
  await delay(80);
  return wrapResponse(mockData.educationStats);
}

// ============ v2 调度模式 API ============
// P1 阶段将替换为真实系统对接（排队叫号 WebSocket / 一窗受理 / 好差评），契约保持不变

export async function getQueueData() {
  await delay(80);
  return wrapResponse(mockData.queueData);
}

export async function getWindowMatrix() {
  await delay(80);
  return wrapResponse(mockData.windowMatrix);
}

export async function getEfficiencyStats() {
  await delay(90);
  return wrapResponse(mockData.efficiencyStats);
}

export async function getOverdueItems() {
  await delay(90);
  return wrapResponse(mockData.overdueItems);
}

export async function getSatisfactionStats() {
  await delay(90);
  return wrapResponse(mockData.satisfactionStats);
}

export async function getStaffPerformance() {
  await delay(100);
  return wrapResponse(mockData.staffPerformance);
}

export async function getSiteData() {
  await delay(100);
  return wrapResponse(mockData.siteData);
}

export async function getSiteDetails() {
  await delay(80);
  return wrapResponse(mockData.siteDetails);
}

export async function getWindowDetails() {
  await delay(80);
  return wrapResponse(mockData.windowDetails);
}

export async function getResidenceDistribution() {
  await delay(100);
  return wrapResponse(mockData.residenceDistribution);
}

export async function getDiversionStats() {
  await delay(80);
  return wrapResponse(mockData.diversionStats);
}

export async function getDeviceStats() {
  await delay(80);
  return wrapResponse(mockData.deviceStats);
}

// ============ 导出类型 ============
export type AgeDistributionItem = typeof mockData.ageDistributionData[number];
export type WeeklyFlowItem = typeof mockData.weeklyFlowData[number];
export type ServiceRecord = typeof mockData.serviceRecords[number];
export type WindowUsageItem = typeof mockData.windowUsageData[number];
export type StaffDataItem = typeof mockData.staffData[number];
export type EquipmentStatsItem = typeof mockData.equipmentStats[number];
export type DailyServiceStats = typeof mockData.dailyServiceStats;
export type VisitStatistics = typeof mockData.visitStatistics;
export type MapFlowData = typeof mockData.mapFlowData;
export type ProvinceVisitItem = typeof mockData.provinceVisitData[number];
export type QueueItem = typeof mockData.queueData[number];
export type WindowMatrixItem = typeof mockData.windowMatrix[number];
export type EfficiencyStats = typeof mockData.efficiencyStats;
export type OverdueRecord = typeof mockData.overdueItems[number];
export type SatisfactionStats = typeof mockData.satisfactionStats;
export type StaffPerformanceItem = typeof mockData.staffPerformance[number];
export type SiteItem = typeof mockData.siteData[number];
export type ResidenceItem = typeof mockData.residenceDistribution[number];
export type DiversionStats = typeof mockData.diversionStats;
export type DeviceStats = typeof mockData.deviceStats;
export type SiteDetails = typeof mockData.siteDetails;
export type WindowDetailItem = typeof mockData.windowDetails[number];
export type ServiceItemRankingItem = typeof mockData.serviceItemRanking[number];
export type PerformanceTrendItem = typeof mockData.performanceTrend[number];
export type EducationStats = typeof mockData.educationStats;
